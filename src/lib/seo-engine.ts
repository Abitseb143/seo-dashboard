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
    const hard = ["perf", "js", "crawler", "redirect", "htmlval"];
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

/**
 * Extract a plain-English "current state" from rule details
 */
function extractCurrentState(result: RuleResult, ruleId: string): string {
    const d = result.details as Record<string, unknown> | undefined;
    if (!d) return result.message;

    // Try common detail fields from the CLI rules
    const snippets: string[] = [];

    if (typeof d.title === "string") snippets.push(`Current title: "${d.title}"`);
    if (typeof d.description === "string") snippets.push(`Current description: "${d.description.substring(0, 120)}..."`);
    if (typeof d.characterCount === "number") snippets.push(`Length: ${d.characterCount} characters`);
    if (typeof d.estimatedWidth === "number") snippets.push(`Estimated pixel width: ${d.estimatedWidth}px`);
    if (typeof d.wordCount === "number") snippets.push(`Word count: ${d.wordCount}`);
    if (Array.isArray(d.issues) && d.issues.length > 0) snippets.push(...(d.issues as string[]).slice(0, 3));
    if (Array.isArray(d.headings) && d.headings.length > 0) {
        const headings = (d.headings as Array<{ tag: string, text: string }>).slice(0, 5);
        snippets.push("Heading structure:\n" + headings.map(h => `  ${h.tag}: ${h.text}`).join("\n"));
    }
    if (typeof d.score === "number" && ruleId.includes("reading")) snippets.push(`Readability score: ${d.score} (${d.levelDescription || ""})`);
    if (d.missingAlts !== undefined) snippets.push(`Images missing alt: ${d.missingAlts}`);
    if (typeof d.totalImages === "number") snippets.push(`Total images: ${d.totalImages}`);
    if (typeof d.ratio === "number") snippets.push(`Text-to-HTML ratio: ${(d.ratio * 100).toFixed(1)}%`);
    if (Array.isArray(d.structure)) {
        const structure = (d.structure as Array<{ level: number, text: string }>).slice(0, 5);
        snippets.push("Found heading structure:\n" + structure.map(h => `  H${h.level}: ${h.text}`).join("\n"));
    }

    return snippets.length > 0 ? snippets.join("\n") : result.message;
}

/**
 * Build a "best fix option" code snippet based on the rule and details
 */
