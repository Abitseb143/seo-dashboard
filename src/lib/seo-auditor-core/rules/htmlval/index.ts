/**
 * HTML Validation Rules
 *
 * This module exports all HTML validation audit rules and registers them.
 * Includes:
 * - DOCTYPE declaration
 * - Charset declaration
 * - Invalid elements in head
 * - Noscript content validation in head
 * - Multiple head elements
 * - Document size limits
 * - Placeholder text detection
 * - Multiple title elements
 * - Multiple meta description elements
 */

import { registerRule } from '../registry';

import { missingDoctypeRule } from './missing-doctype';
import { missingCharsetRule } from './missing-charset';
import { invalidHeadRule } from './invalid-head';
import { noscriptInHeadRule } from './noscript-in-head';
import { multipleHeadsRule } from './multiple-heads';
import { sizeLimitRule } from './size-limit';
import { loremIpsumRule } from './lorem-ipsum';
import { multipleTitlesRule } from './multiple-titles';
import { multipleDescriptionsRule } from './multiple-descriptions';

// Export all rules
export {
  missingDoctypeRule,
  missingCharsetRule,
  invalidHeadRule,
  noscriptInHeadRule,
  multipleHeadsRule,
  sizeLimitRule,
  loremIpsumRule,
  multipleTitlesRule,
  multipleDescriptionsRule,
};

// Register all rules
registerRule(missingDoctypeRule);
registerRule(missingCharsetRule);
registerRule(invalidHeadRule);
registerRule(noscriptInHeadRule);
registerRule(multipleHeadsRule);
registerRule(sizeLimitRule);
registerRule(loremIpsumRule);
registerRule(multipleTitlesRule);
registerRule(multipleDescriptionsRule);
