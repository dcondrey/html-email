#!/usr/bin/env node
/**
 * generate-lantern-assets.mjs — self-contained illustrated imagery for the
 * Lantern & Quill template. No stock photos: each image is a layered SVG scene
 * (per-shape gradients, soft contact shadows, a faint grain overlay to kill
 * banding) rendered by headless Chrome. Shared helpers (a book, an avatar) keep
 * the team row and the product cards visually consistent. Output at 2x.
 *
 * Usage:  node scripts/generate-lantern-assets.mjs
 */
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'templates', 'lantern-and-quill', 'assets');
mkdirSync(OUT, { recursive: true });

const CORAL = '#e5674f';
const YELLOW = '#f2b544';
const INK = '#3a3550';
const TEAL = '#4a9d8e';
const PLUM = '#7a6a9d';

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

// a book lying flat: coloured cover with a cream page-block on the front edge
const flatBook = (cx, topY, w, h, cover, darker) => `
  <ellipse cx="${cx}" cy="${topY + h + 5}" rx="${w * 0.52}" ry="${h * 0.4}" fill="#3a2a1a" opacity="0.12" filter="url(#soft)"/>
  <rect x="${cx - w / 2}" y="${topY}" width="${w}" height="${h}" rx="4" fill="${cover}"/>
  <rect x="${cx - w / 2}" y="${topY + h - 5}" width="${w}" height="6" rx="2" fill="${darker}"/>
  <rect x="${cx - w / 2 + 5}" y="${topY + 4}" width="${w - 10}" height="4" rx="2" fill="#ffffff" opacity="0.25"/>
  <rect x="${cx + w / 2 - 8}" y="${topY + 3}" width="6" height="${h - 6}" rx="2" fill="#f3ead6"/>`;

// an abstract friendly avatar: head + shoulders on an accent ground
const avatar = (id, ground, skin) => scene(110, 110, `
  <radialGradient id="ag-${id}" cx="0.5" cy="0.35" r="0.8"><stop offset="0" stop-color="${ground}"/><stop offset="1" stop-color="${ground}" stop-opacity="0.75"/></radialGradient>`, `
  <rect width="110" height="110" fill="url(#ag-${id})"/>
  <ellipse cx="55" cy="118" rx="42" ry="34" fill="#ffffff" opacity="0.16"/>
  <path d="M20 110 q0 -30 35 -30 q35 0 35 30 Z" fill="${skin}"/>
  <circle cx="55" cy="46" r="24" fill="${skin}"/>
  <path d="M33 40 q22 -26 44 0 q2 -22 -22 -24 q-24 2 -22 24 Z" fill="#2f2a3f" opacity="0.85"/>
  <circle cx="55" cy="46" r="24" fill="#ffffff" opacity="0.05"/>`);

// a product cover banner: a book on a warm surface, slight tilt
const cover = (id, coverCol, darker, band) => scene(243, 150, `
  <linearGradient id="cbg-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7eddd"/><stop offset="1" stop-color="#ecd9c1"/></linearGradient>
  <linearGradient id="cov-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${coverCol}"/><stop offset="1" stop-color="${darker}"/></linearGradient>`, `
  <rect width="243" height="150" fill="url(#cbg-${id})"/>
  <ellipse cx="121" cy="128" rx="78" ry="14" fill="#7a5a38" opacity="0.16" filter="url(#soft)"/>
  <g transform="rotate(-7 121 74)">
    <rect x="78" y="24" width="86" height="112" rx="6" fill="url(#cov-${id})"/>
    <rect x="78" y="24" width="10" height="112" rx="4" fill="${darker}"/>
    <rect x="100" y="44" width="48" height="7" rx="3" fill="${band}"/>
    <rect x="100" y="58" width="34" height="6" rx="3" fill="#ffffff" opacity="0.6"/>
    <circle cx="124" cy="98" r="16" fill="none" stroke="${band}" stroke-width="3"/>
    <path d="M124 90 l6 8 l-12 0 Z" fill="${band}"/>
  </g>`);

// ---- HERO 600x360: a reading lamp over a stack of books + a quill -----------
const HERO = scene(600, 360, `
  <linearGradient id="hbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5ecdd"/><stop offset="1" stop-color="#ecdac2"/></linearGradient>
  <radialGradient id="lamp" cx="0.5" cy="0.05" r="0.7"><stop offset="0" stop-color="#f9e3a8" stop-opacity="0.95"/><stop offset="1" stop-color="#f9e3a8" stop-opacity="0"/></radialGradient>
  <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9b48a"/><stop offset="1" stop-color="#c69a68"/></linearGradient>
  <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3550"/><stop offset="1" stop-color="#565073"/></linearGradient>`, `
  <rect width="600" height="360" fill="url(#hbg)"/>
  <polygon points="300,44 218,300 382,300" fill="url(#lamp)"/>
  <circle cx="300" cy="150" r="150" fill="url(#lamp)" opacity="0.6"/>
  <rect x="292" y="0" width="16" height="30" fill="#3a3550"/>
  <path d="M262 30 h76 l-14 30 h-48 Z" fill="url(#shade)"/>
  <ellipse cx="300" cy="62" rx="24" ry="5" fill="#f9e3a8"/>
  <rect x="0" y="300" width="600" height="60" fill="#c69a68"/>
  <rect x="0" y="300" width="600" height="4" fill="#ffffff" opacity="0.18"/>
  ${flatBook(300, 256, 190, 20, CORAL, '#c24a34')}
  ${flatBook(288, 234, 170, 22, YELLOW, '#cf9424')}
  ${flatBook(306, 210, 150, 24, TEAL, '#357e70')}
  ${flatBook(296, 188, 122, 22, PLUM, '#5f5185')}
  <!-- a standing book behind the stack -->
  <g transform="rotate(8 430 210)"><rect x="402" y="150" width="70" height="104" rx="5" fill="#e8825f"/><rect x="402" y="150" width="9" height="104" rx="4" fill="#c24a34"/><rect x="420" y="176" width="40" height="6" rx="3" fill="#fff" opacity="0.6"/></g>
  <!-- a quill leaning right -->
  <g transform="rotate(24 470 250)"><path d="M470 120 q26 60 6 140 q-22 -78 -6 -140 Z" fill="#f3ead6"/><path d="M470 130 q16 56 4 120" stroke="#d8c9ad" stroke-width="1.5" fill="none"/><rect x="472" y="252" width="3" height="26" fill="#8a6a3f"/></g>`);

