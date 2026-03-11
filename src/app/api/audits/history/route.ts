import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const audits = await prisma.audit.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
                project: true,
                pageAudits: {
                    include: {
                        issues: true,
                    },
                },
            },
        });

        const history = audits.map((audit: any) => {
            const totalIssues = audit.pageAudits.reduce(
                (sum: number, pa: any) => sum + pa.issues.length,
                0
            );
            return {
                id: audit.id,
                projectName: audit.project?.name || audit.project?.url || "Unknown",
                date: audit.createdAt,
                score: Math.round(audit.overallScore),
                issues: totalIssues,
                status: audit.status,
            };
        });

        return NextResponse.json({ success: true, history });
    } catch (error: any) {
        console.error("Fetch history error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
