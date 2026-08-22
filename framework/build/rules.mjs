#!/usr/bin/env node
/**
 * rules.mjs — the cross-client rule set, as a pure function.
 *
 * analyze() does no I/O and never exits; lint.mjs wraps it with a CLI and
 * fuzz.test.js drives it directly. Rules are tagged `universal` (true of any
 * HTML email, whoever authored it) or `house` (this framework's own
 * load-bearing techniques), so pointing the linter at MJML or React Email
 * output does not fail on conventions that project never adopted.
 */

export const SEVERITY = { FAIL: 'fail', WARN: 'warn', PASS: 'pass', INFO: 'info' };

/** Gmail clips the message body past this, hiding the footer and unsubscribe. */
const GMAIL_CLIP_BYTES = 102000;
/** Gmail drops an entire <style> block over this many chars. */
const GMAIL_STYLE_CHARS = 8192;
/** Clients show roughly this much of the preheader before truncating. */
const PREHEADER_MAX_CHARS = 140;

const isConditional = (comment) => /\[if\b|<!\[endif\]|\[endif\]/.test(comment);

/**
 * Tokenize every open tag in one left-to-right pass.
 *
 * PERF: linear. `<tag[^>]*>` restarts a scan-to-end-of-string at every `<tag`
 * when the input has no closing `>`, which is quadratic — 2.4MB of unterminated
 * tags took 58s. Here `i` advances past each `>`, so the scans never overlap.
 * Tag boundaries are otherwise identical: both stop at the first `>`, including
 * one inside a quoted attribute value.
 */
function scanTags(source) {
  const tags = [];
  let i = 0;
  while (i < source.length) {
    const lt = source.indexOf('<', i);
    if (lt === -1) break;
    const gt = source.indexOf('>', lt + 1);
    if (gt === -1) break;
    const raw = source.slice(lt, gt + 1);
    const name = /^<([a-z][\w:-]*)/i.exec(raw);
    if (name) tags.push({ name: name[1].toLowerCase(), raw, start: lt, end: gt + 1 });
    i = gt + 1;
  }
  return tags;
}

const openTags = (tags, name) => tags.filter((t) => t.name === name);

/** Pull one attribute's value out of an already-isolated tag. */
function attr(tag, name) {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s"'>]+))`, 'i'));
  if (!m) return null;
  return m[2] ?? m[3] ?? m[4] ?? '';
}

/**
 * The hidden preheader: a <div> whose inline style both hides it and zeroes its
 * box, so the inbox preview line is controlled instead of leaking body copy.
 *
 * PERF: matched by scanning <div> opens and testing the style value separately.
 * The single-regex form (three `[^"'>]*` runs inside one pattern) backtracks
 * quadratically on near-misses — a 148KB email with many `display:none` divs
 * did not finish in two minutes.
 */
function findPreheader(html, tags) {
  for (const tag of openTags(tags, 'div')) {
    const style = attr(tag.raw, 'style');
    if (!style) continue;
    if (!/display:\s*none/i.test(style) || !/max-height:\s*0/i.test(style)) continue;
    const end = html.toLowerCase().indexOf('</div>', tag.end);
    return { inner: end === -1 ? html.slice(tag.end) : html.slice(tag.end, end) };
  }
  return null;
}

/**
 * Structural checks (img/table/role) must ignore text inside documentation
 * comments — the word "<img>" in a comment is not an image tag. Conditional
 * comments are kept so real Outlook markup inside them still counts.
 */
function stripDocComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, (c) => (isConditional(c) ? c : ''));
}

/**
 * The CSS of every non-MSO <style> block. An unterminated block is skipped, as
 * the original single-regex form did. PERF: linear, for the same reason
 * scanTags is — `<style[^>]*>` rescans to end-of-input at every `<style`.
 */
function findStyleBlocks(html, tags) {
  const lower = html.toLowerCase();
  const blocks = [];
  for (const tag of openTags(tags, 'style')) {
    const close = lower.indexOf('</style>', tag.end);
    if (close === -1) continue;
    if (html.slice(Math.max(0, tag.start - 40), tag.start).includes('[if mso]')) continue;
    blocks.push(html.slice(tag.end, close));
  }
  return blocks;
}

function buildContext(html) {
  const structural = stripDocComments(html);
  const tags = scanTags(html);
  const imgs = openTags(scanTags(structural), 'img').map((t) => t.raw);
  const styleBlocks = findStyleBlocks(html, tags);
  return {
    html,
    structural,
    imgs,
    styleBlocks,
    bytes: Buffer.byteLength(html, 'utf8'),
    preheader: findPreheader(html, tags),
  };
}

const kb = (bytes) => (bytes / 1024).toFixed(1);

