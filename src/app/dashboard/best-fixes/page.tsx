"use client";

import { useEffect, useState } from "react";
import { FixCard } from "@/components/ui/FixCard";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function BestFixesPage() {
    const [issues, setIssues] = useState<any[]>([]);
    const [auditId, setAuditId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        async function fetchFixes() {
            try {
                const res = await fetch("/api/audits/latest");
                const data = await res.json();
                if (data.success) {
                    setIssues(data.bestFixes || []);
                    setAuditId(data.auditId);
                }
            } catch (e) {
                console.error("Failed to load best fixes", e);
            } finally {
                setLoading(false);
            }
        }
        fetchFixes();
    }, []);

    const handleEmailReport = async () => {
        if (!auditId) return;
        
        setIsSending(true);
        try {
            const res = await fetch("/api/notifications/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ auditId }),
            });
            
            if (res.ok) {
                setSent(true);
                setTimeout(() => setSent(false), 5000);
            } else {
                alert("Failed to send report request to n8n. Please try again later.");
            }
        } catch (error) {
            console.error("Failed to trigger n8n report:", error);
            alert("An error occurred while requesting the report.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Best Fixes</h1>
                    <p className="text-slate-500 mt-2">
                        Ranked from highest impact to lowest impact. Prioritize these to improve your SEO score efficiently.
                    </p>
                </div>
                <button
                    onClick={handleEmailReport}
                    disabled={isSending || loading || issues.length === 0 || sent}
                    className={`flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                        sent ? 'bg-emerald-600' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                    }`}
                >
                    {isSending ? (
                        <Loader2 size={16} className="animate-spin" />
                    ) : sent ? (
                        <CheckCircle2 size={16} />
                    ) : (
                        <Mail size={16} />
                    )}
                    {sent ? "Report Sent!" : isSending ? "Sending..." : "Email Report PDF"}
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                    ))}
                </div>
            ) : issues.length > 0 ? (
                <div className="space-y-2">
                    {issues.map((issue) => (
                        <FixCard key={issue.id || Math.random()} issue={issue} />
                    ))}
                </div>
            ) : (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <p className="text-slate-500">No fixes available. Run an audit to generate recommendations.</p>
                </div>
            )}
        </div>
    );
}
