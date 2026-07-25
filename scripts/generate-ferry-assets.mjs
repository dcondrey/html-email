#!/usr/bin/env node
/**
 * generate-ferry-assets.mjs — self-contained illustrated imagery for the
 * Ferry Street Brewing template. No stock photos: each image is a layered SVG
 * scene (per-shape gradients, soft contact shadows, a faint grain overlay to
 * kill banding) rendered by headless Chrome. A shared beer-glass helper keeps
 * the tasting row and the gallery visually consistent. Output at 2x for retina.
 *
 * Usage:  node scripts/generate-ferry-assets.mjs
 */
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'templates', 'ferry-street-brewing', 'assets');
mkdirSync(OUT, { recursive: true });

const BROWN = '#3a2417';
const AMBER = '#c8811f';

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

// ---- shared beer-glass helper ----------------------------------------------
// A slightly tapered tumbler: beer gradient body, foam cap, rim + shine
// highlights, a few bubbles, and a soft contact shadow. `id` namespaces the
// gradients so several glasses can share one <defs>.
const glassDefs = (id, beerTop, beerBot, foamTop, foamBot) => `
  <linearGradient id="beer-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${beerTop}"/><stop offset="1" stop-color="${beerBot}"/></linearGradient>
  <linearGradient id="foam-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${foamTop}"/><stop offset="1" stop-color="${foamBot}"/></linearGradient>`;

const glass = (id, cx, baseY, gw, gh) => {
  const halfTop = gw / 2, halfBot = gw * 0.41;
  const topY = baseY - gh, foamY = topY + gh * 0.02;
  const body = `M ${cx - halfTop} ${topY} L ${cx + halfTop} ${topY} L ${cx + halfBot} ${baseY} L ${cx - halfBot} ${baseY} Z`;
  return `
    <ellipse cx="${cx}" cy="${baseY + 4}" rx="${halfBot + 6}" ry="${gh * 0.06}" fill="#1c1109" opacity="0.22" filter="url(#soft)"/>
    <path d="${body}" fill="url(#beer-${id})"/>
    <ellipse cx="${cx}" cy="${foamY}" rx="${halfTop}" ry="${gh * 0.09}" fill="url(#foam-${id})"/>
    <ellipse cx="${cx}" cy="${foamY - gh * 0.02}" rx="${halfTop * 0.9}" ry="${gh * 0.06}" fill="#fbf4e4" opacity="0.85"/>
    <path d="M ${cx - halfTop + 3} ${topY + 4} L ${cx - halfBot + 3} ${baseY - 4}" stroke="#ffffff" stroke-width="2.5" opacity="0.22" stroke-linecap="round"/>
    <path d="M ${cx + halfTop * 0.34} ${topY + gh * 0.28} q ${gw * 0.06} ${gh * 0.2} 0 ${gh * 0.42}" stroke="#ffffff" stroke-width="4" opacity="0.10" fill="none" stroke-linecap="round"/>
    <circle cx="${cx - gw * 0.1}" cy="${baseY - gh * 0.3}" r="2.4" fill="#fff" opacity="0.35"/>
    <circle cx="${cx + gw * 0.06}" cy="${baseY - gh * 0.5}" r="1.8" fill="#fff" opacity="0.3"/>
    <circle cx="${cx - gw * 0.02}" cy="${baseY - gh * 0.18}" r="1.6" fill="#fff" opacity="0.28"/>`;
};

// beer palettes keyed by style
const PALE = ['#f7d977', '#e6ab2e'];
const AMBERALE = ['#d98a2e', '#a4501a'];
const DARK = ['#5a3316', '#26150a'];
const FOAM_LIGHT = ['#fbf3e0', '#eadfc4'];
const FOAM_TAN = ['#e7d3a6', '#cdb488'];

