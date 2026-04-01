import DownloadPDFButton from "@/components/ui/DownloadPDFButton";
import { FixCard } from "@/components/ui/FixCard";
import { getLatestAuditData } from "@/lib/audit-data";

export const dynamic = "force-dynamic";

export default async function BestFixesPage() {
  const latestAudit = await getLatestAuditData();
  const issues = latestAudit?.bestFixes ?? [];
  const projectName = latestAudit?.project.name || latestAudit?.project.url || "SEO Audit Results";

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8 flex justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Best Fixes</h1>
          <p className="text-slate-500 mt-2">
            Ranked from highest impact to lowest impact. Prioritize these to improve your SEO score efficiently.
          </p>
        </div>
        <DownloadPDFButton issues={issues} projectName={projectName} />
      </div>

      {issues.length > 0 ? (
        <div className="space-y-2">
          {issues.map((issue) => (
            <FixCard key={issue.id} issue={issue} />
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
