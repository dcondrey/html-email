#!/usr/bin/env node
/**
 * smoke.mjs — render smoke-test for every built email.
 *
 * lint.mjs validates the HTML; this validates the RENDER. It loads each built
 * email in headless Chrome (light and dark) and fails on the class of bug lint
 * cannot see: a broken image (bad/missing src), horizontal overflow (an
 * oversized image or fixed width blowing past the 600px container — the exact
 * shape of the 2358px hero bug), or a console/page error. Deterministic: it
 * asserts structural facts, not pixels, so there is nothing flaky to diff.
 *
 * External (font) requests are aborted so the run is offline-safe and matches
 * the Arial-fallback render; images are loaded from file:// so broken refs surface.
 * The abort produces a net::ERR_FAILED console line per blocked font, which is
 * expected noise, not a defect — those resource-load messages are filtered out;
 * broken local images are caught structurally (naturalWidth) and via requestfailed.
 *
 * Usage:  node scripts/smoke.mjs           (exit 1 if any target fails)
 *         node scripts/smoke.mjs --quiet    (only print failures + summary)
 */
import puppeteer from 'puppeteer';
import { existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const QUIET = process.argv.includes('--quiet');

// Overflow is judged relative to the viewport: the email's full-bleed wrapper is
// width:100%, so it fills whatever width it is given. What must NOT happen is the
// content forcing a horizontal scrollbar (scrollWidth > clientWidth) — that is
// the fingerprint of an oversized image or fixed width escaping the container.
const OVERFLOW_TOLERANCE = 2; // px, for sub-pixel rounding
const VIEWPORT_WIDTH = 800;

// ---- collect targets: the framework build + every templates/<name>/dist ------
const targets = [];
const fw = resolve(ROOT, 'framework', 'dist', 'email.html');
if (existsSync(fw)) targets.push({ name: 'framework', file: fw });
const templatesDir = resolve(ROOT, 'templates');
for (const d of readdirSync(templatesDir, { withFileTypes: true })) {
  const f = resolve(templatesDir, d.name, 'dist', 'email.html');
  if (d.isDirectory() && existsSync(f)) targets.push({ name: d.name, file: f });
}

if (!targets.length) {
  console.error('smoke: no built emails found — run `npm run build` first.');
  process.exit(2);
}

const GREEN = '\x1b[32m', RED = '\x1b[31m', DIM = '\x1b[2m', RESET = '\x1b[0m';
let failed = 0;

const browser = await puppeteer.launch({
  channel: 'chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'],
});

try {
  for (const t of targets) {
    for (const scheme of ['light', 'dark']) {
      const page = await browser.newPage();
      const problems = [];

      page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
      page.on('console', (m) => {
        if (m.type() !== 'error') return;
        const txt = m.text();
        // Resource-load failures are the flip side of aborted external fonts and
        // are covered structurally elsewhere; ignore them, keep real JS errors.
        if (/Failed to load resource/i.test(txt)) return;
        problems.push(`console error: ${txt}`);
      });

      // file:// requests continue (so broken local images surface); external
      // (font) requests abort so the render is deterministic and offline-safe.
      await page.setRequestInterception(true);
      page.on('request', (r) => (r.url().startsWith('file:') ? r.continue() : r.abort()));
      page.on('requestfailed', (r) => {
        const url = r.url();
        if (url.startsWith('file:')) problems.push(`failed to load ${url.split('/').pop()}`);
      });

      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: scheme }]);
      await page.setViewport({ width: VIEWPORT_WIDTH, height: 1000, deviceScaleFactor: 1 });
      await page.goto(pathToFileURL(t.file).href, { waitUntil: 'load', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 350)); // let images decode + layout settle

      // broken images: loaded but zero intrinsic width
      const brokenImgs = await page.$$eval('img', (imgs) =>
        imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src') || '(no src)')
      );
      for (const src of brokenImgs) problems.push(`broken image: ${src}`);

      // horizontal overflow: content forces a scrollbar past the viewport
      const { scrollW, clientW } = await page.evaluate(() => ({
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
      }));
      if (scrollW > clientW + OVERFLOW_TOLERANCE) {
        problems.push(`horizontal overflow: content scrolls to ${scrollW}px in a ${clientW}px viewport`);
      }

      await page.close();

      const label = `${t.name} · ${scheme}`;
      if (problems.length) {
        failed++;
        console.log(`  ${RED}FAIL${RESET}  ${label}`);
        for (const p of problems) console.log(`        ${RED}- ${p}${RESET}`);
      } else if (!QUIET) {
        console.log(`  ${GREEN}ok${RESET}    ${label}  ${DIM}(no overflow, images ok, no errors)${RESET}`);
      }
    }
  }
} finally {
  await browser.close();
}

const total = targets.length * 2;
console.log(`\n${failed ? RED : GREEN}${failed} of ${total} render checks failed${RESET}\n`);
process.exit(failed ? 1 : 0);
