# Scrub audit — campaign.html

Change log for `examples/northwind-botanicals/campaign.html`. The file preserves
the exact cross-client compatibility engineering of the 2014 production template
(The Bouqs Co., Marina del Rey, CA). Only content, brand assets, decorative
colors, and copy were replaced. Structure is byte-preserved except where noted.

## Starting state (verified before scrubbing)

The file was **not** a raw Bouqs original. A prior pass had already genericized
it: no `bouq` / `placehold.it` / `homepage.com` image URLs remained, asset
references pointed at `assets/email/*`, and copy was generic ("Company Name",
"Headline", "Lorem ipsum", "Product 1"). The scrub drove that generic file to
the final Northwind branding below.

## Preserved byte-for-byte

XHTML Strict doctype, `html`/`head`/`body` structure, every conditional comment
and its VML block (`v:image`, `v:shape`), CSS resets, `.ReadMsgBody`,
`.ExternalClass`, `.yshortcuts`, `-ms-interpolation-mode`, all `mso-*`
declarations, the media-query block structure, all table structures, the
preheader technique, and every layout spacer table.

## Substitutions

| Area | From | To |
|---|---|---|
| Meta author | `Company Name, sendingemail@email.com` | `Northwind Botanicals, hello@northwindbotanicals.com` |
| Meta reply-to | `ssendingemail@email.com` | `hello@northwindbotanicals.com` |
| Meta url | `http://www.homepage.com` | `https://northwindbotanicals.com` |
| Webfont `@import` | homepage.com placeholder | Google Fonts Cormorant Garamond + Inter |
| Font class | `.flowerpwr` | `.nb-display` (Georgia serif) |
| Font class | `.proxima` | `.nb-body` (Arial) |
| Display font stack | `'flowerpower',Arvo,Rockwell,serif` | `'Cormorant Garamond',Georgia,'Times New Roman',serif` |
| Body font stack | `'proxima_nova*',…` | `'Inter','Helvetica Neue',Arial,Helvetica,sans-serif` (semibold → `font-weight:600`) |

### Decorative colors

`#ff3366`→`#C46B4A`, `#3366cc`→`#1F4E3D`, `#fa765e`→`#C46B4A`,
`#ffb700`→`#1F4E3D`, `#333333`→`#2A2A28`, `#666666`→`#5F5E5A`,
`#999999`→`#5F5E5A`, `#ebebeb`→`#F5F1E8`, `#f3f3f3`→`#F5F1E8`,
`.yshortcuts`→`#2A2A28`. Structural `#ffffff` retained.

### Assets

Present (local relative `assets/nb-*`): logo, mobile logo, hero (HTML + VML),
four products (Foreman, Salt Marsh, Understory, Quarry), share panel, save panel.

Not yet generated — cream data-URI placeholder in the live `src`, flagged
`data-missing-asset="true"` with the intended path in `data-future-src`:
`nb-flank-left.jpg`, `nb-flank-right.jpg`, `nb-hero-tagline.png`,
`nb-hero-headline-bg.png`, `nb-hero-button-bg.png`.

Synthesized data-URI SVGs (intentional placeholders, not flagged missing):
three app-store buttons (charcoal), press banner (cream), five social glyphs
(F, T, I, P, B). The functional transparent spacer stays at
`assets/email/spacer.png` (non-brand, used only by media-query backgrounds).

### Copy

Preheader, view-in-browser, nav (SHOP ARRANGEMENTS / ABOUT US / SUBSCRIBE with
mobile truncation), hero tagline/headline/body/CTA, section header, four
products with prices, share/save promos, press banner, footer name + slogan +
legal, and social alt text all replaced with the winter-arrivals campaign copy.
Pinterest typo fixed; Google+ replaced with Bluesky (`https://bsky.app/`).

## Known conflict

The mandated header comment names "The Bouqs Co." and "proprietary Bouqs brand
content" as provenance. This is the only `bouq` match in the file — the campaign
**body** contains zero. The `grep -ic 'bouq' = 0` acceptance check and the
required attribution comment are mutually exclusive as written; the attribution
was kept because it is required verbatim and documents origin, not proprietary
content.
