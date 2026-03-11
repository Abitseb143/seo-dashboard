/**
 * Schema Rules (Structured Data)
 *
 * This module exports all structured data audit rules and registers them.
 * Covers JSON-LD validation, type checking, and required field verification.
 */

import { registerRule } from '../registry';

import { structuredDataPresentRule } from './present';
import { structuredDataValidRule } from './valid';
import { structuredDataTypeRule } from './type';
import { structuredDataRequiredFieldsRule } from './required-fields';
import { structuredDataArticleRule } from './article';
import { structuredDataBreadcrumbRule } from './breadcrumb';
import { structuredDataFaqRule } from './faq';
import { structuredDataLocalBusinessRule } from './local-business';
import { structuredDataOrganizationRule } from './organization';
import { structuredDataProductRule } from './product';
import { structuredDataReviewRule } from './review';
import { structuredDataVideoRule } from './video';
import { structuredDataWebsiteSearchRule } from './website-search';

// Export all rules
export {
  structuredDataPresentRule,
  structuredDataValidRule,
  structuredDataTypeRule,
  structuredDataRequiredFieldsRule,
  structuredDataArticleRule,
  structuredDataBreadcrumbRule,
  structuredDataFaqRule,
  structuredDataLocalBusinessRule,
  structuredDataOrganizationRule,
  structuredDataProductRule,
  structuredDataReviewRule,
  structuredDataVideoRule,
  structuredDataWebsiteSearchRule,
};

// Register all rules
registerRule(structuredDataPresentRule);
registerRule(structuredDataValidRule);
registerRule(structuredDataTypeRule);
registerRule(structuredDataRequiredFieldsRule);
registerRule(structuredDataArticleRule);
registerRule(structuredDataBreadcrumbRule);
registerRule(structuredDataFaqRule);
registerRule(structuredDataLocalBusinessRule);
registerRule(structuredDataOrganizationRule);
registerRule(structuredDataProductRule);
registerRule(structuredDataReviewRule);
registerRule(structuredDataVideoRule);
registerRule(structuredDataWebsiteSearchRule);
