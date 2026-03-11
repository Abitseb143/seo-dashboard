/**
 * Internationalization (i18n) Rules
 *
 * This module exports all internationalization audit rules and registers them.
 * Covers language declarations, hreflang validation, and multi-region support.
 */

import { registerRule } from '../registry';

import { langAttributeRule } from './lang-attribute';
import { hreflangRule } from './hreflang';
import { hreflangReturnLinksRule } from './hreflang-return-links';
import { hreflangToNoindexRule } from './hreflang-to-noindex';
import { hreflangToNonCanonicalRule } from './hreflang-to-non-canonical';
import { hreflangToBrokenRule } from './hreflang-to-broken';
import { hreflangToRedirectRule } from './hreflang-to-redirect';
import { hreflangConflictingRule } from './hreflang-conflicting';
import { hreflangLangMismatchRule } from './hreflang-lang-mismatch';
import { hreflangMultipleMethodsRule } from './hreflang-multiple-methods';

// Export all rules
export {
  langAttributeRule,
  hreflangRule,
  hreflangReturnLinksRule,
  hreflangToNoindexRule,
  hreflangToNonCanonicalRule,
  hreflangToBrokenRule,
  hreflangToRedirectRule,
  hreflangConflictingRule,
  hreflangLangMismatchRule,
  hreflangMultipleMethodsRule,
};

// Register all rules
registerRule(langAttributeRule);
registerRule(hreflangRule);
registerRule(hreflangReturnLinksRule);
registerRule(hreflangToNoindexRule);
registerRule(hreflangToNonCanonicalRule);
registerRule(hreflangToBrokenRule);
registerRule(hreflangToRedirectRule);
registerRule(hreflangConflictingRule);
registerRule(hreflangLangMismatchRule);
registerRule(hreflangMultipleMethodsRule);
