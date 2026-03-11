"use client";

import { useEffect, useState } from "react";
import { FixCard } from "@/components/ui/FixCard";
import { Zap } from "lucide-react";

export default function QuickWinsPage() {
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFixes() {
            try {
                const res = await fetch("/api/audits/latest");
                const data = await res.json();
                if (data.success && data.quickWins) {
                    setIssues(data.quickWins);
                }
            } catch (e) {
                console.error("Failed to load quick wins", e);
            } finally {
                setLoading(false);
            }
        }
        fetchFixes();
    }, []);

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 bg-opacity-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                <div className="p-3 bg-amber-500 rounded-xl text-white shadow-md shadow-amber-200">
                    <Zap size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Quick Wins</h1>
                    <p className="text-slate-600 mt-1">
                        Low effort, high impact changes you can make in under 30 minutes to boost your rankings immediately.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
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
                    <p className="text-slate-500">No quick wins found. That usually means your site is already quite optimized!</p>
                </div>
            )}
        </div>
    );
}
