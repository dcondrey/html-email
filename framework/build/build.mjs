#!/usr/bin/env node
/**
 * build.mjs — assemble the email from partials.
 *
 * The partials in ../partials are the single source of truth. This script
 * concatenates them in the manifest order, resolves {{>include}} references,
 * optionally injects content from content.json, and optionally minifies for
 * production. There is NO framework dependency and NO MJML: the output HTML is
 * byte-for-byte the same hand-tuned markup you would get by copy-pasting the
 * partials yourself. That is deliberate — MJML and similar compilers drop
 * fidelity on the oldest clients, which breaks the never-drop-support promise.
 *
 * Usage:
 *   node build.mjs                         populated preview  -> dist/email.html
 *   node build.mjs --production            + strip doc comments & collapse ws
 *   node build.mjs --skeleton --out ../template.html   fill-in master (keeps {{fields}})
 *   node build.mjs --out path.html         choose output path
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPreservedComment, withAttribution } from './banner.mjs';
import { stripComments } from './comments.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PARTIALS = resolve(__dirname, '..', 'partials');

// Top-level assembly order. Duplicate 40-columns for more rows, drop any you
// do not need. preheader and button are include-only (pulled in via {{>name}}).
const MANIFEST = [
  '00-document-open.html',
  '20-header.html',
  '30-hero.html',
  '40-columns.html',
  '60-footer.html',
  '99-document-close.html',
];

// ---- args ------------------------------------------------------------------
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt  = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : dflt;
};
const SKELETON   = flag('skeleton');
const PRODUCTION = flag('production');
const OUT = resolve(__dirname, opt('out', SKELETON ? '../template.html' : '../dist/email.html'));

// ---- load partials & build a name->content map for includes ----------------
const files = readdirSync(PARTIALS).filter((f) => f.endsWith('.html'));
const byShortName = {};        // "50-button.html" -> "button"
for (const f of files) {
  const short = f.replace(/^\d+-/, '').replace(/\.html$/, '');
  byShortName[short] = readFileSync(join(PARTIALS, f), 'utf8');
}

// ---- resolve {{>name}} includes (also inside HTML comments), recursively ----
function resolveIncludes(html, depth = 0) {
  if (depth > 10) throw new Error('Include recursion too deep — check for a cycle.');
  return html.replace(/(?:<!--\s*)?{{>\s*([\w-]+)\s*}}(?:\s*-->)?/g, (_, name) => {
    if (!(name in byShortName)) throw new Error(`Unknown include: {{>${name}}}`);
    return resolveIncludes(byShortName[name], depth + 1);
  });
}

let html = resolveIncludes(MANIFEST.map((f) => readFileSync(join(PARTIALS, f), 'utf8')).join('\n'));

// ---- inject content --------------------------------------------------------
if (!SKELETON) {
  const content = JSON.parse(readFileSync(resolve(__dirname, 'content.json'), 'utf8'));
  // Validate before injecting: every {{field}} the template references must
  // exist in content.json, and (informationally) flag content keys no partial
  // uses — those are typos or dead keys. A missing field is a hard failure: it
  // would otherwise ship as a literal {{field}} in the inbox.
  const referenced = new Set([...html.matchAll(/{{\s*([\w-]+)\s*}}/g)].map((m) => m[1]));
  // Unused is judged against EVERY partial, not just the assembled ones: a key
  // used only by an optional off-manifest partial (e.g. the background-image
  // hero) is legitimate, not a dead key.
  const anyPartialText = Object.values(byShortName).join('\n');
  const referencedAnywhere = new Set([...anyPartialText.matchAll(/{{\s*([\w-]+)\s*}}/g)].map((m) => m[1]));
  const missing = [...referenced].filter((k) => !(k in content));
  const unused = Object.keys(content).filter((k) => !referencedAnywhere.has(k));
  if (unused.length) console.log(`  ⚠ content.json keys never used by a partial: ${unused.join(', ')}`);
  if (missing.length) {
    console.error(`  ✗ ${missing.length} {{field}} missing from content.json: ${missing.join(', ')}`);
    process.exit(1);
  }
  html = html.replace(/{{\s*([\w-]+)\s*}}/g, (m, key) => (key in content ? content[key] : m));
}

// ---- production minify (keep MSO conditional comments!) --------------------
if (PRODUCTION) {
  // Drop documentation comments only. Preserve <!--[if ...]> ... <![endif]-->
  // and the <!--[if !mso]><!--> ... <!--<![endif]--> "downlevel-revealed" forms.
  html = stripComments(html, isPreservedComment);
  // Collapse runs of whitespace between tags; keep a single newline for sanity.
  html = html.replace(/>\s+</g, '><').replace(/^\s*[\r\n]/gm, '');
}

// ---- write -----------------------------------------------------------------
mkdirSync(dirname(OUT), { recursive: true });
// The skeleton is a fill-in master, not a shipped email; it carries no notice.
const output = SKELETON ? html.trimStart() : withAttribution(html.trimStart());
writeFileSync(OUT, output + '\n', 'utf8');

const bytes = Buffer.byteLength(output, 'utf8');
const kb = (bytes / 1024).toFixed(1);
const clip = bytes > 102000 ? '  ⚠ over Gmail 102KB clip threshold' : '';
console.log(`built ${OUT}  (${kb} KB${clip})${SKELETON ? '  [skeleton]' : ''}${PRODUCTION ? '  [production]' : ''}`);
