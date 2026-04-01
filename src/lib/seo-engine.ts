import { Auditor } from "./seo-auditor-core/auditor";
import type { RuleResult, CategoryResult } from "./seo-auditor-core/types";

export interface SEOIssueData {
    category: string;
    severity: "critical" | "high" | "medium" | "low";
    issueTitle: string;
    problemSummary: string;
    whyItMatters: string;
    currentState: string;
    pageUrl?: string;
    recommendedAction: string;
    bestFixOption: string;
    alternativeFixOptions?: string;
    expectedSEOImpact: number;
    implementationDifficulty: number;
    estimatedEffort: string;
    codeExample?: string;
    cmsInstruction?: string;
    confidenceLevel: number;
    auditSource?: 'static' | 'rendered' | 'api';
    nextBestAction?: string;
    htmlState?: string;     // Value in raw HTML
    renderedState?: string; // Value after JS execution
    isComparison?: boolean; // Whether to show comparison UI
    fixLabel?: string;      // Custom label for the fix section
}

/**
 * Maps a CLI RuleResult status to a dashboard severity level.
 * Rules with score 0 (fail) and high category weight = critical.
 */
function mapSeverity(result: RuleResult, categoryWeight: number): SEOIssueData["severity"] {
    if (result.status === "fail") {
        return categoryWeight >= 20 ? "critical" : categoryWeight >= 10 ? "high" : "medium";
    }
    if (result.status === "warn") {
        return categoryWeight >= 15 ? "high" : "medium";
    }
    return "low";
}

/**
 * Estimate SEO impact points from a rule result (0–10 scale)
 */
function estimateImpact(result: RuleResult, categoryWeight: number): number {
    const base = result.status === "fail" ? 1.0 : result.status === "warn" ? 0.5 : 0;
    return Math.min(10, Math.round(base * (categoryWeight / 10) * 10));
}

/**
 * Estimate implementation difficulty from the rule category and details
 */
function estimateDifficulty(categoryId: string): number {
    const easy = ["content", "core"];
    const medium = ["schema", "social", "images", "links", "technical", "geo"];
    const hard = ["perf", "js", "crawl", "redirect", "htmlval"];
    if (easy.includes(categoryId)) return 2;
    if (medium.includes(categoryId)) return 4;
    if (hard.includes(categoryId)) return 7;
    return 4;
}

/**
 * Estimate effort string from difficulty
 */
function estimateEffort(difficulty: number): string {
    if (difficulty <= 2) return "< 30 mins";
    if (difficulty <= 4) return "1-2 hours";
    if (difficulty <= 6) return "Half a day";
    return "1+ days";
}

