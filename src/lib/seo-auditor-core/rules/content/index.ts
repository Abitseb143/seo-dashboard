/**
 * Content Rules
 *
 * This module exports all content-related audit rules and registers them.
 * - Word count (thin content detection)
 * - Reading level (Flesch-Kincaid)
 * - Keyword stuffing detection
 * - Article link density
 * - Broken HTML structure
 * - Meta tags in body detection
 * - MIME type validation
 * - Duplicate description detection
 * - Heading hierarchy and structure
 * - Text-to-HTML ratio
 * - Title same as H1 detection
 * - Title pixel width estimation
 * - Description pixel width estimation
 * - Exact duplicate content detection (cross-page)
 * - Near-duplicate content detection (cross-page)
 *
 * Note: Author info and freshness rules moved to E-E-A-T category
 */

import { registerRule } from '../registry';

import { wordCountRule } from './word-count';
import { readingLevelRule } from './reading-level';
import { keywordStuffingRule } from './keyword-stuffing';
import { articleLinksRule } from './article-links';
import { brokenHtmlRule } from './broken-html';
import { metaInBodyRule } from './meta-in-body';
import { mimeTypeRule } from './mime-type';
import {
  duplicateDescriptionRule,
  resetDescriptionRegistry,
  getDescriptionRegistryStats,
} from './duplicate-description';

// Heading rules (moved from headings category)
import { hierarchyRule } from './heading-hierarchy';
import { contentLengthRule } from './heading-length';
import { contentUniqueRule } from './heading-unique';

// New content rules
import { textHtmlRatioRule } from './text-html-ratio';
import { titleSameAsH1Rule } from './title-same-as-h1';
import { titlePixelWidthRule } from './title-pixel-width';
import { descriptionPixelWidthRule } from './description-pixel-width';
import {
  duplicateExactRule,
  resetDuplicateContentRegistry,
} from './duplicate-exact';
import {
  duplicateNearRule,
  resetNearDuplicateRegistry,
} from './duplicate-near';

// Export all rules
export {
  wordCountRule,
  readingLevelRule,
  keywordStuffingRule,
  articleLinksRule,
  brokenHtmlRule,
  metaInBodyRule,
  mimeTypeRule,
  duplicateDescriptionRule,
  // Heading rules
  hierarchyRule,
  contentLengthRule,
  contentUniqueRule,
  // New content rules
  textHtmlRatioRule,
  titleSameAsH1Rule,
  titlePixelWidthRule,
  descriptionPixelWidthRule,
  duplicateExactRule,
  duplicateNearRule,
};

// Export utility functions for duplicate description tracking
export { resetDescriptionRegistry, getDescriptionRegistryStats };

// Export reset functions for cross-page duplicate detection
export { resetDuplicateContentRegistry, resetNearDuplicateRegistry };

// Register all rules
registerRule(wordCountRule);
registerRule(readingLevelRule);
registerRule(keywordStuffingRule);
registerRule(articleLinksRule);
registerRule(brokenHtmlRule);
registerRule(metaInBodyRule);
registerRule(mimeTypeRule);
registerRule(duplicateDescriptionRule);
registerRule(hierarchyRule);
registerRule(contentLengthRule);
registerRule(contentUniqueRule);
registerRule(textHtmlRatioRule);
registerRule(titleSameAsH1Rule);
registerRule(titlePixelWidthRule);
registerRule(descriptionPixelWidthRule);
registerRule(duplicateExactRule);
registerRule(duplicateNearRule);
