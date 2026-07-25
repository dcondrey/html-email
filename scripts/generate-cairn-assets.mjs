#!/usr/bin/env node
/**
 * generate-cairn-assets.mjs — self-contained illustrated imagery for the
 * Cairn Wellness template. No stock photos: each image is a layered SVG scene
 * (per-shape gradients, soft contact shadows, a faint grain overlay to kill
 * banding) rendered by headless Chrome. Article scenes share one 280x260 slot
 * so the layout never mismatches. Output at 2x for retina.
 *
 * Usage:  node scripts/generate-cairn-assets.mjs
 */
import puppeteer from 'puppeteer';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'templates', 'cairn-wellness', 'assets');

const DGREEN = '#445942';

// shared filters: soft blur for shadows, faint monochrome grain overlay
const FILTERS = `
  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"/></filter>`;

const scene = (w, h, defs, body) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0}</style></head><body>
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>${FILTERS}${defs}</defs>
    ${body}
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.05"/>
  </svg></body></html>`;

// a single smoothed stone: radial-shaded ellipse + soft contact shadow
const stone = (cx, cy, rx, ry, id) =>
  `<ellipse cx="${cx}" cy="${cy + ry * 0.72}" rx="${rx * 0.92}" ry="${ry * 0.34}" fill="#3d4a3a" opacity="0.16" filter="url(#soft)"/>
   <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${id})"/>`;

// ---- HERO 600x360: serene horizon + cairn -----------------------------------
const HERO = scene(600, 360, `
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f2e9"/><stop offset="1" stop-color="#dbe4cf"/></linearGradient>
  <radialGradient id="sun" cx="0.82" cy="0.2" r="0.5"><stop offset="0" stop-color="#fbf6ea" stop-opacity="0.9"/><stop offset="1" stop-color="#fbf6ea" stop-opacity="0"/></radialGradient>
  <radialGradient id="s1" cx="0.38" cy="0.32" r="0.9"><stop offset="0" stop-color="#9aa892"/><stop offset="1" stop-color="#6f7d69"/></radialGradient>
  <radialGradient id="s2" cx="0.38" cy="0.32" r="0.9"><stop offset="0" stop-color="#b8b3a3"/><stop offset="1" stop-color="#928c7b"/></radialGradient>
  <radialGradient id="s3" cx="0.38" cy="0.32" r="0.9"><stop offset="0" stop-color="#8a9a83"/><stop offset="1" stop-color="#61705a"/></radialGradient>
  <radialGradient id="s4" cx="0.38" cy="0.32" r="0.9"><stop offset="0" stop-color="#c8c1b0"/><stop offset="1" stop-color="#a49d8b"/></radialGradient>
  <radialGradient id="s5" cx="0.38" cy="0.32" r="0.9"><stop offset="0" stop-color="#7c8b75"/><stop offset="1" stop-color="#586852"/></radialGradient>`, `
  <rect width="600" height="360" fill="url(#sky)"/>
  <circle cx="492" cy="72" r="120" fill="url(#sun)"/>
  <path d="M0 250 Q160 196 330 240 T600 232 V360 H0 Z" fill="#cdd8c0" opacity="0.7"/>
  <path d="M0 292 Q200 250 380 288 T600 286 V360 H0 Z" fill="#b6c6a8" opacity="0.8"/>
  ${stone(300, 296, 96, 26, 's1')}
  ${stone(300, 258, 80, 23, 's2')}
  ${stone(300, 224, 64, 20, 's3')}
  ${stone(300, 194, 48, 17, 's4')}
  ${stone(300, 168, 33, 14, 's5')}`);

// ---- ARTICLE scenes, all 280x260 -------------------------------------------
const CANDLES = scene(280, 260, `
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7efe1"/><stop offset="1" stop-color="#ecdcc4"/></linearGradient>
  <linearGradient id="wax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3ead6"/><stop offset="1" stop-color="#e2d3b8"/></linearGradient>
  <radialGradient id="flame" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffe6b0"/><stop offset="0.5" stop-color="#eeb867"/><stop offset="1" stop-color="#eeb867" stop-opacity="0"/></radialGradient>`, `
  <rect width="280" height="260" fill="url(#bg)"/>
  <ellipse cx="140" cy="214" rx="96" ry="14" fill="#8a765a" opacity="0.14" filter="url(#soft)"/>
  <circle cx="118" cy="120" r="40" fill="url(#flame)" opacity="0.7"/>
  <circle cx="170" cy="150" r="30" fill="url(#flame)" opacity="0.6"/>
  <rect x="102" y="132" width="34" height="76" rx="7" fill="url(#wax)"/>
  <rect x="156" y="158" width="30" height="50" rx="7" fill="url(#wax)"/>
  <path d="M119 132 q6 -14 0 -24 q-6 10 0 24 Z" fill="#eaa94e"/>
  <path d="M171 158 q5 -12 0 -20 q-5 8 0 20 Z" fill="#eaa94e"/>`);

const STATUE = scene(280, 260, `
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfdcc2"/><stop offset="1" stop-color="#eef1e7"/></linearGradient>
  <linearGradient id="fig" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa891"/><stop offset="0.5" stop-color="#7e8d76"/><stop offset="1" stop-color="#63715c"/></linearGradient>
  <linearGradient id="plinth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7e2d4"/><stop offset="1" stop-color="#d3ccb9"/></linearGradient>`, `
  <rect width="280" height="260" fill="url(#bg)"/>
  <ellipse cx="140" cy="212" rx="70" ry="12" fill="#4a5545" opacity="0.16" filter="url(#soft)"/>
  <rect x="96" y="196" width="88" height="18" rx="4" fill="url(#plinth)"/>
  <path d="M140 66 C 108 66 112 132 120 168 C 124 188 156 188 160 168 C 168 132 172 66 140 66 Z" fill="url(#fig)"/>
  <circle cx="140" cy="74" r="21" fill="url(#fig)"/>
  <path d="M132 70 a8 12 0 0 1 16 0 z" fill="#ffffff" opacity="0.12"/>`);

