/**
 * Security Rules
 *
 * This module exports all security audit rules and registers them.
 * Covers HTTPS, security headers, mixed content, leaked secrets,
 * password safety, protocol-relative URLs, and SSL/TLS configuration.
 */

import { registerRule } from '../registry';

import { httpsRule } from './https';
import { httpsRedirectRule } from './https-redirect';
import { hstsRule } from './hsts';
import { cspRule } from './csp';
import { xFrameRule } from './x-frame';
import { xContentTypeRule } from './x-content-type';
import { externalLinksSecurityRule } from './external-links';
import { formHttpsRule } from './form-https';
import { mixedContentRule } from './mixed-content';
import { permissionsPolicyRule } from './permissions-policy';
import { referrerPolicyRule } from './referrer-policy';
import { leakedSecretsRule } from './leaked-secrets';

// New security rules
import { passwordHttpRule } from './password-http';
import { protocolRelativeRule } from './protocol-relative';
import { sslExpiryRule } from './ssl-expiry';
import { sslProtocolRule } from './ssl-protocol';

// Export all rules
export {
  httpsRule,
  httpsRedirectRule,
  hstsRule,
  cspRule,
  xFrameRule,
  xContentTypeRule,
  externalLinksSecurityRule,
  formHttpsRule,
  mixedContentRule,
  permissionsPolicyRule,
  referrerPolicyRule,
  leakedSecretsRule,
  passwordHttpRule,
  protocolRelativeRule,
  sslExpiryRule,
  sslProtocolRule,
};

// Register all rules
registerRule(httpsRule);
registerRule(httpsRedirectRule);
registerRule(hstsRule);
registerRule(cspRule);
registerRule(xFrameRule);
registerRule(xContentTypeRule);
registerRule(externalLinksSecurityRule);
registerRule(formHttpsRule);
registerRule(mixedContentRule);
registerRule(permissionsPolicyRule);
registerRule(referrerPolicyRule);
registerRule(leakedSecretsRule);
registerRule(passwordHttpRule);
registerRule(protocolRelativeRule);
registerRule(sslExpiryRule);
registerRule(sslProtocolRule);
