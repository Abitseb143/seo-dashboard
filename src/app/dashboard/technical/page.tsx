import { Code } from "lucide-react";
import { FixCard } from "@/components/ui/FixCard";
import { getLatestAuditData } from "@/lib/audit-data";

export default async function TechnicalSEOPage() {
  const latestAudit = await getLatestAuditData();
  const issues = latestAudit?.technicalFixes ?? [];

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-start gap-4">
        <div className="p-3 bg-blue-500 rounded-xl text-white shadow-md shadow-blue-200">
          <Code size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Technical SEO</h1>
          <p className="text-slate-600 mt-1">
            Issues affecting crawlability, indexation, speed, and architecture. These typically require developer assistance.
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
          <p className="text-slate-500">Great job! No technical SEO issues found.</p>
        </div>
      )}
    </div>
  );
}
