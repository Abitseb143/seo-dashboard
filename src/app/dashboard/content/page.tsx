"use client";

import { useEffect, useState } from "react";
import { FixCard } from "@/components/ui/FixCard";
import { FileText } from "lucide-react";

export default function ContentSEOPage() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFixes() {
            try {
                const res = await fetch("/api/audits/latest");
                const data = await res.json();
                if (data.success && data.contentFixes) {
                    setIssues(data.contentFixes);
                }
            } catch (e) {
                console.error("Failed to load content fixes", e);
            } finally {
                setLoading(false);
            }
        }
        fetchFixes();
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
                <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-md shadow-emerald-200">
                    <FileText size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Content & On-page SEO</h1>
                    <p className="text-slate-600 mt-1">
                        Issues relating to metadata, headings, internal linking, and copy. These fixes usually require a copywriter or CMS editor.
                    </p>
                </div>
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
                    <p className="text-slate-500">No content or on-page SEO issues found. Your copy is fully optimized!</p>
                </div>
            )}
        </div>
    );
}