// ---- HERO 600x360: warm taproom, brass taps, a big amber pour ---------------
const HERO = scene(600, 360, `
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1608"/><stop offset="1" stop-color="#43291a"/></linearGradient>
  <radialGradient id="glow" cx="0.62" cy="0.42" r="0.55"><stop offset="0" stop-color="#c8811f" stop-opacity="0.55"/><stop offset="1" stop-color="#c8811f" stop-opacity="0"/></radialGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c1a0d"/><stop offset="1" stop-color="#1a0f07"/></linearGradient>
  <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d8ab5a"/><stop offset="0.5" stop-color="#a9772f"/><stop offset="1" stop-color="#7c5320"/></linearGradient>
  ${glassDefs('hero', AMBERALE[0], AMBERALE[1], FOAM_LIGHT[0], FOAM_LIGHT[1])}`, `
  <rect width="600" height="360" fill="url(#wall)"/>
  <circle cx="370" cy="150" r="200" fill="url(#glow)"/>
  <circle cx="120" cy="70" r="26" fill="#c8811f" opacity="0.16" filter="url(#soft)"/>
  <circle cx="180" cy="52" r="16" fill="#e0a044" opacity="0.14" filter="url(#soft)"/>
  <circle cx="500" cy="60" r="30" fill="#c8811f" opacity="0.13" filter="url(#soft)"/>
  <circle cx="548" cy="120" r="14" fill="#e0a044" opacity="0.12" filter="url(#soft)"/>
  <rect x="0" y="276" width="600" height="84" fill="url(#bar)"/>
  <rect x="0" y="276" width="600" height="3" fill="#c8811f" opacity="0.22"/>
  <!-- brass tap handles along the back bar, left of the pour -->
  <g>
    <rect x="120" y="150" width="15" height="86" rx="7" fill="url(#brass)"/><circle cx="127.5" cy="146" r="12" fill="url(#brass)"/><rect x="112" y="236" width="31" height="10" rx="4" fill="#6e4a1e"/>
    <rect x="164" y="140" width="15" height="96" rx="7" fill="url(#brass)"/><circle cx="171.5" cy="136" r="12" fill="url(#brass)"/><rect x="156" y="236" width="31" height="10" rx="4" fill="#6e4a1e"/>
    <rect x="208" y="150" width="15" height="86" rx="7" fill="url(#brass)"/><circle cx="215.5" cy="146" r="12" fill="url(#brass)"/><rect x="200" y="236" width="31" height="10" rx="4" fill="#6e4a1e"/>
  </g>
  ${glass('hero', 400, 288, 150, 190)}`);

// ---- TASTING tiles 120x120: one glass on a warm cream coaster ---------------
const tastingTile = (id, beer, foam) => scene(120, 120, `
  <radialGradient id="tbg-${id}" cx="0.5" cy="0.42" r="0.72"><stop offset="0" stop-color="#f6efe1"/><stop offset="1" stop-color="#e4d3b6"/></radialGradient>
  ${glassDefs(id, beer[0], beer[1], foam[0], foam[1])}`, `
  <rect width="120" height="120" rx="16" fill="url(#tbg-${id})"/>
  ${glass(id, 60, 96, 52, 74)}`);

// ---- GALLERY tiles 170x136: one glass on a warm brown ground ----------------
const galleryTile = (id, beer, foam) => scene(170, 136, `
  <linearGradient id="gbg-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2f1c"/><stop offset="1" stop-color="#2c1a0d"/></linearGradient>
  <radialGradient id="gglow-${id}" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#c8811f" stop-opacity="0.4"/><stop offset="1" stop-color="#c8811f" stop-opacity="0"/></radialGradient>
  ${glassDefs(id, beer[0], beer[1], foam[0], foam[1])}`, `
  <rect width="170" height="136" fill="url(#gbg-${id})"/>
  <circle cx="85" cy="60" r="80" fill="url(#gglow-${id})"/>
  ${glass(id, 85, 116, 60, 92)}`);

// ---- STORY 280x260: a row of oak conditioning barrels -----------------------
const barrel = (cx, cy, r, id) => `
  <ellipse cx="${cx}" cy="${cy + r * 0.9}" rx="${r * 0.96}" ry="${r * 0.22}" fill="#1c1109" opacity="0.2" filter="url(#soft)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#wood-${id})"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#3c2412" stroke-width="3"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.72}" fill="none" stroke="#7a5027" stroke-width="4" opacity="0.6"/>
  <circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="none" stroke="#7a5027" stroke-width="4" opacity="0.5"/>
  <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}" stroke="#3c2412" stroke-width="1.6" opacity="0.4"/>
  <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#3c2412" stroke-width="1.6" opacity="0.4"/>
  <circle cx="${cx - r * 0.34}" cy="${cy - r * 0.34}" r="${r * 0.5}" fill="#ffffff" opacity="0.06"/>`;

