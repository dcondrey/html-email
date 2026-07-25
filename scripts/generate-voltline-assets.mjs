#!/usr/bin/env node
/**
 * generate-voltline-assets.mjs — self-contained illustrated imagery for the
 * Voltline template. No stock photos: each image is a layered SVG scene
 * (per-shape gradients, glows, a faint grain overlay to kill banding) rendered
 * by headless Chrome. This brand is dark-first, so the scenes are lit devices
 * on near-black with pink + cyan light. Output at 2x for retina.
 *
 * Usage:  node scripts/generate-voltline-assets.mjs
 */
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'templates', 'voltline', 'assets');
mkdirSync(OUT, { recursive: true });

const PINK = '#ff3d7f';
const CYAN = '#35e0c8';

const FILTERS = `
  <filter id="soft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0"/></filter>`;

const scene = (w, h, defs, body) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0}</style></head><body>
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>${FILTERS}${defs}</defs>
    ${body}
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.06"/>
  </svg></body></html>`;

// ---- HERO 600x360: a phone lit on a dark stage, pink + cyan glow ------------
const HERO = scene(600, 360, `
  <radialGradient id="bg" cx="0.5" cy="0.42" r="0.75"><stop offset="0" stop-color="#1b1b26"/><stop offset="1" stop-color="#0b0b10"/></radialGradient>
  <radialGradient id="pinkglow" cx="0.5" cy="0.9" r="0.6"><stop offset="0" stop-color="#ff3d7f" stop-opacity="0.7"/><stop offset="1" stop-color="#ff3d7f" stop-opacity="0"/></radialGradient>
  <radialGradient id="cyanglow" cx="0.12" cy="0.12" r="0.5"><stop offset="0" stop-color="#35e0c8" stop-opacity="0.45"/><stop offset="1" stop-color="#35e0c8" stop-opacity="0"/></radialGradient>
  <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5c93"/><stop offset="0.55" stop-color="#a03bd0"/><stop offset="1" stop-color="#2b7be0"/></linearGradient>
  <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b2b38"/><stop offset="0.5" stop-color="#3c3c4c"/><stop offset="1" stop-color="#1c1c26"/></linearGradient>`, `
  <rect width="600" height="360" fill="url(#bg)"/>
  <rect width="600" height="360" fill="url(#pinkglow)"/>
  <rect width="600" height="360" fill="url(#cyanglow)"/>
  <ellipse cx="300" cy="326" rx="150" ry="24" fill="#ff3d7f" opacity="0.28" filter="url(#soft)"/>
  <g transform="rotate(-9 300 180)">
    <rect x="228" y="52" width="144" height="256" rx="26" fill="url(#bezel)"/>
    <rect x="238" y="62" width="124" height="236" rx="18" fill="#0d0d12"/>
    <rect x="244" y="68" width="112" height="224" rx="14" fill="url(#screen)"/>
    <rect x="256" y="86" width="88" height="12" rx="6" fill="#ffffff" opacity="0.85"/>
    <rect x="256" y="108" width="60" height="8" rx="4" fill="#ffffff" opacity="0.5"/>
    <rect x="256" y="150" width="88" height="54" rx="10" fill="#ffffff" opacity="0.16"/>
    <rect x="256" y="216" width="88" height="10" rx="5" fill="#ffffff" opacity="0.5"/>
    <rect x="256" y="234" width="66" height="10" rx="5" fill="#ffffff" opacity="0.35"/>
    <circle cx="300" cy="70" r="2.4" fill="#0d0d12"/>
    <rect x="228" y="52" width="20" height="256" rx="26" fill="#ffffff" opacity="0.06"/>
  </g>
  <circle cx="470" cy="96" r="4" fill="#35e0c8" opacity="0.9"/>
  <circle cx="140" cy="250" r="3.5" fill="#ff3d7f" opacity="0.9"/>
  <circle cx="500" cy="250" r="3" fill="#ff3d7f" opacity="0.7"/>
  <circle cx="120" cy="120" r="3" fill="#35e0c8" opacity="0.7"/>`);

// ---- PRODUCT 260x280: the Pulse player, screen + click wheel ----------------
const PRODUCT = scene(260, 280, `
  <radialGradient id="pbg" cx="0.5" cy="0.4" r="0.8"><stop offset="0" stop-color="#1b1b26"/><stop offset="1" stop-color="#0c0c11"/></radialGradient>
  <radialGradient id="pglow" cx="0.5" cy="0.5" r="0.55"><stop offset="0" stop-color="#ff3d7f" stop-opacity="0.4"/><stop offset="1" stop-color="#ff3d7f" stop-opacity="0"/></radialGradient>
  <linearGradient id="body" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3a48"/><stop offset="1" stop-color="#1e1e28"/></linearGradient>
  <linearGradient id="pscreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5c93"/><stop offset="1" stop-color="#7b3bd0"/></linearGradient>`, `
  <rect width="260" height="280" fill="url(#pbg)"/>
  <rect width="260" height="280" fill="url(#pglow)"/>
  <ellipse cx="130" cy="250" rx="80" ry="16" fill="#ff3d7f" opacity="0.2" filter="url(#soft)"/>
  <rect x="74" y="36" width="112" height="208" rx="20" fill="url(#body)"/>
  <rect x="74" y="36" width="14" height="208" rx="18" fill="#ffffff" opacity="0.06"/>
  <rect x="86" y="50" width="88" height="96" rx="8" fill="url(#pscreen)"/>
  <rect x="96" y="62" width="52" height="9" rx="4" fill="#ffffff" opacity="0.85"/>
  <rect x="96" y="78" width="36" height="7" rx="3" fill="#ffffff" opacity="0.5"/>
  <rect x="96" y="118" width="68" height="8" rx="4" fill="#ffffff" opacity="0.55"/>
  <circle cx="130" cy="196" r="34" fill="#15151d"/>
  <circle cx="130" cy="196" r="34" fill="none" stroke="#3c3c4c" stroke-width="2"/>
  <circle cx="130" cy="196" r="12" fill="#ff3d7f"/>
  <path d="M130 172 l4 6 h-8 Z" fill="#7c7c92"/>
  <path d="M130 220 l4 -6 h-8 Z" fill="#7c7c92"/>`);

// ---- logo + social ----------------------------------------------------------
const LOGO = `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Space+Grotesk:700&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .row{display:flex;align-items:center;height:30px}svg{margin-right:8px}
  .wm{font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;font-size:20px;letter-spacing:2px;color:#ffffff;text-transform:uppercase}</style></head>
  <body><div class="row"><svg width="20" height="30" viewBox="0 0 20 30"><polygon points="12,1 2,17 9,17 7,29 18,11 11,11" fill="${PINK}"/></svg>
  <span class="wm">Voltline</span></div></body></html>`;

const social = (letter) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Space+Grotesk:700&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .b{width:28px;height:28px;border-radius:7px;background:${PINK};display:flex;align-items:center;justify-content:center}
  span{font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;font-size:14px;color:#fff}</style></head>
  <body><div class="b"><span>${letter}</span></div></body></html>`;

const JOBS = [
  { file: 'vl-hero.jpg', w: 600, h: 360, jpeg: true, html: HERO },
  { file: 'vl-product.jpg', w: 260, h: 280, jpeg: true, html: PRODUCT },
  { file: 'vl-logo.png', w: 150, h: 30, html: LOGO },
  { file: 'vl-social-facebook.png', w: 28, h: 28, html: social('f') },
  { file: 'vl-social-twitter.png', w: 28, h: 28, html: social('t') },
  { file: 'vl-social-instagram.png', w: 28, h: 28, html: social('i') },
  { file: 'vl-social-youtube.png', w: 28, h: 28, html: social('Y') },
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
