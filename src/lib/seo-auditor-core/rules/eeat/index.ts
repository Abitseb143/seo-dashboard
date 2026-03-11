/**
 * E-E-A-T (Experience, Expertise, Authority, Trust) Rules
 *
 * This module exports all E-E-A-T audit rules and registers them.
 * - About page presence
 * - Affiliate disclosure
 * - Author bylines
 * - Author expertise indicators
 * - Citations to authoritative sources
 * - Contact page with methods
 * - Content dates (published/modified)
 * - Disclaimers for YMYL content
 * - Editorial policy
 * - Physical address
 * - Privacy policy
 * - Terms of service
 * - Trust signals (badges, reviews, certifications)
 * - YMYL content detection
 */

import { registerRule } from '../registry';

import { aboutPageRule } from './about-page';
import { affiliateDisclosureRule } from './affiliate-disclosure';
import { authorBylineRule } from './author-byline';
import { authorExpertiseRule } from './author-expertise';
import { citationsRule } from './citations';
import { contactPageRule } from './contact-page';
import { contentDatesRule } from './content-dates';
import { disclaimersRule } from './disclaimers';
import { editorialPolicyRule } from './editorial-policy';
import { physicalAddressRule } from './physical-address';
import { privacyPolicyRule } from './privacy-policy';
import { termsOfServiceRule } from './terms-of-service';
import { trustSignalsRule } from './trust-signals';
import { ymylDetectionRule, detectYMYL, YMYL_CATEGORIES } from './ymyl-detection';

// Export all rules
export {
  aboutPageRule,
  affiliateDisclosureRule,
  authorBylineRule,
  authorExpertiseRule,
  citationsRule,
  contactPageRule,
  contentDatesRule,
  disclaimersRule,
  editorialPolicyRule,
  physicalAddressRule,
  privacyPolicyRule,
  termsOfServiceRule,
  trustSignalsRule,
  ymylDetectionRule,
};

// Export YMYL detection utility for use by other rules
export { detectYMYL, YMYL_CATEGORIES };
export type { YMYLDetectionResult } from './ymyl-detection';

// Register all rules
registerRule(aboutPageRule);
registerRule(affiliateDisclosureRule);
registerRule(authorBylineRule);
registerRule(authorExpertiseRule);
registerRule(citationsRule);
registerRule(contactPageRule);
registerRule(contentDatesRule);
registerRule(disclaimersRule);
registerRule(editorialPolicyRule);
registerRule(physicalAddressRule);
registerRule(privacyPolicyRule);
registerRule(termsOfServiceRule);
registerRule(trustSignalsRule);
registerRule(ymylDetectionRule);
