import { FileText } from "lucide-react";
import { FixCard } from "@/components/ui/FixCard";
import { getLatestAuditData } from "@/lib/audit-data";

export const dynamic = "force-dynamic";

export default async function ContentSEOPage() {
  const latestAudit = await getLatestAuditData();
  const issues = latestAudit?.contentFixes ?? [];

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 flex items-start gap-4">
        <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-md shadow-emerald-200">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Content &amp; On-page SEO</h1>
          <p className="text-slate-600 mt-1">
            Issues relating to metadata, headings, internal linking, and copy. These fixes usually require a copywriter or CMS editor.
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
          <p className="text-slate-500">No content or on-page SEO issues found. Your copy is fully optimized!</p>
        </div>
      )}
    </div>
  );
}
