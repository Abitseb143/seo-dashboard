/**
 * Technical SEO Rules
 *
 * This module exports all technical SEO audit rules and registers them.
 */

import { registerRule } from '../registry';

import { robotsTxtExistsRule } from './robots-txt-exists';
import { robotsTxtValidRule } from './robots-txt-valid';
import { sitemapExistsRule } from './sitemap-exists';
import { sitemapValidRule } from './sitemap-valid';
import { urlStructureRule } from './url-structure';
import { trailingSlashRule } from './trailing-slash';
import { wwwRedirectRule } from './www-redirect';
import { fourOhFourPageRule } from './404-page';
import { soft404Rule } from './soft-404';
import { serverErrorRule } from './server-error';
import { fourXxNon404Rule } from './4xx-non-404';
import { timeoutRule } from './timeout';
import { badContentTypeRule } from './bad-content-type';

// Export all rules
export {
  robotsTxtExistsRule,
  robotsTxtValidRule,
  sitemapExistsRule,
  sitemapValidRule,
  urlStructureRule,
  trailingSlashRule,
  wwwRedirectRule,
  fourOhFourPageRule,
  soft404Rule,
  serverErrorRule,
  fourXxNon404Rule,
  timeoutRule,
  badContentTypeRule,
};

// Register all rules
registerRule(robotsTxtExistsRule);
registerRule(robotsTxtValidRule);
registerRule(sitemapExistsRule);
registerRule(sitemapValidRule);
registerRule(urlStructureRule);
registerRule(trailingSlashRule);
registerRule(wwwRedirectRule);
registerRule(fourOhFourPageRule);
registerRule(soft404Rule);
registerRule(serverErrorRule);
registerRule(fourXxNon404Rule);
registerRule(timeoutRule);
registerRule(badContentTypeRule);
