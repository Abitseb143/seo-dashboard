import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const latestAudit = await prisma.audit.findFirst({
            orderBy: { createdAt: "desc" },
            include: {
                project: true,
                pageAudits: {
                    include: {
                        issues: {
                            include: {
                                recommendedFix: true,
                            },
                        },
                    },
                },
            },
        });

        if (!latestAudit) {
            return NextResponse.json({ message: "No audits found" }, { status: 404 });
        }

        // Flatten all issues from all pages into a single array
        const allIssues = latestAudit.pageAudits.flatMap((pa: any) =>
            pa.issues.map((i: any) => ({ ...i, pageUrl: pa.url }))
        );

        // Sort issues by priority rank descending
        const rankedIssues = allIssues.sort((a: any, b: any) => {
            const aRank = a.recommendedFix?.priorityRank || 0;
            const bRank = b.recommendedFix?.priorityRank || 0;
            return bRank - aRank;
        });

        // Categorize
        const quickWins = rankedIssues.filter(
            (i: any) => (i.recommendedFix?.implementationDifficulty || 10) <= 3
        );

        const technicalFixes = rankedIssues.filter((i: any) => i.category === "Technical" || i.category === "Performance");
        const contentFixes = rankedIssues.filter((i: any) => i.category === "Content" || i.category === "On-page SEO");

        return NextResponse.json({
            success: true,
            auditId: latestAudit.id,
            overallScore: latestAudit.overallScore,
            project: latestAudit.project,
            stats: {
                totalIssues: rankedIssues.length,
                criticalIssues: rankedIssues.filter((i: any) => i.severity === "critical").length,
            },
            bestFixes: rankedIssues, // All issues
            quickWins,
            technicalFixes,
            contentFixes,
            allIssues: rankedIssues,
        });
    } catch (error: any) {
        console.error("Fetch audit error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
