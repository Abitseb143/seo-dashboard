/**
 * Rule infrastructure exports
 */

// Rule definition helpers
export { defineRule, pass, warn, fail } from './define-rule';

// Rule registry
export {
  registerRule,
  getAllRules,
  getRulesByCategory,
  getRuleById,
  clearRegistry,
  getRuleCount,
} from './registry';

// Rule loader
export { loadAllRules, CATEGORY_MODULES } from './loader';

// Pattern matcher for enable/disable rules
export {
  matchesPattern,
  matchesAnyPattern,
  isRuleEnabled,
  filterRules,
  getRuleCategory,
} from './pattern-matcher';
