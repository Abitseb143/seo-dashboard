"use client";

import { useEffect, useState } from "react";
import { History, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

interface AuditRecord {
    id: string;
    projectName: string;
    date: string;
    score: number;
    issues: number;
    status: string;
}

export default function AuditHistoryPage() {
    const [loading, setLoading] = useState(true);
    const [history, setHistory] = useState<AuditRecord[]>([]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/audits/history");
            const data = await res.json();
            if (data.success && data.history) {
                setHistory(data.history);
            }
        } catch (e) {
            console.error("Failed to load audit history", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            <div className="mb-8 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 flex items-start gap-4 shadow-lg text-white">
                <div className="p-3 bg-slate-700 rounded-xl shadow-md">
                    <History size={24} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Audit History</h1>
                    <p className="text-slate-300 mt-1">
                        Track your SEO progress over time and review past crawler runs.
                    </p>
                </div>
                <button
                    onClick={fetchHistory}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors"
                >
                    <RefreshCw size={14} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
                    ))}
                </div>
            ) : history.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <AlertTriangle size={40} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No audits found yet.</p>
                    <p className="text-slate-400 text-sm mt-1">
                        Enter a URL in the top bar and click &quot;Run Fresh Audit&quot; to get started.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                <th className="p-4">Date Run</th>
                                <th className="p-4">Project</th>
                                <th className="p-4 text-center">Score</th>
                                <th className="p-4 text-center">Issues Found</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {history.map((run, i) => (
                                <tr key={run.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-800 flex items-center gap-2">
                                        {i === 0 ? <CheckCircle size={16} className="text-emerald-500" /> : <History size={16} className="text-slate-400" />}
                                        {formatDate(run.date)}
                                        {i === 0 && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">Latest</span>}
                                    </td>
                                    <td className="p-4 text-slate-600 font-medium">
                                        {run.projectName}
                                    </td>
                                    <td className="p-4 text-center font-bold text-slate-800">
                                        <span className={`px-3 py-1 rounded-full text-sm ${run.score >= 80 ? 'bg-emerald-100 text-emerald-700' : run.score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                                            {run.score}/100
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-slate-600 font-medium">
                                        {run.issues}
                                    </td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1.5 text-slate-600 text-sm">
                                            <span className={`w-2 h-2 rounded-full ${run.status === "COMPLETED" ? "bg-emerald-500" : run.status === "RUNNING" ? "bg-amber-500 animate-pulse" : "bg-rose-500"}`}></span>
                                            {run.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