const CUP = scene(280, 260, `
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef0e6"/><stop offset="1" stop-color="#dde5d3"/></linearGradient>
  <linearGradient id="cup" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3ead6"/><stop offset="1" stop-color="#e4d6bd"/></linearGradient>`, `
  <rect width="280" height="260" fill="url(#bg)"/>
  <ellipse cx="140" cy="196" rx="80" ry="12" fill="#5a6a4f" opacity="0.14" filter="url(#soft)"/>
  <path d="M96 118 q6 -20 0 -34 M120 110 q7 -22 0 -38 M144 118 q6 -20 0 -34" fill="none" stroke="#b8c3ad" stroke-width="5" stroke-linecap="round" opacity="0.85"/>
  <path d="M92 132 h80 v26 a40 40 0 0 1 -80 0 Z" fill="url(#cup)"/>
  <path d="M172 138 q30 6 0 34" fill="none" stroke="#e4d6bd" stroke-width="9"/>
  <ellipse cx="132" cy="190" rx="52" ry="8" fill="#efe7d6"/>`);

const GIFT = scene(280, 260, `
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e0cfb0"/><stop offset="1" stop-color="#efe3d0"/></linearGradient>
  <linearGradient id="box" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe6d5"/><stop offset="1" stop-color="#ddd0b7"/></linearGradient>`, `
  <rect width="280" height="260" fill="url(#bg)"/>
  <ellipse cx="140" cy="196" rx="78" ry="12" fill="#7c6a4c" opacity="0.16" filter="url(#soft)"/>
  <rect x="86" y="112" width="108" height="78" rx="7" fill="url(#box)"/>
  <rect x="86" y="112" width="108" height="22" rx="7" fill="#e3d6bd"/>
  <rect x="131" y="112" width="18" height="78" fill="#e0a95e"/>
  <rect x="86" y="140" width="108" height="16" fill="#e0a95e"/>
  <path d="M140 112 q-22 -20 -30 -6 q-6 12 30 6 q36 6 30 -6 q-8 -14 -30 6 Z" fill="#e6b06a"/>
  <circle cx="140" cy="112" r="6" fill="#d79f52"/>`);

// ---- logo + social ----------------------------------------------------------
const LOGO = `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Poppins:700&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .row{display:flex;align-items:center;height:30px}svg{margin-right:8px}
  .wm{font-family:'Poppins',Arial,sans-serif;font-weight:700;font-size:20px;color:${DGREEN};letter-spacing:.5px}</style></head>
  <body><div class="row"><svg width="26" height="30" viewBox="0 0 26 30"><g fill="${DGREEN}">
  <ellipse cx="13" cy="26" rx="12" ry="4"/><ellipse cx="13" cy="18.5" rx="9" ry="3.4"/><ellipse cx="13" cy="11.5" rx="6.5" ry="3"/><ellipse cx="13" cy="5.5" rx="4" ry="2.4"/></g></svg>
  <span class="wm">cairn</span></div></body></html>`;

const social = (letter) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Poppins:700&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .b{width:28px;height:28px;border-radius:7px;background:${DGREEN};display:flex;align-items:center;justify-content:center}
  span{font-family:'Poppins',Arial,sans-serif;font-weight:700;font-size:13px;color:#fff}</style></head>
  <body><div class="b"><span>${letter}</span></div></body></html>`;

const JOBS = [
  { file: 'cw-hero.jpg', w: 600, h: 360, jpeg: true, html: HERO },
  { file: 'cw-candles.jpg', w: 280, h: 260, jpeg: true, html: CANDLES },
  { file: 'cw-statues.jpg', w: 280, h: 260, jpeg: true, html: STATUE },
  { file: 'cw-corner.jpg', w: 280, h: 260, jpeg: true, html: CUP },
  { file: 'cw-gifts.jpg', w: 280, h: 260, jpeg: true, html: GIFT },
  { file: 'cw-logo.png', w: 150, h: 30, html: LOGO },
  { file: 'cw-social-facebook.png', w: 28, h: 28, html: social('f') },
  { file: 'cw-social-twitter.png', w: 28, h: 28, html: social('t') },
  { file: 'cw-social-instagram.png', w: 28, h: 28, html: social('i') },
  { file: 'cw-social-pinterest.png', w: 28, h: 28, html: social('p') },
];

const browser = await puppeteer.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'] });
try {
  for (const j of JOBS) {
    const page = await browser.newPage();
    await page.setViewport({ width: j.w, height: j.h, deviceScaleFactor: 2 });
    await page.setContent(j.html, { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch { /* fonts optional */ }
    await new Promise((r) => setTimeout(r, 250));
    const opts = { path: resolve(OUT, j.file), clip: { x: 0, y: 0, width: j.w, height: j.h } };
    if (j.jpeg) { opts.type = 'jpeg'; opts.quality = 92; } else { opts.omitBackground = true; }
    await page.screenshot(opts);
    console.log(`wrote ${j.file} (${j.w}x${j.h})`);
    await page.close();
  }
} finally { await browser.close(); }
