#!/usr/bin/env node
/**
 * lint.test.mjs — a self-test for lint.mjs.
 *
 * The linter is the quality gate, so it needs its own proof that it still
 * catches what it claims. This runs the real lint.mjs CLI against two fixtures:
 *   test/good.html — a valid email that must pass (exit 0, "0 fail")
 *   test/bad.html  — an email that trips several rules (exit 1, specific FAILs)
 * and asserts the exit codes plus the expected FAIL messages. Zero dependencies.
 *
 * Usage:  node framework/build/lint.test.mjs      (exit 1 if any assertion fails)
 */
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LINT = join(__dirname, 'lint.mjs');
const GOOD = join(__dirname, 'test', 'good.html');
const BAD = join(__dirname, 'test', 'bad.html');

// Run lint.mjs on a file; return { code, out } without throwing on non-zero exit.
function runLint(file) {
  try {
    const out = execFileSync('node', [LINT, file], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout || ''}${e.stderr || ''}` };
  }
}

let failures = 0;
const assert = (cond, msg) => {
  if (cond) {
    console.log(`  \x1b[32mok\x1b[0m    ${msg}`);
  } else {
    failures++;
    console.log(`  \x1b[31mNOT OK\x1b[0m ${msg}`);
  }
};

console.log('\nlint.mjs self-test\n');

// --- good fixture: must pass cleanly (the gold-standard, 0 fail AND 0 warn) ---
const good = runLint(GOOD);
assert(good.code === 0, 'good.html exits 0');
assert(/0 fail/.test(good.out), 'good.html reports 0 fail');
assert(/0 fail, 0 warn/.test(good.out), 'good.html reports 0 warn (fully conformant)');
assert(/Preheader length \d+ chars/.test(good.out), 'good.html: preheader-length check runs');
assert(/placeholder href/.test(good.out), 'good.html: placeholder-href check runs');

// --- bad fixture: must fail, and name each planted defect ---------------------
const bad = runLint(BAD);
assert(bad.code === 1, 'bad.html exits 1');
assert(/without an alt attribute/.test(bad.out), 'bad.html: missing-alt rule fires');
assert(/without a width attribute/.test(bad.out), 'bad.html: missing-width rule fires');
assert(/Unbalanced \{ \} in a <style> block/.test(bad.out), 'bad.html: unbalanced-brace rule fires');
assert(/MSO conditional mismatch/.test(bad.out), 'bad.html: MSO-conditional rule fires');
assert(/No unsubscribe link found/.test(bad.out), 'bad.html: missing-unsubscribe rule fires');
// house-conformance rules (bad.html declares none of them)
assert(/color-scheme.*meta/.test(bad.out), 'bad.html: dark-mode-declaration rule fires');
assert(/PixelsPerInch/.test(bad.out), 'bad.html: Outlook-DPI rule fires');
assert(/prefers-color-scheme: dark\) block/.test(bad.out), 'bad.html: dark-mode-CSS rule fires');

console.log(`\n${failures ? '\x1b[31m' : '\x1b[32m'}${failures} assertion${failures === 1 ? '' : 's'} failed\x1b[0m\n`);
process.exit(failures ? 1 : 0);
