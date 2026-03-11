"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Zap, Code, AlertTriangle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", score: 65 },
  { name: "Tue", score: 68 },
  { name: "Wed", score: 66 },
  { name: "Thu", score: 85 }, // Simulated audit result and fix
  { name: "Fri", score: 88 },
];

export default function OverviewDashboard() {
  const [stats, setStats] = useState({ score: 0, critical: 0, high: 0, total: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function fetchStats() {
      try {
        const res = await fetch("/api/audits/latest");
        const json = await res.json();
        if (json.success && json.stats) {
          setStats({
            score: Math.round(json.overallScore || 0),
            critical: json.stats.criticalIssues || 0,
            high: json.allIssues?.filter((i: any) => i.severity === "high").length || 0,
            total: json.stats.totalIssues || 0,
          });
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Overview Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Monitor your SEO health and prioritize the highest-impact fixes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Score Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
          <p className="text-slate-500 font-medium text-sm mb-2">Overall SEO Score</p>
          <div className="text-5xl font-extrabold text-slate-800 flex items-baseline">
            {stats.score || <span className="animate-pulse">--</span>}
            <span className="text-xl text-slate-400 ml-1">/100</span>
          </div>
          <p className="text-emerald-500 text-sm font-semibold flex items-center mt-3 bg-emerald-50 px-3 py-1 rounded-full">
            <ArrowUpRight size={16} className="mr-1" /> +14 since last week
          </p>
        </div>

        {/* Stats Cards */}
        {[
          { label: "Critical Issues", value: stats.critical, icon: <AlertTriangle className="text-rose-500" />, color: "bg-rose-50" },
          { label: "High Priority", value: stats.high, icon: <Zap className="text-amber-500" />, color: "bg-amber-50" },
          { label: "Total Issues", value: stats.total, icon: <Code className="text-blue-500" />, color: "bg-blue-50" },
        ].map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${card.color}`}>{card.icon}</div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-800">{card.value || <span className="animate-pulse">--</span>}</p>
              <p className="text-slate-500 text-sm font-medium mt-1">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 col-span-2">
          <h3 className="font-bold text-slate-800 mb-6 text-lg">SEO Score Trend</h3>
          <div className="h-64 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} dx={-10} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : null}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Recommended Steps</h3>
          <div className="flex-1 flex flex-col gap-3">
            <Link href="/dashboard/best-fixes" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group">
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

            <Link href="/dashboard/quick-wins" className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-all group">
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
