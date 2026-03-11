/**
 * Redirect Rules
 *
 * This module exports all redirect audit rules and registers them.
 * Includes:
 * - Meta refresh redirect detection
 * - JavaScript redirect detection
 * - HTTP Refresh header detection
 * - Redirect loop detection
 * - Redirect type validation (permanent vs temporary)
 * - Broken redirect detection
 * - HTTP resource redirect detection on HTTPS pages
 * - URL case normalization checks
 */

import { registerRule } from '../registry';

// Redirect rules
import { metaRefreshRule } from './meta-refresh';
import { javascriptRedirectRule } from './javascript';
import { httpRefreshRule } from './http-refresh';
import { redirectLoopRule } from './loop';
import { redirectTypeRule } from './type';
import { brokenRedirectRule } from './broken';
import { resourceRedirectRule } from './resource';
import { caseNormalizationRule } from './case-normalization';

// Export all rules
export {
  metaRefreshRule,
  javascriptRedirectRule,
  httpRefreshRule,
  redirectLoopRule,
  redirectTypeRule,
  brokenRedirectRule,
  resourceRedirectRule,
  caseNormalizationRule,
};

// Register all rules
registerRule(metaRefreshRule);
registerRule(javascriptRedirectRule);
registerRule(httpRefreshRule);
registerRule(redirectLoopRule);
registerRule(redirectTypeRule);
registerRule(brokenRedirectRule);
registerRule(resourceRedirectRule);
registerRule(caseNormalizationRule);
