/**
 * Performance Rules
 *
 * This module exports all performance audit rules and registers them.
 * Includes:
 * - Core Web Vitals (LCP, CLS, INP, FCP, TTFB)
 * - Static performance hints (DOM size, CSS, fonts, preconnect, render-blocking)
 * - Compression (text compression, Brotli)
 * - Caching (cache policy)
 * - Minification (inline CSS, inline JS)
 * - Network (response time, HTTP/2+)
 * - Page weight (HTML size, inline JS size)
 * - Media (video for animations)
 */

import { registerRule } from '../registry';

// Core Web Vitals
import { lcpRule } from './lcp';
import { clsRule } from './cls';
import { inpRule } from './inp';
import { ttfbRule } from './ttfb';
import { fcpRule } from './fcp';

// Performance hints
import { domSizeRule } from './dom-size';
import { cssFileSizeRule } from './css-file-size';
import { fontLoadingRule } from './font-loading';
import { preconnectRule } from './preconnect';
import { renderBlockingRule } from './render-blocking';
import { lazyAboveFoldRule } from './lazy-above-fold';
import { lcpHintsRule } from './lcp-hints';

// Compression
import { textCompressionRule } from './text-compression';
import { brotliRule } from './brotli';

// Caching
import { cachePolicyRule } from './cache-policy';

// Minification
import { minifyCssRule } from './minify-css';
import { minifyJsRule } from './minify-js';

// Network
import { responseTimeRule } from './response-time';
import { http2Rule } from './http2';

// Page weight
import { pageWeightRule } from './page-weight';
import { jsFileSizeRule } from './js-file-size';

// Media
import { videoForAnimationsRule } from './video-for-animations';

// Export all rules
export {
  // Core Web Vitals
  lcpRule,
  clsRule,
  inpRule,
  ttfbRule,
  fcpRule,
  // Performance hints
  domSizeRule,
  cssFileSizeRule,
  fontLoadingRule,
  preconnectRule,
  renderBlockingRule,
  lazyAboveFoldRule,
  lcpHintsRule,
  // Compression
  textCompressionRule,
  brotliRule,
  // Caching
  cachePolicyRule,
  // Minification
  minifyCssRule,
  minifyJsRule,
  // Network
  responseTimeRule,
  http2Rule,
  // Page weight
  pageWeightRule,
  jsFileSizeRule,
  // Media
  videoForAnimationsRule,
};

// Register all rules
registerRule(lcpRule);
registerRule(clsRule);
registerRule(inpRule);
registerRule(ttfbRule);
registerRule(fcpRule);
registerRule(domSizeRule);
registerRule(cssFileSizeRule);
registerRule(fontLoadingRule);
registerRule(preconnectRule);
registerRule(renderBlockingRule);
registerRule(lazyAboveFoldRule);
registerRule(lcpHintsRule);
registerRule(textCompressionRule);
registerRule(brotliRule);
registerRule(cachePolicyRule);
registerRule(minifyCssRule);
registerRule(minifyJsRule);
registerRule(responseTimeRule);
registerRule(http2Rule);
registerRule(pageWeightRule);
registerRule(jsFileSizeRule);
registerRule(videoForAnimationsRule);
