#!/usr/bin/env node
/**
 * lint.mjs — enforce the cross-client rules this project documents.
 *
 * The README explains ~26 quirks. This turns the load-bearing ones into
 * automated checks so a broken email fails the build instead of the inbox.
 * Zero dependencies; regex-based on purpose (a DOM parser would normalise away
 * the very Outlook/VML quirks we care about).
 *
 * Usage:  node lint.mjs ../dist/email.html
 * Exit 1 on any FAIL. WARN and INFO never fail the build.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = process.argv[2] || '../dist/email.html';
const html = readFileSync(resolve(process.cwd(), file), 'utf8');
const bytes = Buffer.byteLength(html, 'utf8');

// Structural checks (img/table/role) must ignore text inside DOCUMENTATION
// comments — e.g. the word "<img>" written in a comment is not an image tag.
// We strip only non-conditional comments, keeping <!--[if …]> / <![endif]-->
// (and the downlevel-revealed reveal) so real tags inside them still count.
const structural = html.replace(/<!--[\s\S]*?-->/g, (c) =>
  /\[if\b|<!\[endif\]|\[endif\]/.test(c) ? c : ''
);

let fails = 0, warns = 0;
const FAIL = (m) => { fails++; console.log(`  \x1b[31mFAIL\x1b[0m  ${m}`); };
const WARN = (m) => { warns++; console.log(`  \x1b[33mWARN\x1b[0m  ${m}`); };
const PASS = (m) => console.log(`  \x1b[32mPASS\x1b[0m  ${m}`);
const INFO = (m) => console.log(`  \x1b[36mINFO\x1b[0m  ${m}`);

console.log(`\nLinting ${file}  (${(bytes / 1024).toFixed(1)} KB)\n`);

// 1. Gmail clips > ~102KB, hiding the footer + unsubscribe link.
bytes > 102000
  ? FAIL(`Size ${(bytes/1024).toFixed(1)}KB exceeds Gmail's ~102KB clip threshold — footer/unsubscribe will be hidden.`)
  : PASS(`Under Gmail's 102KB clip threshold (${(bytes/1024).toFixed(1)}KB).`);

// 2. Gmail strips the ENTIRE <style> block if it exceeds 8192 chars OR has any
//    CSS error. Check size AND brace balance of every non-MSO <style> block.
const styleBlocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
  .map((m) => ({ css: m[1], mso: html.slice(Math.max(0, m.index - 40), m.index).includes('[if mso]') }))
  .filter((b) => !b.mso);
let biggest = 0, braceProblem = false;
for (const b of styleBlocks) {
  biggest = Math.max(biggest, b.css.length);
  const open = (b.css.match(/{/g) || []).length;
  const close = (b.css.match(/}/g) || []).length;
  if (open !== close) braceProblem = true;
}
biggest > 8192
  ? FAIL(`Largest <style> block is ${biggest} chars (> 8192). Gmail will strip ALL embedded CSS (dark mode + responsive lost).`)
  : PASS(`Largest <style> block ${biggest} chars (< 8192 Gmail limit).`);
braceProblem
  ? FAIL(`Unbalanced { } in a <style> block. Gmail strips the whole block on any CSS error.`)
  : PASS(`<style> braces balanced (Gmail parses all-or-nothing).`);

// 3. Every <img> must have an alt attribute (Outlook blocks images by default).
//    Empty alt="" is allowed (decorative); a MISSING alt attribute is a fail.
const imgs = [...structural.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
const noAlt = imgs.filter((t) => !/\balt\s*=/.test(t));
noAlt.length
  ? FAIL(`${noAlt.length} <img> without an alt attribute (blocked-image fallback + screen readers). First: ${noAlt[0].slice(0,80)}…`)
  : PASS(`All ${imgs.length} <img> tags have an alt attribute.`);

// 3b. Every <img> needs a width ATTRIBUTE, not just CSS. Classic Outlook's Word
//     engine ignores CSS width/max-width and draws images at their natural pixel
//     size; a source image wider than the 600px container then blows the layout
//     open (a real 2358px hero overflow is what prompted this rule). The
//     attribute must be present even when style also sets a width.
const noWidth = imgs.filter((t) => !/\bwidth\s*=/.test(t));
noWidth.length
  ? FAIL(`${noWidth.length} <img> without a width attribute — Outlook (Word) draws these at natural size, so any oversized source image overflows the 600px layout. First: ${noWidth[0].slice(0,80)}…`)
  : PASS(`All ${imgs.length} <img> tags carry a width attribute (Outlook ignores CSS width and draws at natural size otherwise).`);

// 4. Bulletproof button present (VML) — dead click area in Outlook otherwise.
/v:roundrect/i.test(html)
  ? PASS(`VML <v:roundrect> button present (clickable in classic Outlook).`)
  : WARN(`No <v:roundrect> found — any CTA button will have a dead click area in classic Outlook.`);

// 5. MSO conditional comments must balance ([if …] vs <![endif]).
const ifs = (html.match(/<!--\[if\b/gi) || []).length;
const endifs = (html.match(/<!\[endif\]/gi) || []).length;
ifs === endifs
  ? PASS(`MSO conditionals balanced (${ifs} open / ${endifs} close).`)
  : FAIL(`MSO conditional mismatch: ${ifs} "[if …]" vs ${endifs} "<![endif]" — Outlook markup will break.`);

// 6. Dark-mode inversion risk: pure #000000 / #ffffff get force-inverted by
//    Apple Mail unless color-scheme is declared. Informational unless the meta
//    is missing.
const pureColors = (structural.match(/#(?:000000|ffffff|000|fff)\b/gi) || []).length;
const hasColorScheme = /supported-color-schemes/i.test(html) && /name=["']color-scheme["']/i.test(html);
if (pureColors && !hasColorScheme) {
  WARN(`${pureColors} pure #000/#fff values and no color-scheme meta — Apple Mail will force-invert them in dark mode.`);
} else if (pureColors) {
  INFO(`${pureColors} pure #000/#fff values present, but color-scheme meta is set — you control dark mode, so this is fine.`);
} else {
  PASS(`No unguarded pure #000/#fff values.`);
}

// 7. A real unsubscribe link (compliance + Gmail/Yahoo one-click requirement).
//    Test the comment-stripped markup so the word "unsubscribe" in a code
//    comment cannot masquerade as an actual link.
/unsubscrib/i.test(structural)
  ? PASS(`Unsubscribe link present.`)
  : FAIL(`No unsubscribe link found — required for CAN-SPAM/CASL/GDPR and Gmail/Yahoo bulk sending.`);

// 8. Layout tables should carry role="presentation" (screen-reader noise).
const tables = (structural.match(/<table\b/gi) || []).length;
const presRoles = (structural.match(/role=["']presentation["']/gi) || []).length;
presRoles >= tables
  ? PASS(`All ${tables} tables marked role="presentation".`)
  : WARN(`${tables - presRoles} of ${tables} tables lack role="presentation" (screen readers will announce them as data tables).`);

// 9. Viewport + charset (mobile scaling + encoding).
/name=["']viewport["']/i.test(html) && /charset/i.test(html)
  ? PASS(`viewport + charset meta present.`)
  : WARN(`Missing viewport or charset meta.`);

// --- House-conformance: the load-bearing techniques this framework is built on.
//     These are the invariants a new template must not silently drop. The three
//     that change how the email RENDERS across clients are failures; the
//     preheader (an inbox-presentation nicety) is a warning.

// 10. Dark-mode opt-in: both metas, so Apple Mail/Outlook stop force-inverting.
/name=["']color-scheme["']/i.test(html) && /name=["']supported-color-schemes["']/i.test(html)
  ? PASS(`color-scheme + supported-color-schemes meta present (deliberate dark-mode opt-in).`)
  : FAIL(`Missing color-scheme/supported-color-schemes meta — clients will force-invert colours in dark mode.`);

// 11. Outlook DPI pinning: PixelsPerInch 96 stops Word upscaling at high system DPI.
/<o:PixelsPerInch>\s*96\s*<\/o:PixelsPerInch>/i.test(html)
  ? PASS(`MSO PixelsPerInch pinned to 96 (Outlook renders images/widths 1:1).`)
  : FAIL(`No <o:PixelsPerInch>96 — classic Outlook upscales images and widths 25-50% at high system DPI.`);

// 12. Dark-mode CSS present (the prefers-color-scheme path; the framework also
//     carries [data-ogsc]/[data-ogsb] for Outlook.com).
/@media\s*\(prefers-color-scheme:\s*dark\)/i.test(html)
  ? PASS(`Dark-mode CSS present (prefers-color-scheme block).`)
  : FAIL(`No @media (prefers-color-scheme: dark) block — the template opts into dark mode but never styles it.`);

// 13. Hidden preheader: a display:none element that also zeroes its box, so the
//     inbox preview line is controlled instead of leaking body copy.
/display:\s*none[^>]*max-height:\s*0/i.test(html)
  ? PASS(`Hidden preheader present (controls the inbox preview line).`)
  : WARN(`No hidden preheader detected — the inbox preview will leak whatever body text comes first.`);

console.log(`\n${fails ? '\x1b[31m' : '\x1b[32m'}${fails} fail, ${warns} warn\x1b[0m\n`);
process.exit(fails ? 1 : 0);
