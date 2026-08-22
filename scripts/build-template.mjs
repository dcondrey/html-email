#!/usr/bin/env node
/**
 * build-template.mjs — assemble a named template from its own partials.
 *
 * Generalizes framework/build/build.mjs so the repo can host MORE than one
 * design. Each template lives under templates/<name>/ and owns its partials,
 * a manifest (ordered partial list), content.json, assets, and dist output —
 * the same partial+inject+lint structure as the framework, one design per dir.
 *
 *   templates/<name>/
 *     partials/*.html        section markup with {{fields}} and {{>includes}}
 *     build/manifest.json    ordered list of top-level partial filenames
 *     build/content.json     values injected for {{fields}}
 *     assets/                images
 *     dist/email.html        build output
 *
 * Usage:
 *   node scripts/build-template.mjs templates/cairn-wellness
 *   node scripts/build-template.mjs templates/cairn-wellness --production
 *   node scripts/build-template.mjs templates/cairn-wellness --out path.html
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { isPreservedComment, withAttribution } from '../framework/build/banner.mjs';
import { stripComments } from '../framework/build/comments.mjs';

const args = process.argv.slice(2);
const TEMPLATE = args.find((a) => !a.startsWith('--'));
if (!TEMPLATE) {
  console.error('usage: node scripts/build-template.mjs templates/<name> [--production] [--out file]');
  process.exit(2);
}
const flag = (name) => args.includes(`--${name}`);
const opt = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : dflt;
};
const PRODUCTION = flag('production');

const ROOT = resolve(process.cwd(), TEMPLATE);
const PARTIALS = join(ROOT, 'partials');
const MANIFEST_FILE = join(ROOT, 'build', 'manifest.json');
const CONTENT_FILE = join(ROOT, 'build', 'content.json');
const OUT = resolve(ROOT, opt('out', 'dist/email.html'));

// ---- load partials & build a name->content map for {{>includes}} -----------
const files = readdirSync(PARTIALS).filter((f) => f.endsWith('.html'));
const byShortName = {};
for (const f of files) {
  const short = f.replace(/^\d+-/, '').replace(/\.html$/, '');
  byShortName[short] = readFileSync(join(PARTIALS, f), 'utf8');
}

function resolveIncludes(html, depth = 0) {
  if (depth > 10) throw new Error('Include recursion too deep — check for a cycle.');
  return html.replace(/(?:<!--\s*)?{{>\s*([\w-]+)\s*}}(?:\s*-->)?/g, (_, name) => {
    if (!(name in byShortName)) throw new Error(`Unknown include: {{>${name}}}`);
    return resolveIncludes(byShortName[name], depth + 1);
  });
}

// ---- assemble in manifest order --------------------------------------------
const manifest = JSON.parse(readFileSync(MANIFEST_FILE, 'utf8'));
let html = resolveIncludes(manifest.map((f) => readFileSync(join(PARTIALS, f), 'utf8')).join('\n'));

// ---- inject content --------------------------------------------------------
// Validate before injecting: every {{field}} the partials reference must exist
// in content.json (a miss is fatal — it would ship as a literal {{field}}), and
// content keys no partial uses are flagged as likely typos or dead keys.
const content = JSON.parse(readFileSync(CONTENT_FILE, 'utf8'));
const referenced = new Set([...html.matchAll(/{{\s*([\w-]+)\s*}}/g)].map((m) => m[1]));
// Unused is judged against EVERY partial (byShortName), not just the assembled
// output, so a key used only by an optional off-manifest partial is not a
// false "dead key".
const anyPartialText = Object.values(byShortName).join('\n');
const referencedAnywhere = new Set([...anyPartialText.matchAll(/{{\s*([\w-]+)\s*}}/g)].map((m) => m[1]));
const missing = [...referenced].filter((k) => !(k in content));
const unused = Object.keys(content).filter((k) => !referencedAnywhere.has(k));
if (unused.length) console.log(`  ⚠ content.json keys never used by a partial: ${unused.join(', ')}`);
if (missing.length) {
  console.error(`  ✗ ${missing.length} {{field}} missing from ${basename(TEMPLATE)}/build/content.json: ${missing.join(', ')}`);
  process.exit(1);
}
html = html.replace(/{{\s*([\w-]+)\s*}}/g, (m, key) => content[key]);

// ---- production minify (keep MSO conditional comments!) ---------------------
if (PRODUCTION) {
  html = stripComments(html, isPreservedComment);
  html = html.replace(/>\s+</g, '><').replace(/^\s*[\r\n]/gm, '');
}

// ---- write -----------------------------------------------------------------
mkdirSync(dirname(OUT), { recursive: true });
const output = withAttribution(html.trimStart());
writeFileSync(OUT, output + '\n', 'utf8');

const kb = (Buffer.byteLength(output, 'utf8') / 1024).toFixed(1);
const clip = Buffer.byteLength(output, 'utf8') > 102000 ? '  ⚠ over Gmail 102KB clip threshold' : '';
console.log(`built ${basename(TEMPLATE)} -> ${OUT}  (${kb} KB${clip})${PRODUCTION ? '  [production]' : ''}`);
