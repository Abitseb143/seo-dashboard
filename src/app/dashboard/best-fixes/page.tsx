"use client";

import { useEffect, useState } from "react";
import { FixCard } from "@/components/ui/FixCard";
import { Download, Loader2 } from "lucide-react";

export default function BestFixesPage() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        async function fetchFixes() {
            try {
                const res = await fetch("/api/audits/latest");
                const data = await res.json();
                if (data.success && data.bestFixes) {
                    setIssues(data.bestFixes);
                }
            } catch (e) {
                console.error("Failed to load best fixes", e);
            } finally {
                setLoading(false);
            }
        }
        fetchFixes();
    }, []);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            window.open("/api/audits/export", "_blank");
        } catch (error) {
            console.error("Failed to download PDF:", error);
        } finally {
            setIsDownloading(false);
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
                    onClick={handleDownloadPDF}
                    disabled={isDownloading || loading || issues.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    Download Report PDF
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
