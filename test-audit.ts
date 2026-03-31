import { runLiveSEOAudit } from './src/lib/seo-engine';

async function main() {
    console.log('Starting SEO Audit for https://www.synthera.com.au/ ...');
    try {
        const issues = await runLiveSEOAudit('https://www.synthera.com.au/');
        
        console.log(`\n✅ Audit Complete! Found ${issues.length} issues to fix.\n`);
        
        // Print out the top 10 most critical issues
        issues.slice(0, 10).forEach((issue, index) => {
            console.log(`[${index + 1}] [${issue.severity.toUpperCase()}] ${issue.issueTitle}`);
            console.log(`    Message: ${issue.problemSummary}`);
            console.log(`    Current State: ${issue.currentState}`);
            console.log(`    Impact: ${issue.expectedSEOImpact}/10 | Difficulty: ${issue.implementationDifficulty}/10`);
            console.log(`    Category: ${issue.category}\n`);
        });

    } catch (e) {
        console.error('Audit failed:', e);
    }
}

main();
