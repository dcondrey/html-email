#!/usr/bin/env node
/**
 * generate-brand-assets.mjs — render the five not-yet-generated Northwind
 * brand assets referenced by examples/northwind-botanicals/campaign.html.
 *
 * These are rendered to EXACT 1x pixel dimensions (email images display at
 * natural size — the campaign markup sets no width attribute), using headless
 * Chrome so real fonts (Cormorant Garamond display, Inter) rasterize crisply.
 *
 *   nb-flank-left.jpg   160x315  botanical side panel (cream, forest sprig)
 *   nb-flank-right.jpg  160x315  mirror of the left flank
 *   nb-hero-tagline.png    320x11   "From farms working through the wet season"
 *   nb-hero-headline-bg.png 320x33  "Winter, if you look"  (display serif)
 *   nb-hero-button-bg.png   320x30  "at it right"          (display serif)
 *
 * Usage:  node scripts/generate-brand-assets.mjs
 */
import puppeteer from 'puppeteer';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'examples', 'northwind-botanicals', 'assets');

const CREAM = '#F5F1E8', FOREST = '#1F4E3D', TERRA = '#C46B4A', CHARCOAL = '#2A2A28', WARM = '#5F5E5A';

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Inter:wght@500;600&display=swap" rel="stylesheet">`;

// A delicate fern sprig: central stalk + tapering leaflet pairs.
function sprig() {
  let leaves = '';
  const n = 11;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const y = 285 - t * 245;
    const size = 15 * (1 - 0.55 * t);
    const off = size * 0.35;
    leaves += `<ellipse cx="${(80 - off).toFixed(1)}" cy="${y.toFixed(1)}" rx="${size.toFixed(1)}" ry="${(size * 0.3).toFixed(1)}" transform="rotate(-32 ${(80 - off).toFixed(1)} ${y.toFixed(1)})"/>`;
    leaves += `<ellipse cx="${(80 + off).toFixed(1)}" cy="${y.toFixed(1)}" rx="${size.toFixed(1)}" ry="${(size * 0.3).toFixed(1)}" transform="rotate(32 ${(80 + off).toFixed(1)} ${y.toFixed(1)})"/>`;
  }
  return `<path d="M80 292 C 78 220, 82 120, 80 34" stroke="${FOREST}" stroke-width="1.6" fill="none"/>
    <g fill="${FOREST}">${leaves}</g>`;
}

function flankHtml(side) {
  const rule = side === 'left'
    ? `<rect x="157" y="0" width="3" height="315" fill="${TERRA}"/>`     // inner edge = right
    : `<rect x="0" y="0" width="3" height="315" fill="${TERRA}"/>`;      // inner edge = left (mirrored)
  const mirror = side === 'right' ? `transform="translate(160,0) scale(-1,1)"` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0}
  </style></head><body>
    <svg width="160" height="315" viewBox="0 0 160 315" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#FBF8F2"/><stop offset="1" stop-color="${CREAM}"/>
      </linearGradient></defs>
      <rect width="160" height="315" fill="url(#g)"/>
      <g opacity="0.20" ${mirror}>${sprig()}</g>
      ${rule}
    </svg>
  </body></html>`;
}

function textHtml({ w, h, text, family, size, color, italic, upper, tracking }) {
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
    html,body{margin:0;padding:0;background:transparent}
    .box{width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;overflow:hidden}
    .t{font-family:${family};font-size:${size}px;line-height:${h}px;color:${color};
       font-style:${italic ? 'italic' : 'normal'};font-weight:${italic ? 500 : 600};
       ${upper ? 'text-transform:uppercase;' : ''}letter-spacing:${tracking}px;white-space:nowrap}
  </style></head><body><div class="box"><span class="t">${text}</span></div></body></html>`;
}

const ASSETS = [
  { file: 'nb-flank-left.jpg',  w: 160, h: 315, jpeg: true, html: flankHtml('left') },
  { file: 'nb-flank-right.jpg', w: 160, h: 315, jpeg: true, html: flankHtml('right') },
  { file: 'nb-hero-tagline.png', w: 320, h: 11, html: textHtml({ w: 320, h: 11, text: 'From farms working through the wet season', family: "'Inter',Arial,sans-serif", size: 7, color: WARM, upper: true, tracking: 0.6 }) },
  { file: 'nb-hero-headline-bg.png', w: 320, h: 33, html: textHtml({ w: 320, h: 33, text: 'Winter, if you look', family: "'Cormorant Garamond',Georgia,serif", size: 27, color: CHARCOAL, italic: true, tracking: 0.3 }) },
  { file: 'nb-hero-button-bg.png', w: 320, h: 30, html: textHtml({ w: 320, h: 30, text: 'at it right', family: "'Cormorant Garamond',Georgia,serif", size: 25, color: CHARCOAL, italic: true, tracking: 0.3 }) },
];

const browser = await puppeteer.launch({
  channel: 'chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'],
});

try {
  for (const a of ASSETS) {
    const page = await browser.newPage();
    await page.setViewport({ width: a.w, height: a.h, deviceScaleFactor: 1 });
    await page.setContent(a.html, { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch { /* fonts optional */ }
    await new Promise((r) => setTimeout(r, 250));
    const outPath = resolve(OUT, a.file);
    const opts = { path: outPath, clip: { x: 0, y: 0, width: a.w, height: a.h } };
    if (a.jpeg) { opts.type = 'jpeg'; opts.quality = 92; }
    else { opts.omitBackground = true; }
    await page.screenshot(opts);
    console.log(`wrote ${a.file}  (${a.w}x${a.h}${a.jpeg ? ' jpeg' : ' png, transparent'})`);
    await page.close();
  }
} finally {
  await browser.close();
}
