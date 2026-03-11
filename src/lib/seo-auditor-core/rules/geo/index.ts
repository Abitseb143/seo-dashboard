/**
 * GEO (Generative Engine Optimization) Rules
 *
 * This module exports all AI/GEO readiness audit rules and registers them.
 * These rules evaluate how well a page is prepared for consumption by
 * AI systems, generative search engines, and large language models.
 *
 * Includes:
 * - Semantic HTML structure for AI comprehension
 * - Content structure for reliable extraction
 * - AI bot access (robots.txt analysis)
 * - llms.txt reference (emerging standard)
 * - Schema-to-content drift detection
 */

import { registerRule } from '../registry';

import { semanticHtmlRule } from './semantic-html';
import { contentStructureRule } from './content-structure';
import { aiBotAccessRule } from './ai-bot-access';
import { llmsTxtRule } from './llms-txt';
import { schemaDriftRule } from './schema-drift';

// Export all rules
export {
  semanticHtmlRule,
  contentStructureRule,
  aiBotAccessRule,
  llmsTxtRule,
  schemaDriftRule,
};

// Register all rules
registerRule(semanticHtmlRule);
registerRule(contentStructureRule);
registerRule(aiBotAccessRule);
registerRule(llmsTxtRule);
registerRule(schemaDriftRule);
