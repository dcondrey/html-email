#!/usr/bin/env node
/**
 * generate-previews.mjs — render the built email to preview screenshots.
 *
 * Loads framework/dist/email.html in headless Chrome and captures three
 * previews used in the docs/README:
 *   docs/preview/desktop-light.png  800x1200 viewport, prefers-color-scheme: light
 *   docs/preview/desktop-dark.png   800x1200 viewport, prefers-color-scheme: dark
 *   docs/preview/mobile.png         375x812  viewport, prefers-color-scheme: light
 *
 * All captures are fullPage (the email is taller than the viewport). External
 * requests are aborted so rendering is deterministic and works offline — the
 * template's fonts are system Georgia/Arial, so nothing external is needed.
 *
 * Uses the system Google Chrome (channel: 'chrome'); Puppeteer's own Chromium
 * download is skipped at install time.
 *
 * Usage:  node scripts/generate-previews.mjs
 */
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const EMAIL = resolve(ROOT, 'framework', 'dist', 'email.html');
const OUT_DIR = resolve(ROOT, 'docs', 'preview');

const SHOTS = [
  { file: 'desktop-light.png', width: 800, height: 1200, scheme: 'light', mobile: false },
  { file: 'desktop-dark.png',  width: 800, height: 1200, scheme: 'dark',  mobile: false },
  { file: 'mobile.png',        width: 375, height: 812,  scheme: 'light', mobile: true  },
];

mkdirSync(OUT_DIR, { recursive: true });
const emailUrl = pathToFileURL(EMAIL).href;

const browser = await puppeteer.launch({
  channel: 'chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'],
});

try {
  for (const shot of SHOTS) {
    const page = await browser.newPage();

    // Abort external (non-file) requests: deterministic, offline-safe render.
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      req.url().startsWith('file:') ? req.continue() : req.abort();
    });

    await page.emulateMediaFeatures([
      { name: 'prefers-color-scheme', value: shot.scheme },
    ]);
    await page.setViewport({
      width: shot.width,
      height: shot.height,
      deviceScaleFactor: 1,
      isMobile: shot.mobile,
      hasTouch: shot.mobile,
    });

    await page.goto(emailUrl, { waitUntil: 'load', timeout: 30000 });
    // Settle: let inline-image decode and any layout finish.
    await new Promise((r) => setTimeout(r, 400));

    const outPath = resolve(OUT_DIR, shot.file);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(`wrote ${outPath}  (${shot.width}x${shot.height} viewport, ${shot.scheme})`);
    await page.close();
  }
} finally {
  await browser.close();
}
