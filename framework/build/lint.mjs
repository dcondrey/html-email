#!/usr/bin/env node
/**
 * lint.mjs — CLI over the cross-client rule set in rules.mjs.
 *
 * Zero dependencies; regex-based on purpose (a DOM parser would normalise away
 * the very Outlook/VML quirks we care about). Exit 1 if any file has a FAIL.
 *
 * Usage:
 *   lint.mjs <file...>                      universal rules (any HTML email)
 *   lint.mjs --profile house <file...>      + this framework's own conventions
 *   lint.mjs --json|--sarif <file...>       machine-readable output
 *   lint.mjs --quiet <file...>              suppress PASS/INFO lines
 */
import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { analyze, PROFILES, SEVERITY } from './rules.mjs';

const argv = process.argv.slice(2);
const has = (name) => argv.includes(`--${name}`);
const opt = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : dflt;
};

if (has('help') || has('h')) {
  console.log(`html-email-lint — cross-client HTML email linter

  lint.mjs [options] <file...>

  --profile <universal|house>  rule set (default: universal)
  --json | --sarif             machine-readable output
  --quiet                      only FAIL/WARN lines
  --help                       this message`);
  process.exit(0);
}

const PROFILE = opt('profile', 'universal');
if (!PROFILES[PROFILE]) {
  console.error(`lint: unknown profile "${PROFILE}" (expected: ${Object.keys(PROFILES).join(', ')})`);
  process.exit(2);
}

const FORMAT = has('sarif') ? 'sarif' : has('json') ? 'json' : 'human';
const QUIET = has('quiet');

const files = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--profile');
if (!files.length) files.push('../dist/email.html');

const COLOR = { fail: '\x1b[31m', warn: '\x1b[33m', pass: '\x1b[32m', info: '\x1b[36m' };
const LABEL = { fail: 'FAIL', warn: 'WARN', pass: 'PASS', info: 'INFO' };
const shown = (severity) => !QUIET || severity === SEVERITY.FAIL || severity === SEVERITY.WARN;

const reports = [];
let exitCode = 0;

for (const file of files) {
  const path = resolve(process.cwd(), file);
  let html;
  try {
    html = readFileSync(path, 'utf8');
  } catch (err) {
    console.error(`lint: cannot read ${file}: ${err.message}`);
    process.exit(2);
  }

  const report = analyze(html, { profile: PROFILE });
  reports.push({ file, path, ...report });
  if (report.fails) exitCode = 1;

  if (FORMAT !== 'human') continue;

  console.log(`\nLinting ${file}  (${(report.bytes / 1024).toFixed(1)} KB)\n`);
  for (const f of report.findings) {
    if (shown(f.severity)) console.log(`  ${COLOR[f.severity]}${LABEL[f.severity]}\x1b[0m  ${f.message}`);
  }
  console.log(`\n${report.fails ? '\x1b[31m' : '\x1b[32m'}${report.fails} fail, ${report.warns} warn\x1b[0m\n`);
}

if (FORMAT === 'json') {
  console.log(JSON.stringify({ profile: PROFILE, results: reports.map(({ path, ...r }) => r) }, null, 2));
}

if (FORMAT === 'sarif') {
  const LEVEL = { fail: 'error', warn: 'warning', info: 'note', pass: 'none' };
  const reported = reports.flatMap((r) =>
    r.findings
      .filter((f) => f.severity !== SEVERITY.PASS)
      .map((f) => ({
        ruleId: f.id,
        level: LEVEL[f.severity],
        message: { text: f.message },
        locations: [
          {
            physicalLocation: {
              artifactLocation: { uri: relative(process.cwd(), r.path) || r.file },
              region: { startLine: 1 },
            },
          },
        ],
      }))
  );
  console.log(
    JSON.stringify(
      {
        $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
        version: '2.1.0',
        runs: [
          {
            tool: { driver: { name: 'html-email-lint', informationUri: 'https://github.com/dcondrey/html-email' } },
            results: reported,
          },
        ],
      },
      null,
      2
    )
  );
}

process.exit(exitCode);
