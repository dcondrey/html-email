#!/usr/bin/env node
/**
 * generate-cairn-assets.mjs — mock imagery for the Cairn Wellness template.
 *
 * The layout expects photography; instead this renders tasteful on-brand
 * placeholders (soft gradients + a simple motif per section) in the template's
 * green/cream/amber palette. Output at 2x for retina; each <img> in the template
 * carries an explicit width/height.
 *
 * Usage:  node scripts/generate-cairn-assets.mjs
 */
import puppeteer from 'puppeteer';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'templates', 'cairn-wellness', 'assets');

const GREEN = '#5e8f5a', DGREEN = '#445942', SAGE = '#c3d3b2', CREAM = '#f6efe7', AMBER = '#ebb67d', KRAFT = '#d9c7a8';

const panel = (w, h, from, to, motif) => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0}</style></head><body>
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>${motif}
  </svg></body></html>`;

// stacked "cairn" of smoothed stones, centred at (cx, baseY)
function cairn(cx, baseY, scale = 1) {
  const stones = [
    { w: 92, h: 30, fill: '#8f9a86' },
    { w: 78, h: 26, fill: '#a7a294' },
    { w: 64, h: 23, fill: '#7d8a78' },
    { w: 50, h: 19, fill: '#b9b1a2' },
    { w: 36, h: 15, fill: '#6f7c6b' },
  ];
  let y = baseY, out = '<g opacity="0.9">';
  for (const s of stones) {
    out += `<ellipse cx="${cx}" cy="${y}" rx="${(s.w * scale) / 2}" ry="${(s.h * scale) / 2}" fill="${s.fill}"/>`;
    y -= (s.h * scale) * 0.82;
  }
  return out + '</g>';
}
const candles = (cx, baseY) => `<g opacity="0.92">
  <rect x="${cx - 42}" y="${baseY - 90}" width="34" height="90" rx="6" fill="#efe6d4"/>
  <rect x="${cx + 8}" y="${baseY - 66}" width="30" height="66" rx="6" fill="#e7dcc6"/>
  <ellipse cx="${cx - 25}" cy="${baseY - 98}" rx="6" ry="12" fill="${AMBER}"/>
  <ellipse cx="${cx + 23}" cy="${baseY - 74}" rx="5" ry="10" fill="${AMBER}"/></g>`;
const figure = (cx, cy) => `<path d="M ${cx} ${cy - 55} C ${cx - 34} ${cy - 55}, ${cx - 30} ${cy + 55}, ${cx} ${cy + 55} C ${cx + 30} ${cy + 55}, ${cx + 34} ${cy - 55}, ${cx} ${cy - 55} Z" fill="#8f9a86" opacity="0.9"/><circle cx="${cx}" cy="${cy - 40}" r="15" fill="#7d8a78"/>`;
const cup = (cx, cy) => `<g opacity="0.9"><path d="M ${cx - 40} ${cy} h 70 v 26 a 35 35 0 0 1 -70 0 Z" fill="#e7dcc6"/><path d="M ${cx + 30} ${cy + 4} q 26 6 0 30" fill="none" stroke="#e7dcc6" stroke-width="7"/><path d="M ${cx - 14} ${cy - 26} q 8 8 0 18 M ${cx + 6} ${cy - 30} q 8 8 0 18" fill="none" stroke="#b7c3ad" stroke-width="4" stroke-linecap="round"/></g>`;
const gift = (cx, cy) => `<g opacity="0.92"><rect x="${cx - 45}" y="${cy - 35}" width="90" height="70" rx="6" fill="#e7dcc6"/><rect x="${cx - 8}" y="${cy - 35}" width="16" height="70" fill="${AMBER}"/><rect x="${cx - 45}" y="${cy - 8}" width="90" height="16" fill="${AMBER}"/><circle cx="${cx - 8}" cy="${cy - 35}" r="9" fill="${AMBER}"/><circle cx="${cx + 8}" cy="${cy - 35}" r="9" fill="${AMBER}"/></g>`;

const wordmark = () => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Poppins:700" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .row{display:flex;align-items:center;height:30px}
  svg{margin-right:8px}
  .wm{font-family:'Poppins',Arial,sans-serif;font-weight:700;font-size:20px;color:${DGREEN};letter-spacing:.5px}</style></head>
  <body><div class="row">
    <svg width="26" height="30" viewBox="0 0 26 30"><g fill="${DGREEN}">
      <ellipse cx="13" cy="26" rx="12" ry="4"/><ellipse cx="13" cy="18" rx="9" ry="3.4"/><ellipse cx="13" cy="11" rx="6.5" ry="3"/><ellipse cx="13" cy="5.5" rx="4" ry="2.4"/></g></svg>
    <span class="wm">cairn</span></div></body></html>`;

const social = (letter) => `<!doctype html><html><head><meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css?family=Poppins:700" rel="stylesheet"><style>html,body{margin:0;padding:0;background:transparent}
  .b{width:28px;height:28px;border-radius:7px;background:${DGREEN};display:flex;align-items:center;justify-content:center}
  span{font-family:'Poppins',Arial,sans-serif;font-weight:700;font-size:13px;color:#fff}</style></head>
  <body><div class="b"><span>${letter}</span></div></body></html>`;

const JOBS = [
  { file: 'cw-hero.jpg', w: 600, h: 360, jpeg: true, html: panel(600, 360, CREAM, SAGE, cairn(300, 300, 1.6)) },
  { file: 'cw-candles.jpg', w: 280, h: 300, jpeg: true, html: panel(280, 300, CREAM, '#efe3d0', candles(140, 220)) },
  { file: 'cw-statues.jpg', w: 280, h: 210, jpeg: true, html: panel(280, 210, SAGE, CREAM, figure(140, 105)) },
  { file: 'cw-corner.jpg', w: 280, h: 300, jpeg: true, html: panel(280, 300, '#eef0e6', '#dfe6d5', cup(140, 170)) },
  { file: 'cw-gifts.jpg', w: 280, h: 210, jpeg: true, html: panel(280, 210, KRAFT, '#efe3d0', gift(140, 105)) },
  { file: 'cw-logo.png', w: 150, h: 30, html: wordmark() },
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
    if (j.jpeg) { opts.type = 'jpeg'; opts.quality = 90; } else { opts.omitBackground = true; }
    await page.screenshot(opts);
    console.log(`wrote ${j.file} (${j.w}x${j.h})`);
    await page.close();
  }
} finally { await browser.close(); }