function extractCurrentState(result: RuleResult, ruleId: string): string {
    const d = result.details as Record<string, unknown> | undefined;
    if (!d) return result.message;

    const snippets: string[] = [];

    // Basic fields
    if (typeof d.title === "string") snippets.push(`Current title: "${d.title}"`);
    if (typeof d.description === "string") snippets.push(`Current description: "${d.description.substring(0, 120)}..."`);
    if (typeof d.characterCount === "number") snippets.push(`Length: ${d.characterCount} characters`);
    if (typeof d.wordCount === "number") snippets.push(`Word count: ${d.wordCount}`);

    // Lazy load specific
    if (ruleId.includes("lazy-above-fold")) {
        const issues = (d.aboveFoldImages as any[]) || [];
        if (issues.length > 0) {
            const lazyImages = issues.filter(i => i.isLazy);
            if (lazyImages.length > 0) {
                snippets.push(`Found ${lazyImages.length} images above the fold with loading="lazy":`);
                lazyImages.slice(0, 3).forEach(i => snippets.push(`  • ${i.src}`));
            } else {
                snippets.push(`Total images found: ${d.totalImages || issues.length}`);
            }
        }
    }

    // Orphan URLs
    if (ruleId.includes("orphan-urls")) {
        const urls = (d.orphanUrls as string[]) || [];
        if (urls.length > 0) {
            snippets.push("Top orphan URLs (not linked internally):");
            urls.slice(0, 5).forEach(u => snippets.push(`  • ${u}`));
        }
    }

    // Page weight
    if (ruleId.includes("page-weight")) {
        if (typeof d.totalSizeBytes === "number") snippets.push(`Total page size: ${(d.totalSizeBytes / 1024).toFixed(1)} KB`);
        if (typeof d.inlineJsSize === "number") snippets.push(`Inline JS: ${(d.inlineJsSize / 1024).toFixed(1)} KB`);
        if (typeof d.inlineCssSize === "number") snippets.push(`Inline CSS: ${(d.inlineCssSize / 1024).toFixed(1)} KB`);
    }

    // Schema specific
    if (ruleId.includes("schema") || ruleId.includes("structured")) {
        if (Array.isArray(d.missingFields) && d.missingFields.length > 0) {
            snippets.push(`Missing fields: ${d.missingFields.join(", ")}`);
        }
        if (Array.isArray(d.recommendedFields) && d.recommendedFields.length > 0) {
            snippets.push(`Recommended fields missing: ${d.recommendedFields.join(", ")}`);
        }
    }

    // Heading structure fallback
    if (Array.isArray(d.headings) && d.headings.length > 0 && snippets.length === 0) {
        const headings = (d.headings as Array<{ tag: string, text: string }>).slice(0, 3);
        snippets.push("Heading structure:\n" + headings.map(h => `  ${h.tag}: ${h.text}`).join("\n"));
    }

    // External Valid specific
    if (ruleId.includes("external-valid")) {
        const unreachable = (d.unreachableLinks as any[]) || [];
        if (unreachable.length > 0) {
            snippets.push(`Unreachable external URLs (${unreachable.length}):`);
            unreachable.slice(0, 5).forEach(link => snippets.push(`  • ${link.href} (Status: ${link.statusCode})`));
        }
    }

    return snippets.length > 0 ? snippets.join("\n") : result.message;
}

/**
 * Extract a specific value (Title/Desc) from a Cheerio context
 */
function extractFromDom($: any, selector: string, attr?: string): string {
    if (!$) return "❌ missing";
    const el = $(selector);
    if (!el.length) return "❌ missing";
    const val = attr ? el.attr(attr) : el.text();
    return val ? `✅ present ("${val.substring(0, 30)}${val.length > 30 ? '...' : ''}")` : "❌ missing";
}


function getSiteProfile(pageUrl: string, title?: string): {
    siteName: string;
    origin: string;
} {
    try {
        const parsed = new URL(pageUrl);
        const siteName = title?.split("|").pop()?.trim() || parsed.hostname.replace(/^www\./, "");
        return {
            siteName: siteName || "Your Brand",
            origin: parsed.origin,
        };
    } catch {
        return {
            siteName: title?.split("|").pop()?.trim() || "Your Brand",
            origin: "https://example.com",
        };
    }
}