function buildFixSuggestion(result: RuleResult, ruleId: string): string {
    const d = result.details as Record<string, unknown> | undefined;

    // Map known rule IDs to concrete fix code
    if (ruleId.includes("title") && ruleId.includes("pixel")) {
        const title = typeof d?.title === "string" ? d.title : "Your Page Title";
        return `<!-- Your title "${title}" may be truncated.\nShorten it to under 580px wide (~55 characters).\nExample: -->\n<title>${title.substring(0, 50)} | Brand Name</title>`;
    }
    if (ruleId.includes("description") && !ruleId.includes("duplicate")) {
        return `<meta name="description" content="Write a 150-160 character summary of your page here, including your primary keyword and a call to action.">`;
    }
    if (ruleId.includes("heading-hierarchy")) {
        return `<!-- Correct heading structure -->\n<h1>Main Page Topic (one per page)</h1>\n<h2>Section One</h2>\n<h3>Sub-topic under Section One</h3>\n<h2>Section Two</h2>`;
    }
    if (ruleId.includes("schema") || ruleId.includes("structured")) {
        return `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "Your Business",\n  "url": "https://www.yoursite.com",\n  "telephone": "+61400000000",\n  "address": {\n    "@type": "PostalAddress",\n    "addressCountry": "AU"\n  }\n}\n</script>`;
    }
    if (ruleId.includes("image") || ruleId.includes("alt")) {
        return `<!-- Replace empty alt tags -->\n<img src="/your-image.webp" alt="Descriptive keyword-rich description of this image" loading="lazy">`;
    }
    if (ruleId.includes("canonical")) {
        return `<link rel="canonical" href="https://www.yoursite.com/this-page" />`;
    }
    if (ruleId.includes("robots")) {
        return `<!-- robots.txt -->\nUser-agent: *\nAllow: /\nSitemap: https://www.yoursite.com/sitemap.xml`;
    }
    if (ruleId.includes("sitemap")) {
        return `<!-- Generate via Next.js or your CMS -->\n<!-- Next.js: create app/sitemap.ts -->\nimport type { MetadataRoute } from 'next'\nexport default function sitemap(): MetadataRoute.Sitemap {\n  return [\n    { url: 'https://yoursite.com', lastModified: new Date() }\n  ]\n}`;
    }
    if (ruleId.includes("script") || ruleId.includes("js")) {
        return `<!-- Defer non-critical JavaScript -->\n<script src="/your-script.js" defer></script>`;
    }
    if (ruleId.includes("viewport")) {
        return `<meta name="viewport" content="width=device-width, initial-scale=1">`;
    }
    if (ruleId.includes("word-count")) {
        return `<!-- Add more content to this page -->\n<!-- Minimum recommendation: 300+ words -->\n<section>\n  <h2>About Our Service</h2>\n  <p>Detailed description of your service, benefits, and how it helps customers...</p>\n</section>`;
    }
    if (ruleId.includes("og:") || ruleId.includes("open-graph") || ruleId.includes("social")) {
        return `<meta property="og:title" content="Your Page Title">\n<meta property="og:description" content="Page description for social sharing">\n<meta property="og:image" content="https://yoursite.com/og-image.jpg">\n<meta property="og:url" content="https://yoursite.com/this-page">`;
    }
    if (ruleId.includes("lang")) {
        return `<html lang="en-AU">`;
    }

    // Generic fallback 
    return d?.recommendation as string || "Resolve the issue described above based on the current state shown.";
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

// Category weight map (from the original CLI categories/index.ts)
const CATEGORY_WEIGHTS: Record<string, number> = {
    core: 25, content: 20, technical: 15, perf: 10,
    links: 8, images: 5, schema: 5, security: 5,
    social: 3, mobile: 5, crawler: 5, redirect: 5,
    url: 3, js: 3, a11y: 3, eeat: 2, geo: 2,
    i18n: 2, legal: 1, htmlval: 2
};

/**
 * Main audit function — uses the real CLI Auditor class with all 296 rules.
 */
export async function runLiveSEOAudit(url: string): Promise<SEOIssueData[]> {
    const auditor = new Auditor({
        timeout: 30000,
        measureCwv: false, // Skip Playwright for speed
    });

    let auditResult;
    try {
        auditResult = await auditor.audit(url);
    } catch (error: any) {
        return [{
            category: "Technical", severity: "critical",
            issueTitle: "💥 Crawl Failed",
            problemSummary: `Could not reach the URL. Error: ${error.message}`,
            whyItMatters: "If the tool cannot reach your site, Google's bots may also be blocked.",
            currentState: `Error: ${error.message}`,
            recommendedAction: "Check that the URL is correct and publicly accessible.",
            bestFixOption: "Ensure the site is live and not blocking crawlers.",
            expectedSEOImpact: 10, implementationDifficulty: 8,
            estimatedEffort: "Requires Developer", confidenceLevel: 100
        }];
    }

    const issues: SEOIssueData[] = [];

    for (const catResult of auditResult.categoryResults as CategoryResult[]) {
        const categoryWeight = CATEGORY_WEIGHTS[catResult.categoryId] ?? 5;
        const categoryName = formatCategoryName(catResult.categoryId);

        for (const ruleResult of catResult.results) {
            // Skip passing rules
            if (ruleResult.status === "pass") continue;

            const severity = mapSeverity(ruleResult, categoryWeight);
            const impact = estimateImpact(ruleResult, categoryWeight);
            const difficulty = estimateDifficulty(catResult.categoryId);

            const d = ruleResult.details as Record<string, unknown> | undefined;
            const recommendation = (d?.recommendation as string) || (d?.impact as string) || "";

            issues.push({
                category: categoryName,
                severity,
                issueTitle: formatRuleTitle(ruleResult.ruleId),
                problemSummary: ruleResult.message,
                whyItMatters: (d?.impact as string) || recommendation || `Fixing this improves your ${categoryName} score.`,
                currentState: extractCurrentState(ruleResult, ruleResult.ruleId),
                recommendedAction: recommendation || `Fix the ${formatRuleTitle(ruleResult.ruleId)} issue described above.`,
                bestFixOption: buildFixSuggestion(ruleResult, ruleResult.ruleId),
                expectedSEOImpact: impact,
                pageUrl: (d?.pageUrl as string) || url,
                implementationDifficulty: difficulty,
                estimatedEffort: estimateEffort(difficulty),
                confidenceLevel: ruleResult.status === "fail" ? 100 : 80
            });
        }
    }

    // Sort: critical first, then by impact descending
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    issues.sort((a, b) => {
        const severityDiff = order[a.severity] - order[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return b.expectedSEOImpact - a.expectedSEOImpact;
    });

    return issues;
}
