/**
 * Accessibility (A11y) Rules
 *
 * This module exports all accessibility audit rules and registers them.
 * Covers WCAG guidelines for users with disabilities.
 */

import { registerRule } from '../registry';

import { ariaLabelsRule } from './aria-labels';
import { colorContrastRule } from './color-contrast';
import { focusVisibleRule } from './focus-visible';
import { formLabelsRule } from './form-labels';
import { headingOrderRule } from './heading-order';
import { landmarkRegionsRule } from './landmark-regions';
import { linkTextRule } from './link-text';
import { skipLinkRule } from './skip-link';
import { tableHeadersRule } from './table-headers';
import { touchTargetsRule } from './touch-targets';
import { videoCaptionsRule } from './video-captions';
import { zoomDisabledRule } from './zoom-disabled';

// Export all rules
export {
  ariaLabelsRule,
  colorContrastRule,
  focusVisibleRule,
  formLabelsRule,
  headingOrderRule,
  landmarkRegionsRule,
  linkTextRule,
  skipLinkRule,
  tableHeadersRule,
  touchTargetsRule,
  videoCaptionsRule,
  zoomDisabledRule,
};

// Register all rules
registerRule(ariaLabelsRule);
registerRule(colorContrastRule);
registerRule(focusVisibleRule);
registerRule(formLabelsRule);
registerRule(headingOrderRule);
registerRule(landmarkRegionsRule);
registerRule(linkTextRule);
registerRule(skipLinkRule);
registerRule(tableHeadersRule);
registerRule(touchTargetsRule);
registerRule(videoCaptionsRule);
registerRule(zoomDisabledRule);
