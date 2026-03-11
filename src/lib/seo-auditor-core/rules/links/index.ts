/**
 * Links Rules
 *
 * This module exports all links related audit rules and registers them.
 */

import { registerRule } from '../registry';

import { brokenInternalRule } from './broken-internal';
import { externalValidRule } from './external-valid';
import { internalPresentRule } from './internal-present';
import { nofollowAppropriateRule } from './nofollow-appropriate';
import { anchorTextRule } from './anchor-text';
import { depthRule } from './depth';
import { deadEndPagesRule } from './dead-end-pages';
import { httpsDowngradeRule } from './https-downgrade';
import { externalCountRule } from './external-count';
import { invalidLinksRule } from './invalid-links';
import { telMailtoRule } from './tel-mailto';
import { redirectChainsRule } from './redirect-chains';
import { orphanPagesRule } from './orphan-pages';
import { localhostRule } from './localhost';
import { localFileRule } from './local-file';
import { brokenFragmentRule } from './broken-fragment';
import { excessiveRule } from './excessive';
import { onclickRule } from './onclick';
import { whitespaceHrefRule } from './whitespace-href';

// Export all rules
export {
  brokenInternalRule,
  externalValidRule,
  internalPresentRule,
  nofollowAppropriateRule,
  anchorTextRule,
  depthRule,
  deadEndPagesRule,
  httpsDowngradeRule,
  externalCountRule,
  invalidLinksRule,
  telMailtoRule,
  redirectChainsRule,
  orphanPagesRule,
  localhostRule,
  localFileRule,
  brokenFragmentRule,
  excessiveRule,
  onclickRule,
  whitespaceHrefRule,
};

// Register all rules
registerRule(brokenInternalRule);
registerRule(externalValidRule);
registerRule(internalPresentRule);
registerRule(nofollowAppropriateRule);
registerRule(anchorTextRule);
registerRule(depthRule);
registerRule(deadEndPagesRule);
registerRule(httpsDowngradeRule);
registerRule(externalCountRule);
registerRule(invalidLinksRule);
registerRule(telMailtoRule);
registerRule(redirectChainsRule);
registerRule(orphanPagesRule);
registerRule(localhostRule);
registerRule(localFileRule);
registerRule(brokenFragmentRule);
registerRule(excessiveRule);
registerRule(onclickRule);
registerRule(whitespaceHrefRule);
