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

    // Handle "issues" array which might contain complex objects (Title length, Heading length, etc.)
    if (Array.isArray(d.issues) && d.issues.length > 0) {
        if (ruleId.includes("heading-length")) {
            const hIssues = (d.issues as any[]).slice(0, 3);
            snippets.push("Headings with issues:\n" + hIssues.map(i => `  • H${i.level}: "${i.text}" (${i.length} chars)`).join("\n"));
        } else if (ruleId.includes("anchor-text")) {
            const aIssues = (d.issues as any[]).slice(0, 3);
            snippets.push("Links with generic text:\n" + aIssues.map(i => `  • To ${i.href}: "${i.text}"`).join("\n"));
        } else {
            // General string fallback or first-level object mapping
            const sample = d.issues[0];
            if (typeof sample === "string") {
                snippets.push(...(d.issues as string[]).slice(0, 3));
            } else {
                snippets.push(`Found ${d.issues.length} specific instances of this issue.`);
            }
        }
    }

    if (Array.isArray(d.headings) && d.headings.length > 0) {
        const headings = (d.headings as Array<{ tag: string, text: string }>).slice(0, 5);
        snippets.push("Heading structure:\n" + headings.map(h => `  ${h.tag}: ${h.text}`).join("\n"));
    }
    if (typeof d.score === "number" && ruleId.includes("reading")) snippets.push(`Readability score: ${d.score} (${d.levelDescription || ""})`);
    if (d.missingAlts !== undefined) snippets.push(`Images missing alt: ${d.missingAlts}`);
    if (typeof d.totalImages === "number") snippets.push(`Total images: ${d.totalImages}`);

    // Correct Text-to-HTML ratio math (input is already 0-100 percentage)
    if (typeof d.ratio === "number") {
        const value = d.ratio;
        snippets.push(`Text-to-HTML ratio: ${value.toFixed(1)}%`);
    }

    if (Array.isArray(d.structure)) {
        const structure = (d.structure as Array<{ level: number, text: string }>).slice(0, 5);
        snippets.push("Found heading structure:\n" + structure.map(h => `  H${h.level}: ${h.text}`).join("\n"));
    }
    if (ruleId.includes("keyword-stuffing")) {
        const overused = (d.overusedWords as any[]) || [];
        const severe = (d.severelyOverusedWords as any[]) || [];
        const all = [...severe, ...overused].slice(0, 10);
        if (all.length > 0) {
            snippets.push("Overused words found:");
            all.forEach(item => snippets.push(`  • "${item.word}": ${item.density}% density (${item.count} times)`));
        }
    }

    return snippets.length > 0 ? snippets.join("\n") : result.message;
}

function buildFixSuggestion(result: RuleResult, ruleId: string): string {
    const d = result.details as Record<string, unknown> | undefined;

    // Map known rule IDs to concrete fix code
    if (ruleId.includes("description") && !ruleId.includes("duplicate")) {
        // Special case for the user's site: Synthera
        if (d?.pageUrl?.toString().includes("synthera.com.au") || d?.title?.toString().toLowerCase().includes("synthera")) {
            return `<meta name="description" content="Custom AI voice agents, WhatsApp chatbots and AI websites for Australian businesses. Automate support, bookings and sales with AI. Free consultation available.">`;
        }
        return `<meta name="description" content="Include your primary keyword naturally and a clear call-to-action. Target length: 150-160 characters.">`;
    }
    if (ruleId.includes("title") && ruleId.includes("pixel")) {
        const title = typeof d?.title === "string" ? d.title : "Your Page Title";
        return `<!-- Your title "${title}" may be truncated or too short -->\n<title>${title} | Your Brand Name</title>`;
    }
    if (ruleId.includes("heading-hierarchy")) {
        return `<!-- Use one H1, then H2 for major sections, H3 for sub-sections -->\n<h1>Main Page Topic</h1>\n<h2>Key Feature</h2>\n<h3>Detail about feature</h3>`;
    }
    if (ruleId.includes("schema") || ruleId.includes("structured")) {
        // Special case for Synthera
        if (d?.pageUrl?.toString().includes("synthera.com.au")) {
            return `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "Synthera",\n  "url": "https://www.synthera.com.au",\n  "description": "AI automation solutions for Australian businesses including voice agents and chatbots.",\n  "address": {\n    "@type": "PostalAddress",\n    "addressCountry": "AU"\n  }\n}\n</script>`;
        }
        return `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "Your Business Name",\n  "url": "https://yourdomain.com",\n  "address": {\n    "@type": "PostalAddress",\n    "addressCountry": "AU"\n  }\n}\n</script>`;
    }
    if (ruleId.includes("image") || ruleId.includes("alt")) {
        return `<!-- Add descriptive, keyword-rich alt text to your images -->\n<img src="/image.webp" alt="Detailed description of what the image shows" loading="lazy">`;
    }
    if (ruleId.includes("script") || ruleId.includes("js")) {
        return `<!-- Add 'defer' to non-critical scripts to prevent render blocking -->\n<script src="/your-script.js" defer></script>`;
    }
    if (ruleId.includes("word-count") || ruleId.includes("text-html-ratio")) {
        return `<!-- Add 300-500 words of high-quality content explaining your services -->\n<section>\n  <h2>Comprehensive Guide to [Topic]</h2>\n  <p>Detailed explanation using primary and secondary keywords naturally...</p>\n</section>`;
    }
    if (ruleId.includes("canonical")) {
        return `<link rel="canonical" href="https://www.yoursite.com/this-page" />`;
    }

    // Generic fallback 
    return (d?.recommendation as string) || "Resolve the issue described above by applying the recommended standard SEO practices.";
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
