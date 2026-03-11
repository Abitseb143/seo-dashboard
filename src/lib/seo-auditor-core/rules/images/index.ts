/**
 * Images Rules
 *
 * This module exports all image-related audit rules and registers them.
 * Covers alt text, dimensions, formats, lazy loading, broken images,
 * figure captions, filenames, inline SVGs, picture elements,
 * alt text length, and background image SEO.
 */

import { registerRule } from '../registry';

import { altPresentRule } from './alt-present';
import { altQualityRule } from './alt-quality';
import { dimensionsRule } from './dimensions';
import { lazyLoadingRule } from './lazy-loading';
import { modernFormatRule } from './modern-format';
import { sizeRule } from './size';
import { responsiveRule } from './responsive';
import { brokenRule } from './broken';
import { figureCaptionsRule } from './figure-captions';
import { filenameQualityRule } from './filename-quality';
import { inlineSvgSizeRule } from './inline-svg-size';
import { pictureElementRule } from './picture-element';

// New image rules
import { altLengthRule } from './alt-length';
import { backgroundSeoRule } from './background-seo';

// Export all rules
export {
  altPresentRule,
  altQualityRule,
  dimensionsRule,
  lazyLoadingRule,
  modernFormatRule,
  sizeRule,
  responsiveRule,
  brokenRule,
  figureCaptionsRule,
  filenameQualityRule,
  inlineSvgSizeRule,
  pictureElementRule,
  altLengthRule,
  backgroundSeoRule,
};

// Register all rules
registerRule(altPresentRule);
registerRule(altQualityRule);
registerRule(dimensionsRule);
registerRule(lazyLoadingRule);
registerRule(modernFormatRule);
registerRule(sizeRule);
registerRule(responsiveRule);
registerRule(brokenRule);
registerRule(figureCaptionsRule);
registerRule(filenameQualityRule);
registerRule(inlineSvgSizeRule);
registerRule(pictureElementRule);
registerRule(altLengthRule);
registerRule(backgroundSeoRule);
