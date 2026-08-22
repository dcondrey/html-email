#!/usr/bin/env node
/**
 * fuzz.test.js — property-based fuzzing of the rule set (fast-check).
 *
 * lint.test.mjs proves the rules fire on two hand-written fixtures. This proves
 * the analyzer holds up on input nobody wrote: the linter is regex-based and
 * runs as a build gate, so a crash or a pathological backtrack is a real defect.
 * Named .js, not .mjs, because that is what Scorecard's fuzzing detector globs.
 */
import fc from 'fast-check';
import { analyze, RULES, SEVERITY, stripDocComments, stripTags } from './rules.mjs';

const PROFILES = ['universal', 'house'];
const RULE_IDS = new Set(RULES.map((r) => r.id));
const SEVERITIES = new Set(Object.values(SEVERITY));

let failures = 0;
const check = (name, property, params = {}) => {
  const result = fc.check(property, { numRuns: 300, ...params });
  if (result.failed) {
    failures++;
    console.log(`  \x1b[31mNOT OK\x1b[0m ${name}`);
    console.log(`         counterexample: ${JSON.stringify(result.counterexample?.[0]).slice(0, 300)}`);
    if (result.errorInstance) console.log(`         ${result.errorInstance}`);
  } else {
    console.log(`  \x1b[32mok\x1b[0m    ${name} (${result.numRuns} runs)`);
  }
};

/** Arbitrary strings biased toward the syntax the rules actually key on. */
const emailish = fc.stringMatching(
  /^(<div style="display:none;max-height:0">|<img [a-z]*>|<!--\[if mso\]>|<!\[endif\]-->|<style>[{} ]*<\/style>|<table role="presentation">|<!--|-->|<\/div>|#fff|unsubscribe|[a-z <>"'=/#{}:;-]){0,60}$/
);
const html = fc.oneof(
  { arbitrary: emailish, weight: 3 },
  { arbitrary: fc.string(), weight: 1 },
  { arbitrary: fc.string({ unit: 'binary' }), weight: 1 }
);

console.log('\nrules.mjs fuzz (fast-check)\n');

for (const profile of PROFILES) {
  check(`${profile}: never throws on arbitrary input`, fc.property(html, (s) => {
    analyze(s, { profile });
    return true;
  }));

  check(`${profile}: every finding is a known rule with a valid severity`, fc.property(html, (s) => {
    for (const f of analyze(s, { profile }).findings) {
      if (!RULE_IDS.has(f.id) || !SEVERITIES.has(f.severity) || typeof f.message !== 'string') return false;
    }
    return true;
  }));

  check(`${profile}: deterministic`, fc.property(html, (s) =>
    JSON.stringify(analyze(s, { profile })) === JSON.stringify(analyze(s, { profile }))
  ));
}

check('universal profile never emits a house-scope finding', fc.property(html, (s) =>
  analyze(s, { profile: 'universal' }).findings.every((f) => f.scope === 'universal')
));

check('house is a superset of universal', fc.property(html, (s) => {
  const ids = new Set(analyze(s, { profile: 'house' }).findings.map((f) => f.id));
  return analyze(s, { profile: 'universal' }).findings.every((f) => ids.has(f.id));
}));

// Oversize input must always trip the Gmail clip rule — the one finding whose
// absence silently ships a truncated footer and a missing unsubscribe link.
check('input over the clip threshold always FAILs gmail-clip', fc.property(
  fc.string({ minLength: 1, maxLength: 40 }).filter((s) => Buffer.byteLength(s, 'utf8') > 0),
  (chunk) => {
    const big = chunk.repeat(Math.ceil(102001 / Buffer.byteLength(chunk, 'utf8')));
    const f = analyze(big, { profile: 'universal' }).findings.find((x) => x.id === 'gmail-clip');
    return f.severity === SEVERITY.FAIL;
  }
), { numRuns: 40 });

// An <img> written inside a documentation comment is prose, not markup.
check('an <img> inside a doc comment never trips alt/width', fc.property(
  fc.stringMatching(/^[a-z ]{0,40}$/),
  (text) => {
    const findings = analyze(`<!-- ${text} <img> -->`, { profile: 'universal' }).findings;
    return findings
      .filter((f) => f.id === 'img-alt' || f.id === 'img-width')
      .every((f) => f.severity === SEVERITY.PASS);
  }
));

// Balanced conditionals must never be reported as mismatched.
check('balanced MSO conditionals always pass', fc.property(fc.nat({ max: 30 }), (n) => {
  const s = '<!--[if mso]><![endif]-->'.repeat(n);
  return analyze(s, { profile: 'universal' }).findings.find((f) => f.id === 'mso-conditionals').severity === SEVERITY.PASS;
}));

// The comment and tag strips feed the structural rules, so a delimiter left
// behind would let markup inside a comment be counted as real markup.
// Idempotence is the real invariant: a second pass finding more to remove is
// exactly the incomplete-sanitization failure. A nested `<!--` is NOT evidence
// of one — `<!--[if !mso]><!-->` is the downlevel-revealed form, kept on purpose.
check('stripDocComments reaches a fixed point in one pass', fc.property(html, (s) => {
  const once = stripDocComments(s);
  return stripDocComments(once) === once;
}));

check('stripTags leaves no complete tag behind', fc.property(html, (s) => {
  const out = stripTags(s);
  const lt = out.indexOf('<');
  return lt === -1 || out.indexOf('>', lt + 1) === -1;
}));

check('stripTags reaches a fixed point in one pass', fc.property(html, (s) => {
  const once = stripTags(s);
  return stripTags(once) === once;
}));

// ReDoS regression guard. The single-regex preheader match and the `<tag[^>]*>`
// scan were both quadratic; 2.4MB of unterminated tags took 58s before the fix.
check('stays linear on adversarial unterminated markup', fc.property(
  fc.constantFrom('<div style="display:none;max-height:0', '<div style="', '<img ', '<style>', '<!--', '<table '),
  fc.integer({ min: 20000, max: 60000 }),
  (fragment, n) => {
    const s = fragment.repeat(n);
    // Linear takes ~20ms for the largest of these locally. The budget is loose
    // enough for a slow CI runner and still an order of magnitude under the
    // quadratic forms this pins (1.1s+ locally, worse on CI).
    const started = process.hrtime.bigint();
    analyze(s, { profile: 'house' });
    return Number(process.hrtime.bigint() - started) / 1e6 < 1000;
  }
), { numRuns: 12 });

console.log(`\n${failures ? '\x1b[31m' : '\x1b[32m'}${failures} propert${failures === 1 ? 'y' : 'ies'} failed\x1b[0m\n`);
process.exit(failures ? 1 : 0);
