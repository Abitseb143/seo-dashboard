import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CheckCircle, Code, Zap } from "lucide-react";
import ScoreTrendChart from "@/components/dashboard/ScoreTrendChart";
import { getLatestAuditData, getScoreTrend } from "@/lib/audit-data";

export default async function OverviewDashboard() {
  const [latestAudit, trend] = await Promise.all([getLatestAuditData(), getScoreTrend()]);

  const stats = latestAudit
    ? {
        score: Math.round(latestAudit.overallScore || 0),
        critical: latestAudit.stats.criticalIssues,
        high: latestAudit.stats.highIssues,
        total: latestAudit.stats.totalIssues,
      }
    : {
        score: 0,
        critical: 0,
        high: 0,
        total: 0,
      };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Overview Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Monitor your SEO health and prioritize the highest-impact fixes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <p className="text-slate-500 font-medium text-sm mb-2">Overall SEO Score</p>
          <div className="text-5xl font-extrabold text-slate-800 flex items-baseline">
            {latestAudit ? stats.score : <span className="text-slate-300">--</span>}
            <span className="text-xl text-slate-400 ml-1">/100</span>
          </div>
          <p className="text-emerald-500 text-sm font-semibold flex items-center mt-3 bg-emerald-50 px-3 py-1 rounded-full">
            <ArrowUpRight size={16} className="mr-1" />
            {latestAudit ? "Latest completed audit" : "Run your first audit"}
          </p>
        </div>

        {[
          {
            label: "Critical Issues",
            value: stats.critical,
            icon: <AlertTriangle className="text-rose-500" />,
            color: "bg-rose-50",
          },
          {
            label: "High Priority",
            value: stats.high,
            icon: <Zap className="text-amber-500" />,
            color: "bg-amber-50",
          },
          {
            label: "Total Issues",
            value: stats.total,
            icon: <Code className="text-blue-500" />,
            color: "bg-blue-50",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${card.color}`}>{card.icon}</div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-800">
                {latestAudit ? card.value : <span className="text-slate-300">--</span>}
              </p>
              <p className="text-slate-500 text-sm font-medium mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-2">
          <h3 className="font-bold text-slate-800 mb-6 text-lg">SEO Score Trend</h3>
          <div className="h-64 w-full">
            <ScoreTrendChart data={trend} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Recommended Steps</h3>
          <div className="flex-1 flex flex-col gap-3">
            <Link
              href="/dashboard/best-fixes"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <CheckCircle size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Review Best Fixes</p>
                  <p className="text-xs text-slate-500">Highest ROI tasks</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-emerald-500" />
            </Link>

            <Link
              href="/dashboard/quick-wins"
              className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Quick Wins (Under 30m)</p>
                  <p className="text-xs text-slate-500">Low effort, high impact</p>
                </div>
              </div>
              <ArrowUpRight size={18} className="text-slate-400 group-hover:text-amber-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
