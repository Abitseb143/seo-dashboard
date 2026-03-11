import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runLiveSEOAudit } from "@/lib/seo-engine";

function calculatePriorityRank(severity: string, impact: number, difficulty: number): number {
    let rank = 0;
    if (severity === "critical") rank += 40;
    else if (severity === "high") rank += 30;
    else if (severity === "medium") rank += 15;
    else if (severity === "low") rank += 5;

    rank += (impact * 4); // max ~40
    rank += (10 - difficulty) * 2; // max ~20
    return Math.min(100, Math.round(rank));
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { targetUrls, projectId, projectName } = body;

        if (!targetUrls || !Array.isArray(targetUrls)) {
            return NextResponse.json({ error: "targetUrls array is required" }, { status: 400 });
        }

        // Optional: Use existing project or create a new dummy one
        let dbProjectId = projectId;
        if (!dbProjectId) {
            const p = await prisma.project.create({
                data: {
                    url: targetUrls[0] || "https://www.synthera.com.au/",
                    name: projectName || "Auto Created Project",
                },
            });
            dbProjectId = p.id;
        }

        // Create Audit
        const audit = await prisma.audit.create({
            data: {
                projectId: dbProjectId,
                overallScore: 0, // We will calculate this
                status: "RUNNING",
            },
            include: { pageAudits: true },
        });

        let totalScore = 0;

        for (const url of targetUrls) {
            // Live crawl the page
            const liveIssues = await runLiveSEOAudit(url);

            // Calculate a dummy page score based on issues
            const pageScore = Math.max(0, 100 - (liveIssues.length * 5));
            totalScore += pageScore;

            // Create Page Audit
            const pageAudit = await prisma.pageAudit.create({
                data: {
                    auditId: audit.id,
                    url,
                    pageScore,
                },
            });

            // Insert Issues & Recommended Fixes
            for (const issue of liveIssues) {
                const priorityRank = calculatePriorityRank(
                    issue.severity,
                    issue.expectedSEOImpact,
                    issue.implementationDifficulty
                );

                await prisma.issue.create({
                    data: {
                        pageAuditId: pageAudit.id,
                        category: issue.category,
                        severity: issue.severity,
                        issueTitle: issue.issueTitle,
                        problemSummary: issue.problemSummary,
                        whyItMatters: issue.whyItMatters,
                        currentState: issue.currentState,
                        recommendedFix: {
                            create: {
                                recommendedAction: issue.recommendedAction,
                                bestFixOption: issue.bestFixOption,
                                alternativeFixOptions: issue.alternativeFixOptions,
                                expectedSEOImpact: issue.expectedSEOImpact,
                                implementationDifficulty: issue.implementationDifficulty,
                                estimatedEffort: issue.estimatedEffort,
                                codeExample: issue.codeExample,
                                cmsInstruction: issue.cmsInstruction,
                                priorityRank,
                                confidenceLevel: issue.confidenceLevel,
                            },
                        },
                    },
                });
            }
        }

        // Update Overall Audit Score
        const overallScore = totalScore / targetUrls.length;
        await prisma.audit.update({
            where: { id: audit.id },
            data: {
                overallScore,
                status: "COMPLETED",
            },
        });

        return NextResponse.json({
            success: true,
            auditId: audit.id,
            overallScore,
            message: "SEO Audit completed successfully.",
        });
    } catch (error: any) {
        console.error("Audit create error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
