"use client";

import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

export default function HistoryRefreshButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.refresh()}
      className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors"
    >
      <RefreshCw size={14} />
      Refresh
    </button>
  );
}