const STORY = scene(280, 260, `
  <linearGradient id="sbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43291a"/><stop offset="1" stop-color="#291809"/></linearGradient>
  <radialGradient id="slight" cx="0.5" cy="0.1" r="0.8"><stop offset="0" stop-color="#c8811f" stop-opacity="0.35"/><stop offset="1" stop-color="#c8811f" stop-opacity="0"/></radialGradient>
  <radialGradient id="wood-a" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#c68a45"/><stop offset="1" stop-color="#7c4f24"/></radialGradient>
  <radialGradient id="wood-b" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#b87c3a"/><stop offset="1" stop-color="#6b421e"/></radialGradient>
  <radialGradient id="wood-c" cx="0.4" cy="0.35" r="0.8"><stop offset="0" stop-color="#cd9450"/><stop offset="1" stop-color="#835529"/></radialGradient>`, `
  <rect width="280" height="260" fill="url(#sbg)"/>
  <rect width="280" height="140" fill="url(#slight)"/>
  <rect x="0" y="210" width="280" height="50" fill="#20130a"/>
  ${barrel(78, 150, 58, 'a')}
  ${barrel(202, 150, 58, 'c')}
  ${barrel(140, 168, 66, 'b')}`);

// ---- logo + social ----------------------------------------------------------
// Two logo variants: `ferry` word coloured for the background it sits on
// (brown on the white light card, cream on the dark card); `Street` stays amber
// in both. The template swaps them with .darkmode-hide / .darkmode-show.
const logo = (ferryColor) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Oswald:600&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .row{display:flex;align-items:center;height:34px}svg{margin-right:9px}
  .wm{font-family:'Oswald',Arial,sans-serif;font-weight:600;font-size:20px;letter-spacing:1.5px;color:${ferryColor};text-transform:uppercase}
  .wm b{color:${AMBER};font-weight:600}</style></head>
  <body><div class="row"><svg width="24" height="34" viewBox="0 0 24 34"><defs>
  <linearGradient id="l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d98a2e"/><stop offset="1" stop-color="#a4501a"/></linearGradient></defs>
  <path d="M4 8 h16 l-2.5 20 a2 2 0 0 1 -2 1.8 h-7 a2 2 0 0 1 -2 -1.8 Z" fill="url(#l)"/>
  <ellipse cx="12" cy="8" rx="8" ry="2.6" fill="#f4ece0"/>
  <path d="M6 6 h12 v1.5 h-12 Z" fill="#fff" opacity="0.5"/></svg>
  <span class="wm">Ferry <b>Street</b></span></div></body></html>`;

const social = (letter) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Oswald:600&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .b{width:28px;height:28px;border-radius:7px;background:${AMBER};display:flex;align-items:center;justify-content:center}
  span{font-family:'Oswald',Arial,sans-serif;font-weight:600;font-size:14px;color:#fff}</style></head>
  <body><div class="b"><span>${letter}</span></div></body></html>`;

const JOBS = [
  { file: 'fsb-hero.jpg', w: 600, h: 360, jpeg: true, html: HERO },
  { file: 'fsb-tap-crisp.jpg', w: 120, h: 120, jpeg: true, html: tastingTile('crisp', PALE, FOAM_LIGHT) },
  { file: 'fsb-tap-malt.jpg', w: 120, h: 120, jpeg: true, html: tastingTile('malt', AMBERALE, FOAM_TAN) },
  { file: 'fsb-tap-dark.jpg', w: 120, h: 120, jpeg: true, html: tastingTile('dark', DARK, FOAM_TAN) },
  { file: 'fsb-gal-1.jpg', w: 170, h: 136, jpeg: true, html: galleryTile('g1', PALE, FOAM_LIGHT) },
  { file: 'fsb-gal-2.jpg', w: 170, h: 136, jpeg: true, html: galleryTile('g2', AMBERALE, FOAM_TAN) },
  { file: 'fsb-gal-3.jpg', w: 170, h: 136, jpeg: true, html: galleryTile('g3', DARK, FOAM_TAN) },
  { file: 'fsb-story.jpg', w: 280, h: 260, jpeg: true, html: STORY },
  { file: 'fsb-logo.png', w: 164, h: 34, html: logo(BROWN) },
  { file: 'fsb-logo-dark.png', w: 164, h: 34, html: logo('#f4ece0') },
  { file: 'fsb-social-facebook.png', w: 28, h: 28, html: social('f') },
  { file: 'fsb-social-twitter.png', w: 28, h: 28, html: social('t') },
  { file: 'fsb-social-instagram.png', w: 28, h: 28, html: social('i') },
  { file: 'fsb-social-untappd.png', w: 28, h: 28, html: social('U') },
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
