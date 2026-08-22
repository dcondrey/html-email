#!/usr/bin/env node
/**
 * comments.mjs — remove HTML comments in one left-to-right pass.
 *
 * Shared by the linter (which ignores documentation comments when counting
 * markup) and both builders (which strip them in --production). Scanned rather
 * than `replace`d: a regex replace over multi-character delimiters leaves
 * overlapping ones behind, which reads as a broken sanitizer
 * (CodeQL js/incomplete-multi-character-sanitization).
 *
 * `keep(comment)` decides what survives. An unterminated comment is left in
 * place, matching the lazy-regex behaviour this replaced.
 */
export function stripComments(html, keep) {
  let out = '';
  let i = 0;
  for (;;) {
    const open = html.indexOf('<!--', i);
    if (open === -1) break;
    const close = html.indexOf('-->', open + 4);
    if (close === -1) break;
    const comment = html.slice(open, close + 3);
    out += html.slice(i, open) + (keep(comment) ? comment : '');
    i = close + 3;
  }
  return out + html.slice(i);
}

/** MSO conditionals, including the downlevel-revealed form, must always survive. */
export const isConditional = (comment) => /\[if\b|<!\[endif\]|\[endif\]/.test(comment);
