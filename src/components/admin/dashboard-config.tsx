"use client";

import { useState, useTransition } from "react";
import { Loader2, Settings2 } from "lucide-react";
import { updateDashboardConfig } from "@/app/dashboard/admin/actions";
import type { DashboardConfig } from "@/lib/types";

interface DashboardConfigPanelProps {
  config: DashboardConfig;
}

export function DashboardConfigPanel({ config }: DashboardConfigPanelProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await updateDashboardConfig(formData);
      if (result.error) setError(result.error);
      else if (result.success) setMessage(result.success);
    });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Settings2 className="h-4 w-4 text-indigo-600" />
        <h3 className="font-semibold text-slate-900">Dashboard Configuration</h3>
      </div>

      {(message || error) && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            error
              ? "border border-rose-200 bg-rose-50 text-rose-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error ?? message}
        </div>
      )}

      <form action={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="dashboardTitle" className="mb-1 block text-sm font-medium text-slate-700">
            Dashboard Title
          </label>
          <input
            id="dashboardTitle"
            name="dashboardTitle"
            defaultValue={config.dashboardTitle}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label htmlFor="kpiTargetPercent" className="mb-1 block text-sm font-medium text-slate-700">
            KPI Target (%)
          </label>
          <input
            id="kpiTargetPercent"
            name="kpiTargetPercent"
            type="number"
            min={0}
            max={100}
            step={0.1}
            defaultValue={config.kpiTargetPercent}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="showWeeklyTrend"
            defaultChecked={config.showWeeklyTrend}
            className="rounded border-slate-300"
          />
          Show weekly collection trend
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="showMonthlyTrend"
            defaultChecked={config.showMonthlyTrend}
            className="rounded border-slate-300"
          />
          Show monthly collection trend
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 md:col-span-2"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save Configuration
        </button>
      </form>
    </div>
  );
}
