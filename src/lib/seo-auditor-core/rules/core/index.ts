/**
 * Core Rules
 *
 * This module exports all core SEO audit rules and registers them.
 * Includes:
 * - Meta tags (title, description, canonical, viewport, favicon)
 * - H1 heading checks
 * - Indexing directives (robots meta, nosnippet)
 * - Canonical header validation
 * - Canonical conflict, protocol, loop, and homepage checks
 * - Title uniqueness
 */

import { registerRule } from '../registry';

// Meta tags rules
import { titlePresentRule } from './title-present';
import { titleLengthRule } from './title-length';
import { descriptionPresentRule } from './description-present';
import { descriptionLengthRule } from './description-length';
import { canonicalPresentRule } from './canonical-present';
import { canonicalValidRule } from './canonical-valid';
import { viewportPresentRule } from './viewport-present';
import { faviconPresentRule } from './favicon-present';

// H1 rules
import { h1PresentRule } from './h1-present';
import { h1SingleRule } from './h1-single';

// Core SEO rules
import { canonicalHeaderRule } from './canonical-header';
import { nosnippetRule } from './nosnippet';
import { robotsMetaRule } from './robots-meta';
import { titleUniqueRule, resetTitleRegistry, getTitleRegistryStats } from './title-unique';

// Canonical validation rules
import { canonicalConflictingRule } from './canonical-conflicting';
import { canonicalToHomepageRule } from './canonical-to-homepage';
import { canonicalHttpMismatchRule } from './canonical-http-mismatch';
import { canonicalLoopRule } from './canonical-loop';
import { canonicalToNoindexRule } from './canonical-to-noindex';

// Export all rules
export {
  // Meta tags
  titlePresentRule,
  titleLengthRule,
  descriptionPresentRule,
  descriptionLengthRule,
  canonicalPresentRule,
  canonicalValidRule,
  viewportPresentRule,
  faviconPresentRule,
  // H1
  h1PresentRule,
  h1SingleRule,
  // Core SEO
  canonicalHeaderRule,
  nosnippetRule,
  robotsMetaRule,
  titleUniqueRule,
  // Canonical validation
  canonicalConflictingRule,
  canonicalToHomepageRule,
  canonicalHttpMismatchRule,
  canonicalLoopRule,
  canonicalToNoindexRule,
};

// Export utility functions
export { resetTitleRegistry, getTitleRegistryStats };

// Register all rules
registerRule(titlePresentRule);
registerRule(titleLengthRule);
registerRule(descriptionPresentRule);
registerRule(descriptionLengthRule);
registerRule(canonicalPresentRule);
registerRule(canonicalValidRule);
registerRule(viewportPresentRule);
registerRule(faviconPresentRule);
registerRule(h1PresentRule);
registerRule(h1SingleRule);
registerRule(canonicalHeaderRule);
registerRule(nosnippetRule);
registerRule(robotsMetaRule);
registerRule(titleUniqueRule);
registerRule(canonicalConflictingRule);
registerRule(canonicalToHomepageRule);
registerRule(canonicalHttpMismatchRule);
registerRule(canonicalLoopRule);
registerRule(canonicalToNoindexRule);
