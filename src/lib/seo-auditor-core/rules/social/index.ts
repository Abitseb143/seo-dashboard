/**
 * Social Rules
 *
 * This module exports all social/Open Graph related audit rules and registers them.
 */

import { registerRule } from '../registry';

import { ogTitleRule } from './og-title';
import { ogDescriptionRule } from './og-description';
import { ogImageRule } from './og-image';
import { ogImageSizeRule } from './og-image-size';
import { twitterCardRule } from './twitter-card';
import { ogUrlRule } from './og-url';
import { ogUrlCanonicalRule } from './og-url-canonical';
import { shareButtonsRule } from './share-buttons';
import { socialProfilesRule } from './social-profiles';

// Export all rules
export {
  ogTitleRule,
  ogDescriptionRule,
  ogImageRule,
  ogImageSizeRule,
  twitterCardRule,
  ogUrlRule,
  ogUrlCanonicalRule,
  shareButtonsRule,
  socialProfilesRule,
};

// Register all rules
registerRule(ogTitleRule);
registerRule(ogDescriptionRule);
registerRule(ogImageRule);
registerRule(ogImageSizeRule);
registerRule(twitterCardRule);
registerRule(ogUrlRule);
registerRule(ogUrlCanonicalRule);
registerRule(shareButtonsRule);
registerRule(socialProfilesRule);