function buildFixSuggestion(result: RuleResult, ruleId: string, auditMode: string = 'static'): string {
    const d = result.details as Record<string, unknown> | undefined;
    const pageUrl = typeof d?.pageUrl === "string" ? d.pageUrl : "https://example.com";
    const title = typeof d?.title === "string" ? d.title : undefined;
    const siteProfile = getSiteProfile(pageUrl, title);

    // 1. Meta Title (Human-Readable Site-Aware Fix)
    if (ruleId.includes("title") && ruleId.includes("length")) {
        const current = typeof d?.title === "string" ? d.title : siteProfile.siteName;
        const brand = current.includes("|") ? current.split("|").pop()?.trim() : siteProfile.siteName;
        let core = current.split("|")[0].trim();
        
        // Human-readable shortening: find last space before 50 chars
        if (core.length > 50) {
            const cutIndex = core.lastIndexOf(" ", 50);
            core = cutIndex > 20 ? core.substring(0, cutIndex) : core.substring(0, 50);
        }
        
        return `<title>${core} | ${brand || siteProfile.siteName}</title>\n<!-- Optimized for readability and branding -->`;
    }

    // 2. Meta Description (Real Fix)
    if (ruleId.includes("description") && !ruleId.includes("duplicate")) {
        return `<meta name="description" content="Explain what ${siteProfile.siteName} offers, include the main keyword naturally, and finish with a clear call to action. Target length: 150-160 characters.">`;
    }

    // 3. Schema (Specific Fixes - FIXED logic)
    if (ruleId.includes("schema") || ruleId.includes("structured")) {
        const missingReq = (d?.missingFields as string[]) || [];
        const missingRec = (d?.recommendedFields as string[]) || [];
        const allMissing = Array.from(new Set([...missingReq, ...missingRec]));

        if (ruleId.includes("local-business")) {
            const addressBlock = missingReq.includes("address") || !result.message.toLowerCase().includes("address")
                ? `\n  "address": {\n    "@type": "PostalAddress",\n    "streetAddress": "YOUR_STREET",\n    "addressLocality": "CITY",\n    "addressRegion": "STATE",\n    "postalCode": "POSTCODE",\n    "addressCountry": "AU"\n  },`
                : "";
            
            return `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "${siteProfile.siteName}",\n  "url": "${siteProfile.origin}",${addressBlock}\n  "image": "${siteProfile.origin}/logo.png"\n}\n</script>\n<!-- Missing fields to add: ${allMissing.join(", ") || "None"} -->`;
        }
        
        if (ruleId.includes("organization")) {
             return `<!-- FIX: Add missing fields: ${allMissing.join(", ")} -->\n"logo": "${siteProfile.origin}/logo.png",\n"sameAs": [\n  "https://www.linkedin.com/company/your-brand",\n  "https://www.facebook.com/your-brand",\n  "https://x.com/your-brand"\n]`;
        }
        return `<!-- Missing fields: ${allMissing.join(", ")} -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "${siteProfile.siteName}",\n  "url": "${siteProfile.origin}"\n}\n</script>`;
    }

    // 4. Performance / CWV (Concrete fixes)
    if (isRenderRequired(ruleId) || ruleId.includes("perf-")) {
        if (auditMode === 'static') {
            return "Measure performance in Rendered mode to get specific code fixes.";
        }
        
        if (ruleId.includes("lazy-above-fold")) {
            return `<!-- FIX: Remove loading="lazy" from the hero image and add fetchpriority="high" -->\n<img \n  src="/path-to-hero-image.jpg" \n  loading="eager" \n  fetchpriority="high" \n  alt="Descriptive Alt Text"\n>`;
        }
        
        if (ruleId.includes("page-weight")) {
            return `<!-- Recommendation: Reduce HTML size by externalizing inline JS/CSS -->\n1. Move large <script> blocks into .js files\n2. Move <style> blocks into .css files\n3. Minify HTML and enable Gzip/Brotli compression`;
        }

        if (ruleId.includes("js-size") || ruleId.includes("resource-size")) {
            return `<!-- Recommendation: Externalize or Defer specific inline scripts -->\n<script src="/scripts/large-bundle.js" defer></script>\n<!-- Avoid large <script> blocks in the head whenever possible -->`;
        }

        return `<!-- Performance FIX: Prioritize LCP and critical resources -->\n<link rel="preload" as="image" href="/hero.webp" imagesrcset="..." fetchpriority="high">`;
    }

    // 5. External Links
    if (ruleId.includes("external-valid")) {
        const unreachable = (d?.unreachableLinks as any[]) || [];
        const list = unreachable.slice(0, 3).map(l => `  • ${l.href}`).join("\n");
        return `<!-- FIX: Update or remove unreachable external links -->\n${list || "  • Check your footer and sidebar for broken external links."}`;
    }

    // 5. Social Profiles
    if (ruleId.includes("profiles")) {
        return `<!-- FIX: Add active social links to your footer and "sameAs" in JSON-LD schema -->\n<footer>\n  <a href="https://linkedin.com/company/your-brand">LinkedIn</a>\n  <a href="https://x.com/your-brand">X</a>\n</footer>`;
    }

    // 6. Share Buttons
    if (ruleId.includes("share-buttons")) {
        return `<!-- Suggestion: Add social share buttons to high-value content pages -->\n<button onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + window.location.href)">Share on LinkedIn</button>`;
    }

    // Generic fallback 
    return (d?.recommendation as string) || "Apply standard SEO best practices to resolve this issue.";
}


