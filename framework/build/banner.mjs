#!/usr/bin/env node
/**
 * banner.mjs — the attribution notice carried by every built email.
 *
 * MIT requires the copyright notice to survive in copies of the work, but the
 * thing that actually gets copied here is the built HTML pasted into an ESP,
 * not the repository. So the notice ships inside the artifact, and survives
 * --production: the minifier keeps `<!--!` comments the way JS minifiers keep
 * `/*!`. Roughly 180 bytes against Gmail's 102KB clip budget.
 */

import { isConditional } from './comments.mjs';

export const ATTRIBUTION =
  '<!--! html-email · cross-client HTML email framework · Copyright (c) 2014-2026 David Condrey · ' +
  'MIT Licensed · Please keep this notice · https://github.com/dcondrey/html-email -->';

/** Comments the production minifier must not drop: MSO conditionals, and `<!--!`. */
export const isPreservedComment = (comment) => isConditional(comment) || comment.startsWith('<!--!');

/**
 * Insert the notice directly after the doctype. Before it would put a comment
 * ahead of the DOCTYPE, which drops older engines into quirks mode — the exact
 * class of breakage this framework exists to avoid.
 */
export function withAttribution(html) {
  if (html.includes('<!--! html-email')) return html;
  const doctype = html.match(/<!DOCTYPE[^>]*>/i);
  if (!doctype) return `${ATTRIBUTION}\n${html}`;
  const at = doctype.index + doctype[0].length;
  return `${html.slice(0, at)}\n${ATTRIBUTION}${html.slice(at)}`;
}
