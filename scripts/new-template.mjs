#!/usr/bin/env node
/**
 * new-template.mjs — scaffold a new branded template.
 *
 * Stamps out templates/<name>/ with the full house skeleton (partials, manifest,
 * content.json, an asset-generator stub, and an assets/ dir) so a new design
 * starts from a buildable, lint-clean base instead of a hand-copied one. The
 * generated template builds and lints 0/0 immediately; images 404 until you run
 * the asset generator, which is the point where you make it yours.
 *
 * Usage:
 *   node scripts/new-template.mjs acme-widgets "Acme Widgets"
 *   node scripts/new-template.mjs acme-widgets      (brand name derived from slug)
 *
 * After scaffolding:
 *   node scripts/build-template.mjs templates/acme-widgets
 *   node framework/build/lint.mjs --profile house templates/acme-widgets/dist/email.html
 *   # then edit the palette in 00-document-open.html, the copy in content.json,
 *   # and fill in scripts/generate-acme-widgets-assets.mjs. Finally wire the
 *   # template into package.json + .github/workflows/{ci,release}.yml.
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const NAME = process.argv[2];
if (!NAME || !/^[a-z][a-z0-9-]*$/.test(NAME)) {
  console.error('usage: node scripts/new-template.mjs <kebab-name> ["Brand Name"]');
  console.error('  <kebab-name> must be lowercase letters, digits, and hyphens (e.g. acme-widgets).');
  process.exit(2);
}
// Brand: given, or Title-Cased from the slug ("acme-widgets" -> "Acme Widgets").
const BRAND = process.argv[3] || NAME.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
// A short asset prefix from the slug initials ("acme-widgets" -> "aw").
const PREFIX = NAME.split('-').map((w) => w[0]).join('').slice(0, 3);

const DIR = resolve(ROOT, 'templates', NAME);
if (existsSync(DIR)) {
  console.error(`✗ templates/${NAME} already exists — pick another name or remove it first.`);
  process.exit(1);
}

// ---- file bodies -----------------------------------------------------------
// Neutral indigo-on-grey starter palette. Search for "PALETTE" to retheme.
const documentOpen = `<!--
  ============================================================================
  00-document-open.html — doctype, <head>, resets, dark mode, wrapper open
  ============================================================================
  Scaffolded by scripts/new-template.mjs. Follows the house conventions: XHTML
  Transitional doctype, MSO OfficeDocumentSettings, resets, fluid-hybrid
  responsive, three-path dark mode, role="presentation" wrappers, MSO ghost
  table pinned to the content width. Brand: fictitious ${BRAND}.
  PALETTE — retheme by editing the colours below and in the other partials.
-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
  <title>{{title}}</title>

  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

  <!--[if mso]>
  <style type="text/css">
    /* Word has no web-font support: force a web-safe fallback, not Times. If you
       add a Google Font below, name it first here too. Keep Word's leading/table fixes. */
    * { font-family: Arial, Helvetica, sans-serif !important; }
    td, th, div, p, a, span, li { mso-line-height-rule: exactly; }
    table { border-collapse: collapse; }
  </style>
  <![endif]-->

  <!-- To use a Google Font: add a stylesheet link inside the downlevel-revealed
       conditional-comment form shown in any templates/*/00-document-open.html, and
       always include the display=swap parameter or FOIT hides all the text. -->

  <style type="text/css">
    /* 1. RESETS */
    html, body { margin:0 !important; padding:0 !important; height:100% !important; width:100% !important; }
    * { -ms-text-size-adjust:100%; -webkit-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt !important; mso-table-rspace:0pt !important; }
    table { border-collapse:collapse !important; border-spacing:0; }
    img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; display:block; }
    .ExternalClass { width:100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height:100%; }
    a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important; }
    u + #body a, #MessageViewBody a { color:inherit; text-decoration:none; }
    #MessageViewBody a { color:inherit; }

    /* 2. FLUID-HYBRID RESPONSIVE (media query is an enhancement, not a dependency) */
    .email-container { width:100%; max-width:600px; margin:0 auto; }
    .fluid { max-width:100%; height:auto; margin-left:auto; margin-right:auto; }
    .stack-column { display:inline-block; width:100%; max-width:300px; vertical-align:top; box-sizing:border-box; }

    @media screen and (max-width:600px) {
      .email-container { width:100% !important; margin:auto !important; }
      .fluid { width:100% !important; max-width:100% !important; height:auto !important; }
      .stack-column, .stack-column-center { display:block !important; width:100% !important; max-width:100% !important; }
      .center-on-narrow { text-align:center !important; }
      .pad-on-narrow { padding-left:20px !important; padding-right:20px !important; }
      .hide-on-narrow { display:none !important; max-height:0 !important; overflow:hidden !important; mso-hide:all !important; }
    }

    /* 3. DARK MODE — prefers-color-scheme + Outlook.com [data-ogsc]/[data-ogsb] */
    @media (prefers-color-scheme: dark) {
      .darkmode-bg { background-color:#101116 !important; }
      .darkmode-text, .darkmode-text * { color:#e8e9ec !important; }
      .darkmode-muted, .darkmode-muted * { color:#9aa0ab !important; }
      .darkmode-card { background-color:#1e2027 !important; }
    }
    [data-ogsc] .darkmode-text, [data-ogsc] .darkmode-text * { color:#e8e9ec !important; }
    [data-ogsc] .darkmode-muted, [data-ogsc] .darkmode-muted * { color:#9aa0ab !important; }
    [data-ogsb] .darkmode-bg { background-color:#101116 !important; }
    [data-ogsb] .darkmode-card { background-color:#1e2027 !important; }
  </style>
</head>

<body id="body" style="margin:0 !important; padding:0 !important; mso-line-height-rule:exactly; background-color:#e5e7ec; color:#1f2330; font-family:Arial,Helvetica,sans-serif;">

  <!-- {{>preheader}} -->

  <div role="article" aria-roledescription="email" aria-label="{{title}}" lang="en" style="background-color:#e5e7ec;">

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="darkmode-bg" style="background-color:#e5e7ec;">
      <tr>
        <td align="center" valign="top" style="padding:40px 12px;">

          <!--[if mso]>
          <table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td>
          <![endif]-->
          <div class="email-container" style="max-width:600px; margin:0 auto;">
`;

const gap = `          <!-- 10px gap: the page shows through between cards -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-size:0; line-height:0; height:10px;">&nbsp;</td></tr></table>
`;

const preheader = `          <!--
            Hidden preheader: the inbox preview line. display:none + zero-size +
            the &zwnj;&nbsp; run pushes body text out of the preview so only this
            shows. mso-hide:all covers Outlook.
          -->
          <div style="display:none; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all; color:#e5e7ec;">
            {{preheaderText}}
            &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
          </div>
`;

const headerBar = `          <!-- Header bar: date + view-online, rounded top -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="darkmode-card" style="background-color:#2c2f36; border-radius:6px 6px 0 0;">
            <tr>
              <td class="pad-on-narrow" style="padding:14px 30px; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:16px; letter-spacing:1px; text-transform:uppercase; color:#c9ccd4;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" style="color:#c9ccd4; font-family:Arial,Helvetica,sans-serif; font-size:12px; letter-spacing:1px; text-transform:uppercase;">{{headerDate}}</td>
                    <td align="right" style="font-family:Arial,Helvetica,sans-serif; font-size:12px; letter-spacing:1px; text-transform:uppercase;"><a href="{{viewInBrowserUrl}}" target="_blank" style="color:#8b87ff; text-decoration:none;">View online</a></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
`;

const logoNav = `          <!-- Logo + nav. Two fluid-hybrid columns: logo left, nav right. -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="darkmode-card" style="background-color:#ffffff;">
            <tr>
              <td align="center" valign="middle" class="pad-on-narrow" style="padding:22px 30px; font-size:0; text-align:center;">
                <!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="180" valign="middle"><![endif]-->
                <div class="stack-column center-on-narrow" style="display:inline-block; width:100%; max-width:180px; vertical-align:middle; text-align:left;">
                  <a href="{{logoLinkUrl}}" target="_blank" style="text-decoration:none;"><img src="{{logoUrl}}" width="150" height="30" alt="{{companyName}}" style="display:block; border:0;" class="center-on-narrow"></a>
                </div>
                <!--[if mso]></td><td valign="middle"><![endif]-->
                <div class="stack-column center-on-narrow" style="display:inline-block; width:100%; max-width:390px; vertical-align:middle;">
                  <div class="darkmode-text center-on-narrow" style="font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:26px; letter-spacing:1px; text-transform:uppercase; color:#1f2330; text-align:right;">
                    <a href="#" target="_blank" style="color:#1f2330; text-decoration:none;">{{nav1}}</a> &nbsp;&nbsp;
                    <a href="#" target="_blank" style="color:#1f2330; text-decoration:none;">{{nav2}}</a> &nbsp;&nbsp;
                    <a href="#" target="_blank" style="color:#4f46e5; text-decoration:none;">{{nav3}}</a>
                  </div>
                </div>
                <!--[if mso]></td></tr></table><![endif]-->
              </td>
            </tr>
          </table>
`;

const hero = `          <!-- Hero: full-width image + card (eyebrow + headline + intro + button) -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="darkmode-card" style="background-color:#ffffff;">
            <tr>
              <td align="center" valign="top" style="font-size:0; line-height:0;">
                <a href="{{heroLinkUrl}}" target="_blank" style="text-decoration:none;"><img src="{{heroImageUrl}}" width="600" height="320" alt="{{heroImageAlt}}" class="fluid" style="width:100%; max-width:600px; height:auto; display:block; border:0;"></a>
              </td>
            </tr>
            <tr>
              <td class="pad-on-narrow" style="padding:38px 44px 42px 44px;">
                <div style="font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:12px; line-height:16px; letter-spacing:3px; text-transform:uppercase; color:#4f46e5; padding-bottom:14px;">{{heroEyebrow}}</div>
                <div class="darkmode-text" style="font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:30px; line-height:38px; color:#1f2330; padding-bottom:16px;">{{heroHeadline}}</div>
                <div class="darkmode-muted" style="font-family:Arial,Helvetica,sans-serif; font-size:15px; line-height:26px; color:#6b7280; padding-bottom:28px;">{{heroText}}</div>
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{heroUrl}}" style="height:46px;v-text-anchor:middle;width:180px;" arcsize="12%" strokecolor="#4f46e5" fillcolor="#4f46e5">
                  <w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;letter-spacing:1px;">{{heroButton}}</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="{{heroUrl}}" target="_blank" style="background:#4f46e5; border-radius:6px; color:#ffffff; display:inline-block; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; line-height:46px; text-align:center; text-decoration:none; padding:0 32px; mso-hide:all;">{{heroButton}}</a>
                <!--<![endif]-->
              </td>
            </tr>
          </table>
`;

const footer = `          {{>gap}}
          <!-- Footer: name + address + unsubscribe. Off-white card, not pure
               black/white, so dark-mode inversion stays graceful. -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="darkmode-card" style="background-color:#f4f4f7; border-radius:6px 6px 0 0;">
            <tr>
              <td align="center" class="pad-on-narrow" style="padding:40px;">
                <div class="darkmode-text" style="font-family:Arial,Helvetica,sans-serif; font-weight:bold; font-size:16px; line-height:22px; color:#1f2330; padding-bottom:8px;">{{companyName}}</div>
                <div class="darkmode-muted" style="font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:20px; color:#6b7280; padding-bottom:16px;">{{companyAddress}}</div>
                <div class="darkmode-muted" style="font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:18px; color:#9aa0ab; padding-bottom:16px;"><a href="{{unsubscribeUrl}}" target="_blank" style="color:#9aa0ab; text-decoration:underline;">Unsubscribe</a> from this mailing list.</div>
                <div class="darkmode-muted" style="font-family:Arial,Helvetica,sans-serif; font-size:11px; line-height:16px; color:#a9adb6;">{{legalText}}</div>
              </td>
            </tr>
          </table>
`;

const documentClose = `          </div><!-- /.email-container -->
          <!--[if mso]>
          </td></tr></table>
          <![endif]--><!-- /ghost table -->

        </td>
      </tr>
    </table><!-- /background wrapper -->
  </div><!-- /role=article -->
</body>
</html>
`;

const manifest = JSON.stringify([
  '00-document-open.html',
  '10-header-bar.html',
  '20-logo-nav.html',
  '30-hero.html',
  '90-footer.html',
  '99-document-close.html',
], null, 2) + '\n';

const content = JSON.stringify({
  title: `${BRAND}: a starting point`,
  preheaderText: `This is a scaffolded ${BRAND} template. Replace this preheader with your inbox preview line.`,
  companyName: BRAND,
  logoLinkUrl: '#',
  logoUrl: `../assets/${PREFIX}-logo.png`,
  headerDate: 'Jan 1, 2026',
  viewInBrowserUrl: '#',
  nav1: 'One',
  nav2: 'Two',
  nav3: 'More',
  heroLinkUrl: '#',
  heroImageUrl: `../assets/${PREFIX}-hero.jpg`,
  heroImageAlt: `${BRAND} hero image`,
  heroEyebrow: 'Replace me',
  heroHeadline: 'A headline that states the one thing',
  heroText: 'One short paragraph of supporting copy. Terse, declarative, no filler. Say what the reader gets and why it matters, then get out of the way.',
  heroButton: 'Primary action',
  heroUrl: '#',
  companyAddress: '1 Example Street, Anytown, ST 00000',
  unsubscribeUrl: '*|UNSUB|*',
  legalText: `${BRAND} is a fictitious brand used as sample content in an open-source HTML email compatibility framework. See github.com/dcondrey/html-email for details.`,
}, null, 2) + '\n';

const assetStub = `#!/usr/bin/env node
/**
 * generate-${NAME}-assets.mjs — self-contained imagery for the ${BRAND} template.
 *
 * Fill this in following scripts/generate-cairn-assets.mjs as the reference:
 * layered SVG scenes (per-shape gradients, soft contact shadows, a faint grain
 * overlay) rendered by headless Chrome, output at 2x. At minimum produce:
 *   ${PREFIX}-logo.png   (150x30)   the wordmark/logo
 *   ${PREFIX}-hero.jpg   (600x320)  the hero scene
 * Match the asset paths in build/content.json.
 *
 * Usage:  node scripts/generate-${NAME}-assets.mjs
 */
import { mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'templates', '${NAME}', 'assets');
mkdirSync(OUT, { recursive: true });

console.log('TODO: implement ${BRAND} asset generation. See scripts/generate-cairn-assets.mjs.');
`;

// ---- write -----------------------------------------------------------------
const files = [
  ['partials/00-document-open.html', documentOpen],
  ['partials/01-gap.html', gap],
  ['partials/05-preheader.html', preheader],
  ['partials/10-header-bar.html', headerBar],
  ['partials/20-logo-nav.html', logoNav],
  ['partials/30-hero.html', hero],
  ['partials/90-footer.html', footer],
  ['partials/99-document-close.html', documentClose],
  ['build/manifest.json', manifest],
  ['build/content.json', content],
  ['assets/.gitkeep', ''],
];

for (const [rel, body] of files) {
  const full = resolve(DIR, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, body, 'utf8');
}
writeFileSync(resolve(ROOT, 'scripts', `generate-${NAME}-assets.mjs`), assetStub, 'utf8');

console.log(`✓ scaffolded templates/${NAME}/  (brand: ${BRAND}, asset prefix: ${PREFIX})`);
console.log('');
console.log('Next:');
console.log(`  node scripts/build-template.mjs templates/${NAME}`);
console.log(`  node framework/build/lint.mjs --profile house templates/${NAME}/dist/email.html   # 0 fail`);
console.log(`  # then retheme partials/00-document-open.html, edit build/content.json,`);
console.log(`  # implement scripts/generate-${NAME}-assets.mjs, and wire the template into`);
console.log(`  # package.json + .github/workflows/{ci,release}.yml.`);
