import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import puppeteer from "puppeteer";

export async function GET() {
    try {
        const latestAudit = await prisma.audit.findFirst({
            where: { status: "COMPLETED" },
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

        // Flatten issues
        const allIssues = latestAudit.pageAudits.flatMap((pa: any) =>
            pa.issues.map((i: any) => ({ ...i, pageUrl: pa.url }))
        );

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        const escapeHtml = (unsafe: string) => {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        };

        const pdfHtmlTemplate = `
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
                    h1 { color: #0f172a; margin: 0; }
                    .score-circle { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; border: 4px solid #e2e8f0; }
                    .score-good { border-color: #10b981; color: #10b981; }
                    .score-fair { border-color: #f59e0b; color: #f59e0b; }
                    .score-poor { border-color: #ef4444; color: #ef4444; }
                    .summary { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e2e8f0; }
                    .severity { font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 8px; border-radius: 12px; display: inline-block; }
                    .severity-critical { background-color: #fef2f2; color: #991b1b; }
                    .severity-high { background-color: #fff7ed; color: #9a3412; }
                    .severity-medium { background-color: #f0f9ff; color: #075985; }
                    .impact-badge { background-color: #ecfdf5; color: #047857; font-size: 11px; font-weight: bold; padding: 4px 8px; border-radius: 12px; border: 1px solid #d1fae5; }
                    .code-block { font-family: 'Courier New', Courier, monospace; font-size: 12px; padding: 15px; border-radius: 8px; margin: 10px 0; white-space: pre-wrap; word-break: break-all; }
                    .code-problem { background-color: #fef2f2; border: 1px solid #fee2e2; color: #991b1b; }
                    .code-fix { background-color: #ecfdf5; border: 1px solid #d1fae5; color: #065f46; }
                    .section-label { font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 5px; display: block; }
                    .footer { margin-top: 50px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                    .fix-card { margin-bottom: 40px; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; page-break-inside: avoid; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <h1>SEO Audit Report</h1>
                        <div style="color: #64748b; margin-top: 5px;">Project: ${latestAudit.project.name}</div>
                        <div style="color: #94a3b8; font-size: 12px;">Generated on: ${new Date().toLocaleDateString()}</div>
                    </div>
                    <div class="score-circle ${latestAudit.overallScore >= 80 ? 'score-good' : latestAudit.overallScore >= 50 ? 'score-fair' : 'score-poor'}">
                        ${Math.round(latestAudit.overallScore)}
                    </div>
                </div>

                <div class="summary">
                    <div style="font-weight: bold; color: #334155; margin-bottom: 10px;">Audit Summary</div>
                    <div style="display: flex; gap: 40px;">
                        <div>
                            <div style="font-size: 12px; color: #64748b;">TOTAL ISSUES</div>
                            <div style="font-size: 20px; font-weight: bold;">${allIssues.length}</div>
                        </div>
                        <div>
                            <div style="font-size: 12px; color: #64748b;">CRITICAL</div>
                            <div style="font-size: 20px; font-weight: bold; color: #ef4444;">${allIssues.filter((i: any) => i.severity === 'critical').length}</div>
                        </div>
                    </div>
                </div>

                <h2 style="margin-bottom: 30px;">Top SEO Recommendations (Best Fixes)</h2>

                ${allIssues.map((issue: any, index: number) => {
                    const fix = issue.recommendedFix;
                    return `
                        <div class="fix-card">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                                <div style="font-weight: bold; font-size: 18px; color: #0f172a;">${index + 1}. ${issue.issueTitle}</div>
                                <div style="display: flex; gap: 8px;">
                                    <span class="severity severity-${issue.severity}">${issue.severity}</span>
                                    ${fix?.expectedSEOImpact ? `<span class="impact-badge">+${fix.expectedSEOImpact} PTS</span>` : ''}
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 20px; color: #475569; font-size: 14px;">
                                ${issue.problemSummary || ''}
                            </div>

                            ${issue.currentState ? `
                                <div style="margin-bottom: 20px;">
                                    <span class="section-label">📍 WHERE THE PROBLEM IS:</span>
                                    <div class="code-block code-problem">${escapeHtml(issue.currentState)}</div>
                                </div>
                            ` : ''}

                            <div style="margin-bottom: 20px;">
                                <span class="section-label">🔧 HOW TO FIX IT:</span>
                                <div style="font-size: 14px; color: #334155; font-weight: 500;">
                                    ${fix?.recommendedAction || 'No recommendation provided.'}
                                </div>
                            </div>

                            ${fix?.bestFixOption ? `
                                <div style="margin-bottom: 20px;">
                                    <span class="section-label">✅ REPLACE WITH THIS EXACT CODE:</span>
                                    <div class="code-block code-fix">${escapeHtml(fix.bestFixOption)}</div>
                                </div>
                            ` : ''}

                            <div style="margin-top: 25px; background-color: #eff6ff; border: 1px solid #dbeafe; padding: 15px; border-radius: 8px;">
                                <span class="section-label" style="color: #1e40af;">💡 WHY THIS MATTERS FOR YOUR RANKINGS:</span>
                                <div style="font-size: 13px; color: #1e40af;">
                                    ${issue.whyItMatters}
                                </div>
                            </div>

                            <div style="font-size: 11px; color: #94a3b8; margin-top: 15px; font-family: monospace; word-break: break-all;">
                                PAGE URL: ${issue.pageUrl}
                            </div>
                        </div>
                    `;
                }).join('')}

                <div class="footer">
                    Generated by SEO Fixer AI
                </div>
            </body>
            </html>
        `;

        await page.setContent(pdfHtmlTemplate, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        // Return as a downloadable file
        return new NextResponse(pdfBuffer as any, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="SEO-Report-${(latestAudit.project.name || 'Project').replace(/[^a-z0-9]/gi, '_')}.pdf"`,
            },
        });
    } catch (error: any) {
        console.error("Export PDF error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
