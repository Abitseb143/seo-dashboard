import { Zap } from "lucide-react";
import { FixCard } from "@/components/ui/FixCard";
import { getLatestAuditData } from "@/lib/audit-data";

export default async function QuickWinsPage() {
  const latestAudit = await getLatestAuditData();
  const issues = latestAudit?.quickWins ?? [];

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

      {issues.length > 0 ? (
        <div className="space-y-2">
          {issues.map((issue) => (
            <FixCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
          <p className="text-slate-500">No quick wins found yet. Run an audit to generate recommendations.</p>
        </div>
      )}
    </div>
  );
}
