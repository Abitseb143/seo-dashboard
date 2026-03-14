import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { auditId, email } = body;

        // Fetch the audit details from DB
        const audit = await prisma.audit.findUnique({
            where: { id: auditId },
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

        if (!audit) {
            return NextResponse.json({ error: "Audit not found" }, { status: 404 });
        }

        // Prepare a lightweight payload for n8n
        // n8n will handle the PDF generation and emailing
        const payload = {
            projectId: audit.projectId,
            projectName: audit.project.name,
            overallScore: audit.overallScore,
            totalIssues: audit.pageAudits.reduce((acc, pa) => acc + pa.issues.length, 0),
            recipientEmail: email || "admin@yourcompany.com", // Fallback or user provided
            auditResults: audit.pageAudits.map(pa => ({
                url: pa.url,
                score: pa.pageScore,
                issues: pa.issues.map(i => ({
                    title: i.issueTitle,
                    severity: i.severity,
                    impact: i.recommendedFix?.expectedSEOImpact,
                    action: i.recommendedFix?.recommendedAction
                }))
            }))
        };

        // Ping n8n Webhook
        // The user should replace this with their actual n8n webhook URL
        const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://n8n.yourdomain.com/webhook/seo-report-trigger";
        
        console.log(`[Notification] Pinging n8n for audit ${auditId} to email ${payload.recipientEmail}`);

        const n8nRes = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!n8nRes.ok) {
            const errorText = await n8nRes.text();
            console.error(`[Notification] n8n Error: ${errorText}`);
            return NextResponse.json({ error: "Failed to notify n8n" }, { status: 502 });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Report request sent to n8n successfully. You will receive an email shortly." 
        });

    } catch (error: any) {
        console.error("[Notification API] Fatal Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