/**
 * Format a category ID into a human-readable title
 */
function formatCategoryName(categoryId: string): string {
    return categoryId
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

/**
 * Format a rule ID into a human-readable issue title
 */
function formatRuleTitle(ruleId: string): string {
    return ruleId
        .replace(/^[a-z]+-/, "") // strip category prefix
        .split("-")
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

// Category weight map (Refined for better prioritization)
const CATEGORY_WEIGHTS: Record<string, number> = {
    core: 30,       // Crucial structural (Title, Canonical)
    content: 25,    // Main content depth/keywords
    technical: 20,  // Indexability/Schema
    perf: 15,       // Performance/CWV
    crawler: 12,    // Sitemap/Orphans
    links: 10,      // Internal/External links
    images: 5, schema: 5, security: 5,
    mobile: 5, redirect: 5, url: 3, js: 3, 
    a11y: 2, eeat: 1, social: 1, // Advisory (Lowest priority)
    geo: 1, i18n: 1, legal: 1, htmlval: 1
};

/**
 * Identify if a rule strictly requires a headless browser/rendering
 */
function isRenderRequired(ruleId: string): boolean {
    const renderedRules = ["cwv-lcp", "cwv-cls", "cwv-fcp", "cwv-inp", "js-render-visibility"];
    return renderedRules.some(r => ruleId.includes(r));
}

/**
 * Identify if a rule is purely advisory/enhancement
 */
function isAdvisory(ruleId: string): boolean {
    const advisoryKeywords = ["social", "share-buttons", "profiles", "author-expertise", "reading-level", "favicon"];
    return advisoryKeywords.some(k => ruleId.toLowerCase().includes(k));
}

/**
 * Main audit function — uses the real CLI Auditor class with all 296 rules.
 */
export async function runLiveSEOAudit(url: string): Promise<SEOIssueData[]> {
    const auditor = new Auditor({
        timeout: 30000,
        measureCwv: true, 
    });

    let auditResult;
    try {
        auditResult = await auditor.audit(url);
    } catch (error: any) {
        return [{
            category: "Technical", severity: "critical",
            issueTitle: "💥 Crawl Failed",
            problemSummary: `Could not reach the URL. Error: ${error.message}`,
            whyItMatters: "The auditor could not reach the page. If the bot is blocked, search engine bots might be blocked too.",
            currentState: `Error: ${error.message}`,
            recommendedAction: "Check if the URL is correct and the site is live.",
            bestFixOption: "Ensure your site is accessible and your server isn't blocking the auditor.",
            expectedSEOImpact: 10, implementationDifficulty: 8,
            estimatedEffort: "Requires Developer", confidenceLevel: 100,
            nextBestAction: "Check server accessibility"
        }];
    }

    const issues: SEOIssueData[] = [];
    const auditMode = auditResult.auditMode || 'static';

    const cheerio = await import('cheerio');
    const static$ = auditResult.staticHtml ? cheerio.load(auditResult.staticHtml) : null;
    const rendered$ = auditResult.renderedHtml ? cheerio.load(auditResult.renderedHtml) : null;

    // Add an informational "Audit Mode" issue
    issues.push({
        category: "System",
        severity: "low",
        issueTitle: `Audit Mode: ${auditMode.charAt(0).toUpperCase() + auditMode.slice(1)}`,
        problemSummary: `This audit was performed in ${auditMode} mode.`,
        whyItMatters: auditMode === 'static' 
            ? "Static mode analyzes raw HTML only. IMPORTANT: LCP, CLS, INP, and FCP require JS execution and a real browser. Static HTML alone can NEVER measure them."
            : auditMode === 'api'
                ? "API mode uses the Google Lighthouse engine remotely to measure performance."
                : "Rendered mode uses a local Lighthouse/Playwright environment for the most accurate analysis.",
        currentState: auditResult.cwv?.lighthouseScore 
            ? `Mode: ${auditMode} | Lighthouse Score: ${auditResult.cwv.lighthouseScore}/100`
            : `Mode: ${auditMode}`,
        recommendedAction: auditMode === 'static' ? "Enable Rendered/API mode to measure performance." : "Review Lighthouse metrics below.",
        bestFixOption: "N/A",
        expectedSEOImpact: 0,
        implementationDifficulty: 1,
        estimatedEffort: "N/A",
        confidenceLevel: 100,
        auditSource: auditMode,
        nextBestAction: auditMode === 'static' ? "Switch to Rendered Mode" : "Continue monitoring"
    });

    // Add specialized Lighthouse Score result if measured
    if (auditMode !== 'static' && auditResult.cwv?.lighthouseScore !== undefined) {
        issues.push({
            category: "Performance",
            severity: auditResult.cwv.lighthouseScore >= 90 ? "low" : auditResult.cwv.lighthouseScore >= 50 ? "medium" : "critical",
            issueTitle: `Lighthouse Score: ${auditResult.cwv.lighthouseScore}/100`,
            problemSummary: `Lighthouse measured a performance score of ${auditResult.cwv.lighthouseScore} for this page.`,
            whyItMatters: "Lighthouse captures real-world performance metrics. A score above 90 is considered good; below 50 indicates significant performance bottlenecks.",
            currentState: `Performance Score: ${auditResult.cwv.lighthouseScore}/100`,
            recommendedAction: "Focus on improving the Core Web Vitals (LCP, CLS) listed in this report.",
            bestFixOption: "N/A",
            expectedSEOImpact: 8,
            implementationDifficulty: 5,
            estimatedEffort: "Ongoing Optimization",
            confidenceLevel: 100,
            auditSource: auditMode,
            nextBestAction: "Optimize Web Vitals"
        });
    }

    for (const catResult of auditResult.categoryResults as CategoryResult[]) {
        const categoryWeight = CATEGORY_WEIGHTS[catResult.categoryId] ?? 5;
        const categoryName = formatCategoryName(catResult.categoryId);

        for (const ruleResult of catResult.results) {
            // Handle Render-Required rules in Static mode
            if (isRenderRequired(ruleResult.ruleId) && auditMode === 'static') {
                issues.push({
                    category: categoryName,
                    severity: "low",
                    issueTitle: formatRuleTitle(ruleResult.ruleId),
                    problemSummary: `This metric (${formatRuleTitle(ruleResult.ruleId)}) could not be measured in Static mode.`,
                    whyItMatters: "To measure LCP, CLS, INP, and FCP, you MUST use a real browser (Playwright/Lighthouse) with JS execution. Static HTML alone can NEVER measure them.",
                    currentState: "Not measurable in Static mode",
                    recommendedAction: "Run the audit in Rendered mode to capture this metric.",
                    bestFixOption: "N/A",
                    expectedSEOImpact: 0,
                    implementationDifficulty: 1,
                    estimatedEffort: "N/A",
                    confidenceLevel: 100,
                    auditSource: auditMode,
                    nextBestAction: "Switch to Rendered Mode"
                });
                continue;
            }

            const d = ruleResult.details as Record<string, unknown> | undefined;
            const cwv = auditResult.cwv;
            let currentState = ruleResult.message;
            const recommendation = (d?.recommendation as string) || (d?.impact as string);

            // Performance specific labeling
            if (ruleResult.ruleId.startsWith("perf") || ruleResult.ruleId.startsWith("cwv")) {
                if (auditMode !== 'static') {
                    currentState = `Measured via Lighthouse: ${ruleResult.message}`;
                    if (cwv?.speedIndex) currentState += ` | Speed Index: ${Math.round(cwv.speedIndex)}ms`;
                    if (cwv?.tbt) currentState += ` | TBT: ${Math.round(cwv.tbt)}ms`;
                }
            }

            // Skip passing rules
            if (ruleResult.status === "pass") continue;

            const severity = mapSeverity(ruleResult, categoryWeight);
            const impact = estimateImpact(ruleResult, categoryWeight);
            const difficulty = estimateDifficulty(catResult.categoryId);

            // Filter out "Headless Browser unavailable" noise
            if (ruleResult.ruleId === "system-browser-check" || ruleResult.message.includes("Headless Browser unavailable") || ruleResult.message.includes("Could not measure")) {
                if (auditMode !== 'static') continue; 
            }

            const issueTitle = formatRuleTitle(ruleResult.ruleId);
            // Use extractCurrentState for general evidence, but allow the performance-specific override
            if (!ruleResult.ruleId.startsWith("perf") && !ruleResult.ruleId.startsWith("cwv")) {
                currentState = extractCurrentState(ruleResult, ruleResult.ruleId);
            }

            // Generate Next Best Action
            let nextBestAction = "Implement fix";
            let htmlState: string | undefined;
            let renderedState: string | undefined;
            let isComparison = false;

            if (ruleResult.ruleId.includes("title")) {
                nextBestAction = "Shorten title tag";
                htmlState = extractFromDom(static$, "title");
                renderedState = extractFromDom(rendered$, "title");
                isComparison = htmlState !== renderedState && auditMode === 'rendered';
            }
            else if (ruleResult.ruleId.includes("description")) {
                nextBestAction = "Update meta description";
                htmlState = extractFromDom(static$, 'meta[name="description"]', "content");
                renderedState = extractFromDom(rendered$, 'meta[name="description"]', "content");
                isComparison = htmlState !== renderedState && auditMode === 'rendered';
            }
            else if (ruleResult.ruleId.includes("schema")) nextBestAction = "Add missing schema fields";
            else if (ruleResult.ruleId.includes("orphan")) nextBestAction = "Add internal links";
            else if (ruleResult.ruleId.includes("lazy-above-fold")) nextBestAction = "Remove lazy loading";
            else if (isAdvisory(ruleResult.ruleId)) nextBestAction = "Add social signals";

            // Specialized whyItMatters for Performance
            let whyItMatters = (d?.impact as string) || recommendation || `Fixing this improves your ${categoryName} score.`;
            if (isRenderRequired(ruleResult.ruleId)) {
                whyItMatters = "Performance metrics like LCP and CLS require a real browser to measure. " + whyItMatters;
            }

            // Finalize issue data
            let fixLabel = "Replace with this code";
            if (ruleResult.ruleId.includes("orphan") || ruleResult.ruleId.includes("external-valid") || isAdvisory(ruleResult.ruleId)) {
                fixLabel = "Suggested implementation";
            } else if (ruleResult.ruleId.includes("schema") || ruleResult.ruleId.includes("structured")) {
                fixLabel = "JSON-LD Implementation";
            } else if (ruleResult.ruleId.includes("perf") || ruleResult.ruleId.includes("cwv")) {
                fixLabel = "Technical Next Step";
            }

            issues.push({
                category: categoryName,
                severity,
                issueTitle,
                problemSummary: ruleResult.message,
                whyItMatters,
                currentState,
                recommendedAction: recommendation || `Fix the ${issueTitle} issue described above.`,
                bestFixOption: buildFixSuggestion(ruleResult, ruleResult.ruleId, auditMode),
                fixLabel,
                expectedSEOImpact: impact,
                pageUrl: (d?.pageUrl as string) || url,
                implementationDifficulty: difficulty,
                estimatedEffort: estimateEffort(difficulty),
                confidenceLevel: ruleResult.status === "fail" ? 100 : 80,
                auditSource: auditMode,
                nextBestAction,
                htmlState,
                renderedState,
                isComparison
            });
        }
    }

    // Booster logic: Prioritize the "Top 5" fixes identified by the user
    const topFiveKeywords = ["description", "word-count", "text-html-ratio", "schema", "js-async", "js-defer"];

    issues.forEach(issue => {
        const isHighROI = topFiveKeywords.some(k => issue.issueTitle.toLowerCase().includes(k) || issue.recommendedAction.toLowerCase().includes(k));
        if (isHighROI) {
            issue.severity = "critical"; // Force Top 5 to Critical
            issue.expectedSEOImpact = Math.max(issue.expectedSEOImpact, 15); // Ensure high impact score
        }
    });

    // Sort: critical first, then by impact descending
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    issues.sort((a, b) => {
        const severityDiff = order[a.severity] - order[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return b.expectedSEOImpact - a.expectedSEOImpact;
    });

    return issues;
}
