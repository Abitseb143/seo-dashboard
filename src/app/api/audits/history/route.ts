import { NextResponse } from "next/server";
import { getAuditHistory } from "@/lib/audit-data";

export async function GET() {
    try {
        const history = await getAuditHistory();

        return NextResponse.json({ success: true, history });
    } catch (error: any) {
        console.error("Fetch history error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