export const RULES = [
  {
    id: 'gmail-clip',
    scope: 'universal',
    run: ({ bytes }) =>
      bytes > GMAIL_CLIP_BYTES
        ? [SEVERITY.FAIL, `Size ${kb(bytes)}KB exceeds Gmail's ~102KB clip threshold — footer/unsubscribe will be hidden.`]
        : [SEVERITY.PASS, `Under Gmail's 102KB clip threshold (${kb(bytes)}KB).`],
  },
  {
    id: 'gmail-style-size',
    scope: 'universal',
    run: ({ styleBlocks }) => {
      const biggest = styleBlocks.reduce((max, css) => Math.max(max, css.length), 0);
      return biggest > GMAIL_STYLE_CHARS
        ? [SEVERITY.FAIL, `Largest <style> block is ${biggest} chars (> 8192). Gmail will strip ALL embedded CSS (dark mode + responsive lost).`]
        : [SEVERITY.PASS, `Largest <style> block ${biggest} chars (< 8192 Gmail limit).`];
    },
  },
  {
    id: 'style-braces',
    scope: 'universal',
    run: ({ styleBlocks }) => {
      const unbalanced = styleBlocks.some(
        (css) => (css.match(/{/g) || []).length !== (css.match(/}/g) || []).length
      );
      return unbalanced
        ? [SEVERITY.FAIL, `Unbalanced { } in a <style> block. Gmail strips the whole block on any CSS error.`]
        : [SEVERITY.PASS, `<style> braces balanced (Gmail parses all-or-nothing).`];
    },
  },
  {
    id: 'img-alt',
    scope: 'universal',
    run: ({ imgs }) => {
      const noAlt = imgs.filter((t) => !/\balt\s*=/.test(t));
      return noAlt.length
        ? [SEVERITY.FAIL, `${noAlt.length} <img> without an alt attribute (blocked-image fallback + screen readers). First: ${noAlt[0].slice(0, 80)}…`]
        : [SEVERITY.PASS, `All ${imgs.length} <img> tags have an alt attribute.`];
    },
  },
  {
    // Classic Outlook's Word engine ignores CSS width and draws images at their
    // natural pixel size, so an oversized source blows the 600px container open.
    id: 'img-width',
    scope: 'universal',
    run: ({ imgs }) => {
      const noWidth = imgs.filter((t) => !/\bwidth\s*=/.test(t));
      return noWidth.length
        ? [SEVERITY.FAIL, `${noWidth.length} <img> without a width attribute — Outlook (Word) draws these at natural size, so any oversized source image overflows the 600px layout. First: ${noWidth[0].slice(0, 80)}…`]
        : [SEVERITY.PASS, `All ${imgs.length} <img> tags carry a width attribute (Outlook ignores CSS width and draws at natural size otherwise).`];
    },
  },
  {
    id: 'vml-button',
    scope: 'universal',
    run: ({ html }) =>
      /v:roundrect/i.test(html)
        ? [SEVERITY.PASS, `VML <v:roundrect> button present (clickable in classic Outlook).`]
        : [SEVERITY.WARN, `No <v:roundrect> found — any CTA button will have a dead click area in classic Outlook.`],
  },
  {
    id: 'mso-conditionals',
    scope: 'universal',
    run: ({ html }) => {
      const ifs = (html.match(/<!--\[if\b/gi) || []).length;
      const endifs = (html.match(/<!\[endif\]/gi) || []).length;
      return ifs === endifs
        ? [SEVERITY.PASS, `MSO conditionals balanced (${ifs} open / ${endifs} close).`]
        : [SEVERITY.FAIL, `MSO conditional mismatch: ${ifs} "[if …]" vs ${endifs} "<![endif]" — Outlook markup will break.`];
    },
  },
  {
    id: 'pure-color-inversion',
    scope: 'universal',
    run: ({ html, structural }) => {
      const pure = (structural.match(/#(?:000000|ffffff|000|fff)\b/gi) || []).length;
      const declared = /supported-color-schemes/i.test(html) && /name=["']color-scheme["']/i.test(html);
      if (pure && !declared) return [SEVERITY.WARN, `${pure} pure #000/#fff values and no color-scheme meta — Apple Mail will force-invert them in dark mode.`];
      if (pure) return [SEVERITY.INFO, `${pure} pure #000/#fff values present, but color-scheme meta is set — you control dark mode, so this is fine.`];
      return [SEVERITY.PASS, `No unguarded pure #000/#fff values.`];
    },
  },
  {
    id: 'unsubscribe',
    scope: 'universal',
    run: ({ structural }) =>
      /unsubscrib/i.test(structural)
        ? [SEVERITY.PASS, `Unsubscribe link present.`]
        : [SEVERITY.FAIL, `No unsubscribe link found — required for CAN-SPAM/CASL/GDPR and Gmail/Yahoo bulk sending.`],
  },
  {
    id: 'table-role',
    scope: 'universal',
    run: ({ structural }) => {
      const tables = (structural.match(/<table\b/gi) || []).length;
      const roles = (structural.match(/role=["']presentation["']/gi) || []).length;
      return roles >= tables
        ? [SEVERITY.PASS, `All ${tables} tables marked role="presentation".`]
        : [SEVERITY.WARN, `${tables - roles} of ${tables} tables lack role="presentation" (screen readers will announce them as data tables).`];
    },
  },
  {
    id: 'viewport-charset',
    scope: 'universal',
    run: ({ html }) =>
      /name=["']viewport["']/i.test(html) && /charset/i.test(html)
        ? [SEVERITY.PASS, `viewport + charset meta present.`]
        : [SEVERITY.WARN, `Missing viewport or charset meta.`],
  },
  {
    id: 'placeholder-href',
    scope: 'universal',
    run: ({ structural }) => {
      const n = (structural.match(/href=["'](?:#|)["']/gi) || []).length;
      return n
        ? [SEVERITY.INFO, `${n} placeholder href="#"/empty links — fine for samples, resolve before a real send.`]
        : [SEVERITY.PASS, `No placeholder href="#"/empty links.`];
    },
  },
  {
    id: 'dark-mode-declaration',
    scope: 'house',
    run: ({ html }) =>
      /name=["']color-scheme["']/i.test(html) && /name=["']supported-color-schemes["']/i.test(html)
        ? [SEVERITY.PASS, `color-scheme + supported-color-schemes meta present (deliberate dark-mode opt-in).`]
        : [SEVERITY.FAIL, `Missing color-scheme/supported-color-schemes meta — clients will force-invert colours in dark mode.`],
  },
  {
    id: 'outlook-dpi',
    scope: 'house',
    run: ({ html }) =>
      /<o:PixelsPerInch>\s*96\s*<\/o:PixelsPerInch>/i.test(html)
        ? [SEVERITY.PASS, `MSO PixelsPerInch pinned to 96 (Outlook renders images/widths 1:1).`]
        : [SEVERITY.FAIL, `No <o:PixelsPerInch>96 — classic Outlook upscales images and widths 25-50% at high system DPI.`],
  },
  {
    id: 'dark-mode-css',
    scope: 'house',
    run: ({ html }) =>
      /@media\s*\(prefers-color-scheme:\s*dark\)/i.test(html)
        ? [SEVERITY.PASS, `Dark-mode CSS present (prefers-color-scheme block).`]
        : [SEVERITY.FAIL, `No @media (prefers-color-scheme: dark) block — the template opts into dark mode but never styles it.`],
  },
  {
    id: 'preheader',
    scope: 'house',
    run: ({ preheader }) =>
      preheader
        ? [SEVERITY.PASS, `Hidden preheader present (controls the inbox preview line).`]
        : [SEVERITY.WARN, `No hidden preheader detected — the inbox preview will leak whatever body text comes first.`],
  },
  {
    id: 'preheader-length',
    scope: 'house',
    run: ({ preheader }) => {
      if (!preheader) return null;
      const text = preheader.inner
        .replace(/&zwnj;|&nbsp;|&#8203;|&#x200c;|&#xfeff;/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      return text.length > PREHEADER_MAX_CHARS
        ? [SEVERITY.WARN, `Preheader is ${text.length} chars — clients truncate around 90-140, so the tail is wasted.`]
        : [SEVERITY.PASS, `Preheader length ${text.length} chars (within the ~140 clients show).`];
    },
  },
];

export const PROFILES = {
  universal: ['universal'],
  house: ['universal', 'house'],
};

/**
 * Analyze one email's HTML. Pure: no reads, no writes, no exit.
 * Returns `{ bytes, profile, findings, fails, warns }`.
 */
export function analyze(html, { profile = 'universal' } = {}) {
  const scopes = PROFILES[profile];
  if (!scopes) throw new Error(`Unknown profile "${profile}" (expected: ${Object.keys(PROFILES).join(', ')})`);

  const ctx = buildContext(html);
  const findings = [];
  for (const rule of RULES) {
    if (!scopes.includes(rule.scope)) continue;
    const result = rule.run(ctx);
    if (!result) continue;
    findings.push({ id: rule.id, scope: rule.scope, severity: result[0], message: result[1] });
  }
  return {
    bytes: ctx.bytes,
    profile,
    findings,
    fails: findings.filter((f) => f.severity === SEVERITY.FAIL).length,
    warns: findings.filter((f) => f.severity === SEVERITY.WARN).length,
  };
}
