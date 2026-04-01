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
        const body = await req.json().catch(e => {
            console.error("[Audit API] JSON Parse Error:", e);
            return null;
        });

        if (!body) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const { targetUrls, projectId, projectName } = body;
        console.log("[Audit API] Received request for:", { targetUrls, projectName });

        if (!targetUrls || !Array.isArray(targetUrls) || targetUrls.length === 0) {
            return NextResponse.json({ error: "At least one target URL is required" }, { status: 400 });
        }

        let projectUrl = targetUrls[0];
        let normalizedProjectName = projectName || "SEO Project";
        try {
            const parsedUrl = new URL(targetUrls[0]);
            projectUrl = parsedUrl.origin;
            normalizedProjectName = parsedUrl.hostname;
        } catch {
            // Keep user input if URL parsing fails here. The auditor will validate it later.
        }

        // Reuse an existing project for the same site when possible.
        let dbProjectId = projectId;
        if (!dbProjectId) {
            const existingProject = await prisma.project.findFirst({
                where: {
                    url: projectUrl,
                },
            });

            if (existingProject) {
                dbProjectId = existingProject.id;
            } else {
                console.log("[Audit API] Creating new project for:", projectUrl);
                const p = await prisma.project.create({
                    data: {
                        url: projectUrl,
                        name: normalizedProjectName,
                    },
                });
                dbProjectId = p.id;
            }
        }

        // Create Audit
        console.log("[Audit API] Creating audit record for project:", dbProjectId);
        const audit = await prisma.audit.create({
            data: {
                projectId: dbProjectId,
                overallScore: 0,
                status: "RUNNING",
            },
        });

        let totalScore = 0;
        try {
            for (const url of targetUrls) {
                console.log(`[Audit] Starting live SEO audit for: ${url}`);
                const liveIssues = await runLiveSEOAudit(url);
                console.log(`[Audit] Audit engine returned ${liveIssues.length} issues for ${url}`);

                const pageScore = Math.max(0, 100 - (liveIssues.length * 5));
                totalScore += pageScore;

                const pageAudit = await prisma.pageAudit.create({
                    data: {
                        auditId: audit.id,
                        url,
                        pageScore,
                    },
                });

                console.log(`[Audit] Saving ${liveIssues.length} issues to database via transaction...`);
                
                await prisma.$transaction(
                    liveIssues.map(issue => {
                        const priorityRank = calculatePriorityRank(
                            issue.severity,
                            issue.expectedSEOImpact,
                            issue.implementationDifficulty
                        );

                        return prisma.issue.create({
                            data: {
                                pageAuditId: pageAudit.id,
                                category: issue.category,
                                severity: issue.severity,
                                issueTitle: issue.issueTitle,
                                problemSummary: issue.problemSummary,
                                whyItMatters: issue.whyItMatters,
                                currentState: issue.currentState,
                                pageUrl: issue.pageUrl || url,
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
                    })
                );
            }

            const overallScore = totalScore / targetUrls.length;
            await prisma.audit.update({
                where: { id: audit.id },
                data: {
                    overallScore,
                    status: "COMPLETED",
                },
            });
            
            console.log(`[Audit API] Audit ${audit.id} finished successfully with score: ${overallScore}`);

        } catch (auditError: any) {
            console.error(`[Audit API] Audit ${audit.id} failed:`, auditError);
            await prisma.audit.update({
                where: { id: audit.id },
                data: { status: "FAILED" }
            }).catch(() => { });
            throw auditError;
        }

        return NextResponse.json({
            success: true,
            auditId: audit.id,
            overallScore: targetUrls.length > 0 ? totalScore / targetUrls.length : 0,
            message: "SEO Audit completed successfully.",
        });
    } catch (error: any) {
        console.error("[Audit API] Fatal Error:", error);
        return NextResponse.json({ 
            error: error.message || "An unexpected error occurred during audit creation",
        }, { status: 500 });
    }
}
