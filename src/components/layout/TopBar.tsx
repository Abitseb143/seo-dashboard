"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Link as LinkIcon } from "lucide-react";

export default function TopBar() {
    const router = useRouter();
    const [isRunning, setIsRunning] = useState(false);
    const [targetUrl, setTargetUrl] = useState("");

    const handleRunAudit = async () => {
        if (!targetUrl) return;
        
        // Normalize URL: Ensure it starts with a protocol
        let normalizedUrl = targetUrl.trim();
        if (!/^https?:\/\//i.test(normalizedUrl)) {
            normalizedUrl = `https://${normalizedUrl}`;
        }
        
        setIsRunning(true);
        try {
            const res = await fetch("/api/audits/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetUrls: [normalizedUrl],
                    projectName: (() => {
                        try {
                            return new URL(normalizedUrl).hostname;
                        } catch (e) {
                            return normalizedUrl.replace(/^https?:\/\//i, '').split('/')[0] || "SEO Project";
                        }
                    })()
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to start audit. Check your internet connection.");
            }

            // Refresh current dashboard view
            router.refresh();
            window.location.reload();
        } catch (error: any) {
            console.error("Failed to run audit:", error);
            // If it's a server error, we try to show the specific details if available
            alert(`Audit Error: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    let displayDomain = "SEO Project";
    try {
        if (targetUrl) displayDomain = new URL(targetUrl).hostname;
    } catch (e) { }

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-800">{displayDomain}</h2>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                    Active
                </span>
            </div>
            <div className="flex items-center gap-4 flex-1 justify-end">
                <div className="relative group max-w-xs w-full hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <LinkIcon size={16} />
                    </div>
                    <input
                        type="url"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="Enter website URL..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-sm"
                    />
                </div>



                <button
                    onClick={handleRunAudit}
                    disabled={isRunning || !targetUrl}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm shadow-emerald-200 disabled:opacity-75 disabled:cursor-not-allowed shrink-0"
                >
                    {isRunning && <Loader2 size={16} className="animate-spin" />}
                    {isRunning ? "Running Audit..." : "Run Fresh Audit"}
                </button>
                <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold ml-2 shrink-0">
                    A
                </div>
            </div>
        </header>
    );
}
