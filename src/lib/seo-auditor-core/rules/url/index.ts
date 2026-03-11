/**
 * URL Structure Rules
 *
 * This module exports all URL structure audit rules and registers them.
 * These rules check URL formatting, keywords, and stop words for SEO optimization.
 */

import { registerRule } from '../registry';

import { slugKeywordsRule } from './slug-keywords';
import { stopWordsRule } from './stop-words';
import { uppercaseRule } from './uppercase';
import { underscoresRule } from './underscores';
import { doubleSlashRule } from './double-slash';
import { spacesRule } from './spaces';
import { nonAsciiRule } from './non-ascii';
import { lengthRule } from './length';
import { repetitivePathRule } from './repetitive-path';
import { parametersRule } from './parameters';
import { sessionIdsRule } from './session-ids';
import { trackingParamsRule } from './tracking-params';
import { internalSearchRule } from './internal-search';
import { httpHttpsDuplicateRule } from './http-https-duplicate';

// Export all rules
export {
  slugKeywordsRule,
  stopWordsRule,
  uppercaseRule,
  underscoresRule,
  doubleSlashRule,
  spacesRule,
  nonAsciiRule,
  lengthRule,
  repetitivePathRule,
  parametersRule,
  sessionIdsRule,
  trackingParamsRule,
  internalSearchRule,
  httpHttpsDuplicateRule,
};

// Register all rules
registerRule(slugKeywordsRule);
registerRule(stopWordsRule);
registerRule(uppercaseRule);
registerRule(underscoresRule);
registerRule(doubleSlashRule);
registerRule(spacesRule);
registerRule(nonAsciiRule);
registerRule(lengthRule);
registerRule(repetitivePathRule);
registerRule(parametersRule);
registerRule(sessionIdsRule);
registerRule(trackingParamsRule);
registerRule(internalSearchRule);
registerRule(httpHttpsDuplicateRule);