// ---- STORY-less: team avatars + product covers -----------------------------
const LOGO = (word) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Playfair+Display:700&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .row{display:inline-flex;align-items:center;height:36px}svg{margin-right:10px;flex:none}
  .wm{font-family:'Playfair Display',Georgia,serif;font-weight:700;font-size:22px;color:${word};letter-spacing:.3px;white-space:nowrap}
  .wm b{color:${CORAL};font-weight:700}</style></head>
  <body><div class="row"><svg width="26" height="36" viewBox="0 0 26 36"><defs>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9e3a8"/><stop offset="1" stop-color="#f2b544"/></linearGradient></defs>
  <rect x="11" y="1" width="4" height="4" fill="#8a7a4a"/>
  <path d="M6 9 h14 l3 5 v14 a2 2 0 0 1 -2 2 h-16 a2 2 0 0 1 -2 -2 v-14 Z" fill="#3a3550"/>
  <rect x="7" y="13" width="12" height="14" rx="2" fill="url(#g)"/>
  <path d="M8 34 h10 v1.5 h-10 Z" fill="#3a3550"/></svg>
  <span class="wm">Lantern <b>&amp; Quill</b></span></div></body></html>`;

const social = (letter) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Playfair+Display:700&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .b{width:28px;height:28px;border-radius:8px;background:${CORAL};display:flex;align-items:center;justify-content:center}
  span{font-family:'Playfair Display',Georgia,serif;font-weight:700;font-size:15px;color:#fff}</style></head>
  <body><div class="b"><span>${letter}</span></div></body></html>`;

const JOBS = [
  { file: 'lq-hero.jpg', w: 600, h: 360, jpeg: true, html: HERO },
  { file: 'lq-team-1.jpg', w: 110, h: 110, jpeg: true, html: avatar('t1', CORAL, '#f0b9a6') },
  { file: 'lq-team-2.jpg', w: 110, h: 110, jpeg: true, html: avatar('t2', TEAL, '#cdb08a') },
  { file: 'lq-team-3.jpg', w: 110, h: 110, jpeg: true, html: avatar('t3', YELLOW, '#e6a98c') },
  { file: 'lq-book-1.jpg', w: 243, h: 150, jpeg: true, html: cover('b1', TEAL, '#357e70', YELLOW) },
  { file: 'lq-book-2.jpg', w: 243, h: 150, jpeg: true, html: cover('b2', PLUM, '#5f5185', CORAL) },
  { file: 'lq-logo.png', w: 420, h: 36, fit: true, html: LOGO(INK) },
  { file: 'lq-logo-dark.png', w: 420, h: 36, fit: true, html: LOGO('#efe9f2') },
  { file: 'lq-social-facebook.png', w: 28, h: 28, html: social('f') },
  { file: 'lq-social-twitter.png', w: 28, h: 28, html: social('t') },
  { file: 'lq-social-instagram.png', w: 28, h: 28, html: social('i') },
  { file: 'lq-social-goodreads.png', w: 28, h: 28, html: social('g') },
];

const browser = await puppeteer.launch({ channel: 'chrome', headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-color-profile=srgb'] });
try {
  for (const j of JOBS) {
    const page = await browser.newPage();
    await page.setViewport({ width: j.w, height: j.h, deviceScaleFactor: 2 });
    await page.setContent(j.html, { waitUntil: 'load' });
    try { await page.evaluate(() => document.fonts.ready); } catch { /* fonts optional */ }
    await new Promise((r) => setTimeout(r, 250));
    // fit:true clips exactly to the .row content width so the wordmark is never
    // truncated regardless of brand length. The measured width is printed so the
    // partial's <img width>/<height> can match the aspect.
    let clipW = j.w;
    if (j.fit) clipW = Math.ceil(await page.evaluate(() => document.querySelector('.row').getBoundingClientRect().width));
    const opts = { path: resolve(OUT, j.file), clip: { x: 0, y: 0, width: clipW, height: j.h } };
    if (j.jpeg) { opts.type = 'jpeg'; opts.quality = 92; } else { opts.omitBackground = true; }
    await page.screenshot(opts);
    console.log(`wrote ${j.file} (${clipW}x${j.h})`);
    await page.close();
  }
} finally { await browser.close(); }
