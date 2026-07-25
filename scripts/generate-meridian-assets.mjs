#!/usr/bin/env node
/**
 * generate-meridian-assets.mjs — self-contained illustrated imagery for the
 * Meridian Advisory template. No stock photos and no faces: each image is an
 * abstract, corporate SVG scene (per-shape gradients, soft shadows, a faint
 * grain overlay to kill banding) rendered by headless Chrome. Restrained
 * charcoal + coral on light. Output at 2x for retina.
 *
 * Usage:  node scripts/generate-meridian-assets.mjs
 */
import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'templates', 'meridian-advisory', 'assets');
mkdirSync(OUT, { recursive: true });

const CHARCOAL = '#2c2f36';
const CORAL = '#ee6c4d';

const FILTERS = `
  <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/></filter>`;

const scene = (w, h, defs, body) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0}</style></head><body>
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>${FILTERS}${defs}</defs>
    ${body}
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.04"/>
  </svg></body></html>`;

// ---- HERO 600x340: ascending bars + a coral trend cresting a meridian arc ---
const HERO = scene(600, 340, `
  <linearGradient id="hbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f5f6f8"/><stop offset="1" stop-color="#e7eaee"/></linearGradient>
  <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3e47"/><stop offset="1" stop-color="#2a2d34"/></linearGradient>
  <linearGradient id="barc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2825f"/><stop offset="1" stop-color="#e05f3f"/></linearGradient>`, `
  <rect width="600" height="340" fill="url(#hbg)"/>
  <!-- faint grid -->
  <g stroke="#ccd0d6" stroke-width="1" opacity="0.55">
    <line x1="0" y1="90" x2="600" y2="90"/><line x1="0" y1="160" x2="600" y2="160"/><line x1="0" y1="230" x2="600" y2="230"/>
  </g>
  <!-- meridian arc cresting over the scene -->
  <path d="M60 250 Q300 40 540 250" fill="none" stroke="#c3c8d0" stroke-width="2" stroke-dasharray="2 6"/>
  <circle cx="300" cy="96" r="7" fill="${CORAL}"/><circle cx="300" cy="96" r="15" fill="${CORAL}" opacity="0.16"/>
  <!-- ascending bars -->
  <rect x="112" y="230" width="46" height="58" rx="3" fill="url(#bar)"/>
  <rect x="188" y="204" width="46" height="84" rx="3" fill="url(#bar)"/>
  <rect x="264" y="176" width="46" height="112" rx="3" fill="url(#bar)"/>
  <rect x="340" y="150" width="46" height="138" rx="3" fill="url(#bar)"/>
  <rect x="416" y="120" width="46" height="168" rx="3" fill="url(#barc)"/>
  <!-- coral trend line over the bar tops -->
  <polyline points="135,230 211,204 287,176 363,150 439,120" fill="none" stroke="${CORAL}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <g fill="#ffffff" stroke="${CORAL}" stroke-width="2.5">
    <circle cx="135" cy="230" r="4"/><circle cx="211" cy="204" r="4"/><circle cx="287" cy="176" r="4"/><circle cx="363" cy="150" r="4"/><circle cx="439" cy="120" r="4"/>
  </g>
  <rect x="0" y="288" width="600" height="52" fill="#dfe3e8"/>`);

// ---- SERVICE A 240x200: strategy — a target with a coral arrow in the centre-
const STRATEGY = scene(240, 200, `
  <linearGradient id="sbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef0f3"/><stop offset="1" stop-color="#e0e3e8"/></linearGradient>`, `
  <rect width="240" height="200" fill="url(#sbg)"/>
  <circle cx="120" cy="100" r="66" fill="none" stroke="#c7ccd3" stroke-width="10"/>
  <circle cx="120" cy="100" r="44" fill="none" stroke="${CHARCOAL}" stroke-width="9" opacity="0.85"/>
  <circle cx="120" cy="100" r="22" fill="none" stroke="#c7ccd3" stroke-width="8"/>
  <circle cx="120" cy="100" r="7" fill="${CORAL}"/>
  <!-- arrow into the bullseye -->
  <line x1="196" y1="30" x2="128" y2="92" stroke="${CHARCOAL}" stroke-width="5" stroke-linecap="round"/>
  <path d="M120 100 l22 -8 l-6 -8 Z" fill="${CORAL}"/>
  <path d="M196 30 l-14 2 l6 12 Z" fill="${CORAL}"/>`);

// ---- SERVICE B 240x200: analysis — bars, trend line, and a magnifier --------
const ANALYSIS = scene(240, 200, `
  <linearGradient id="abg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef0f3"/><stop offset="1" stop-color="#e0e3e8"/></linearGradient>`, `
  <rect width="240" height="200" fill="url(#abg)"/>
  <line x1="40" y1="150" x2="210" y2="150" stroke="#c7ccd3" stroke-width="3"/>
  <rect x="54" y="104" width="26" height="46" rx="2" fill="${CHARCOAL}" opacity="0.85"/>
  <rect x="92" y="82" width="26" height="68" rx="2" fill="${CHARCOAL}" opacity="0.85"/>
  <rect x="130" y="58" width="26" height="92" rx="2" fill="${CHARCOAL}" opacity="0.85"/>
  <polyline points="67,96 105,74 143,50 181,40" fill="none" stroke="${CORAL}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- magnifier over the peak -->
  <circle cx="170" cy="120" r="30" fill="#ffffff" opacity="0.55"/>
  <circle cx="170" cy="120" r="30" fill="none" stroke="${CHARCOAL}" stroke-width="6"/>
  <line x1="192" y1="142" x2="212" y2="162" stroke="${CHARCOAL}" stroke-width="8" stroke-linecap="round"/>
  <polyline points="158,124 168,132 184,110" fill="none" stroke="${CORAL}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`);

