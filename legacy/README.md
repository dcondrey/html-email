# legacy/ — the 2014 artifact

Preserved exactly as written in 2014. Nothing here has been modernised; it is
kept as a historical reference and as the origin of the
[framework](../framework/). Do not edit these files — the maintained template
lives in `framework/`.

## `campaign.html`

The original "skeleton" template — a full campaign layout stripped of content,
built for maximum cross-compatibility on the 2014 client landscape (Outlook
2007–2013, iOS 6–7, Android 2–4 stock mail, BlackBerry, Windows Phone 7/8,
Gmail, Yahoo, AOL). It already demonstrates the techniques the modern framework
still uses:

- table-based layout with inline styles,
- `<!--[if mso]>` conditional comments and VML,
- table-cell background images that render in Outlook,
- web-font fallback control so Outlook uses a web-safe font instead of Times
  New Roman,
- styled alt text, link and date handling,
- collapsing structure that degrades gracefully with images off,
- responsive behaviour for every client capable of it at the time.

What it predates: dark mode, the Chromium "new Outlook," retina imagery,
`prefers-color-scheme`, screen-reader `role` semantics, and one-click
unsubscribe. Those are the gap the modern `framework/` closes — see the
[quirks reference](../README.md#the-quirks-reference).

## `checklist/`

The original **best-practice checklist** — a single-page interactive app that
walked you through setup, design, and development steps for an email campaign.
It was also a demo of using a published Google Spreadsheet as a lightweight
database: `main.js` fetched rows from the Google Sheets **`gsx$` list feed** and
rendered them into three tabbed sections.

> **Note:** Google shut down the Sheets API v3 `gsx$` feeds in 2021, so the
> checklist no longer loads its data live. It is preserved here for historical
> interest — the interaction pattern and the checklist content in the original
> spreadsheet were the point. Rebuilding it on a static JSON data source would
> be a small, self-contained project; it is intentionally left untouched.

## Why keep it?

Because the philosophy behind this repository is that nothing with real value
should become undiscoverable. The 2014 template solved a genuinely hard problem
and the approach has aged well — seeing the original alongside the modern
framework is the clearest way to understand both what changed and what didn't.
