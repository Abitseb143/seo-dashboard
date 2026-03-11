/**
 * Crawlability Rules
 *
 * This module exports all crawlability audit rules and registers them.
 * These rules check for robots.txt conflicts, sitemap issues,
 * indexability signal conflicts, pagination problems, and resource
 * blocking issues.
 */

import { registerRule } from '../registry';

// Existing rules
import { schemaNoindexConflictRule } from './schema-noindex-conflict';
import { paginationCanonicalRule } from './pagination-canonical';
import { sitemapDomainRule } from './sitemap-domain';
import { noindexInSitemapRule } from './noindex-in-sitemap';
import { indexabilityConflictRule } from './indexability-conflict';
import { canonicalRedirectRule } from './canonical-redirect';

// Sitemap rules
import { sitemapUrlLimitRule } from './sitemap-url-limit';
import { sitemapSizeLimitRule } from './sitemap-size-limit';
import { sitemapDuplicateUrlsRule } from './sitemap-duplicate-urls';
import { sitemapOrphanUrlsRule, resetOrphanRegistry, getOrphanStats } from './sitemap-orphan-urls';

// Robots.txt rules
import { blockedResourcesRule } from './blocked-resources';
import { crawlDelayRule } from './crawl-delay';
import { sitemapInRobotstxtRule } from './sitemap-in-robotstxt';

// Pagination rules
import { paginationBrokenRule } from './pagination-broken';
import { paginationLoopRule } from './pagination-loop';
import { paginationSequenceRule } from './pagination-sequence';
import { paginationNoindexRule } from './pagination-noindex';
import { paginationOrphanedRule } from './pagination-orphaned';

// Export all rules
export {
  // Existing rules
  schemaNoindexConflictRule,
  paginationCanonicalRule,
  sitemapDomainRule,
  noindexInSitemapRule,
  indexabilityConflictRule,
  canonicalRedirectRule,

  // Sitemap rules
  sitemapUrlLimitRule,
  sitemapSizeLimitRule,
  sitemapDuplicateUrlsRule,
  sitemapOrphanUrlsRule,

  // Robots.txt rules
  blockedResourcesRule,
  crawlDelayRule,
  sitemapInRobotstxtRule,

  // Pagination rules
  paginationBrokenRule,
  paginationLoopRule,
  paginationSequenceRule,
  paginationNoindexRule,
  paginationOrphanedRule,
};

// Export orphan registry utilities for testing and cross-page analysis
export { resetOrphanRegistry, getOrphanStats };

// Register all rules

// Existing rules
registerRule(schemaNoindexConflictRule);
registerRule(paginationCanonicalRule);
registerRule(sitemapDomainRule);
registerRule(noindexInSitemapRule);
registerRule(indexabilityConflictRule);
registerRule(canonicalRedirectRule);

// Sitemap rules
registerRule(sitemapUrlLimitRule);
registerRule(sitemapSizeLimitRule);
registerRule(sitemapDuplicateUrlsRule);
registerRule(sitemapOrphanUrlsRule);

// Robots.txt rules
registerRule(blockedResourcesRule);
registerRule(crawlDelayRule);
registerRule(sitemapInRobotstxtRule);

// Pagination rules
registerRule(paginationBrokenRule);
registerRule(paginationLoopRule);
registerRule(paginationSequenceRule);
registerRule(paginationNoindexRule);
registerRule(paginationOrphanedRule);
