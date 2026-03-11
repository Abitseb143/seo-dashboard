"use client";

export function FixCard({ issue }: { issue: any }) {
    const fix = issue.recommendedFix;
    const priorityStr = issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1) + " Priority";

    return (
        <div className="mb-14 text-slate-800 font-sans text-[15px] leading-relaxed">
            {/* Issue header */}
            <div className="flex flex-wrap items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold">{issue.issueTitle}</h3>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full border
                    ${issue.severity === "critical" ? "bg-rose-50 text-rose-700 border-rose-200" :
                        issue.severity === "high" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-blue-50 text-blue-700 border-blue-200"}`}>
                    {priorityStr}
                </span>
                {issue.pageUrl && (
                    <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full font-mono">
                        {issue.pageUrl}
                    </span>
                )}
                {fix?.expectedSEOImpact && (
                    <span className="text-sm font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                        +{fix.expectedSEOImpact} SEO points if fixed
                    </span>
                )}
            </div>

            {/* Plain-English problem */}
            <p className="mb-5 text-slate-600">{issue.problemSummary}</p>

            {/* Where the problem is — code block */}
            {issue.currentState && (
                <div className="mb-5">
                    <p className="font-semibold text-slate-700 mb-1">📍 Where the problem is in your code:</p>
                    <pre className="overflow-x-auto bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 font-mono whitespace-pre-wrap break-words leading-6">
                        {issue.currentState}
                    </pre>
                </div>
            )}

            {/* How to fix — human explanation */}
            <div className="mb-4">
                <p className="font-semibold text-slate-700 mb-1">🔧 How to fix it:</p>
                <p className="text-slate-600">{fix?.recommendedAction}</p>
            </div>

            {/* Exact replacement code */}
            {fix?.bestFixOption && (
                <div className="mb-4">
                    <p className="font-semibold text-slate-700 mb-1">✅ Replace with this exact code:</p>
                    <pre className="overflow-x-auto bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900 font-mono whitespace-pre-wrap break-words leading-6">
                        {fix.bestFixOption}
                    </pre>
                    {fix?.expectedSEOImpact && (
                        <p className="mt-3 font-semibold text-emerald-700 text-sm">
                            ⭐ Applying this fix will add <strong>{fix.expectedSEOImpact} points</strong> to your SEO score.
                        </p>
                    )}
                </div>
            )}

            {/* Why it matters */}
            <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="font-semibold text-blue-900 mb-1">💡 Why this matters for your rankings:</p>
                <p className="text-blue-800 whitespace-pre-wrap text-sm">{issue.whyItMatters}</p>
            </div>

            <hr className="mt-10 border-slate-200" />
        </div>
    );
}
