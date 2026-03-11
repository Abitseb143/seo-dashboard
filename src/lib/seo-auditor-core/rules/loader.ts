// Static imports for all rule categories
// These modules self-register their rules when imported
import '../rules/core/index';
import '../rules/technical/index';
import '../rules/perf/index';
import '../rules/links/index';
import '../rules/images/index';
import '../rules/security/index';
import '../rules/schema/index';
import '../rules/social/index';
import '../rules/content/index';
import '../rules/a11y/index';
import '../rules/i18n/index';
import '../rules/crawl/index';
import '../rules/url/index';
import '../rules/mobile/index';
import '../rules/legal/index';
import '../rules/eeat/index';
import '../rules/redirect/index';
import '../rules/geo/index';
import '../rules/htmlval/index';
import '../rules/js/index';

let rulesLoaded = false;

/**
 * Ensures all rule category modules are loaded
 * With static imports, rules are loaded at module initialization
 * This function exists for API compatibility
 * @returns Promise that resolves immediately (rules already loaded)
 */
export async function loadAllRules(): Promise<void> {
  // Rules are loaded via static imports above
  // This function ensures idempotent behavior
  if (rulesLoaded) {
    return;
  }
  rulesLoaded = true;
}

/**
 * List of all rule category names
 * Useful for debugging or introspection
 */
export const CATEGORY_MODULES = [
  'core',
  'technical',
  'perf',
  'links',
  'images',
  'security',
  'schema',
  'social',
  'content',
  'a11y',
  'i18n',
  'crawl',
  'url',
  'mobile',
  'legal',
  'eeat',
  'redirect',
  'geo',
  'htmlval',
  'js',
] as const;