// ---- logo + social ----------------------------------------------------------
const logo = (word) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:600,700&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .row{display:inline-flex;align-items:center;height:32px}svg{margin-right:9px;flex:none}
  .wm{font-family:'IBM Plex Sans',Arial,sans-serif;font-weight:700;font-size:19px;letter-spacing:1px;color:${word};text-transform:uppercase;white-space:nowrap}
  .wm b{color:${CORAL};font-weight:600}</style></head>
  <body><div class="row"><svg width="30" height="28" viewBox="0 0 30 28">
  <path d="M3 22 Q15 2 27 22" fill="none" stroke="${word}" stroke-width="2.5"/>
  <circle cx="15" cy="8" r="4.5" fill="${CORAL}"/></svg>
  <span class="wm">Meridian<b>&nbsp;Advisory</b></span></div></body></html>`;

const social = (letter, size) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:600&display=swap" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .b{width:28px;height:28px;border-radius:6px;background:${CORAL};display:flex;align-items:center;justify-content:center}
  span{font-family:'IBM Plex Sans',Arial,sans-serif;font-weight:600;font-size:${size || 13}px;color:#fff}</style></head>
  <body><div class="b"><span>${letter}</span></div></body></html>`;

const JOBS = [
  { file: 'mer-hero.jpg', w: 600, h: 340, jpeg: true, html: HERO },
  { file: 'mer-service-1.jpg', w: 240, h: 200, jpeg: true, html: STRATEGY },
  { file: 'mer-service-2.jpg', w: 240, h: 200, jpeg: true, html: ANALYSIS },
  { file: 'mer-logo.png', w: 420, h: 32, fit: true, html: logo(CHARCOAL) },
  { file: 'mer-logo-dark.png', w: 420, h: 32, fit: true, html: logo('#e8e9ec') },
  { file: 'mer-social-linkedin.png', w: 28, h: 28, html: social('in', 11) },
  { file: 'mer-social-twitter.png', w: 28, h: 28, html: social('t') },
  { file: 'mer-social-facebook.png', w: 28, h: 28, html: social('f') },
  { file: 'mer-social-web.png', w: 28, h: 28, html: social('@', 12) },
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
