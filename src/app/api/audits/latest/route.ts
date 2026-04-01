import { NextResponse } from "next/server";
import { getLatestAuditData } from "@/lib/audit-data";

export async function GET() {
    try {
        const latestAudit = await getLatestAuditData();

        if (!latestAudit) {
            return NextResponse.json({ message: "No audits found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, ...latestAudit });
    } catch (error: any) {
        console.error("Fetch audit error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
