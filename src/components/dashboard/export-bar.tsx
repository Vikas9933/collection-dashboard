"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";

export function ExportBar() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function downloadReport(format: "xlsx" | "csv" | "pdf") {
    setLoading(format);
    setError(null);

    try {
      const params = new URLSearchParams(searchParams.toString());
      params.set("format", format);

      const response = await fetch(`/api/export?${params.toString()}`);
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Export failed.");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="(.+)"/);
      const filename = match?.[1] ?? `collection-report.${format}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div id="reports" className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Download className="h-4 w-4" />
        Export Reports
      </div>

      {error && (
        <p className="w-full text-sm text-rose-600">{error}</p>
      )}

      <button
        type="button"
        onClick={() => downloadReport("csv")}
        disabled={!!loading}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
      >
        {loading === "csv" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4 text-emerald-600" />}
        Full CSV
      </button>
      <button
        type="button"
        onClick={() => downloadReport("xlsx")}
        disabled={!!loading}
        className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-60"
      >
        {loading === "xlsx" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
        Full Excel (.xlsx)
      </button>
      <button
        type="button"
        onClick={() => downloadReport("pdf")}
        disabled={!!loading}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
      >
        {loading === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4 text-indigo-600" />}
        PDF Report
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <FileText className="h-4 w-4 text-slate-500" />
        Print
      </button>
    </div>
  );
}
