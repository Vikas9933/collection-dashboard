"use client";

import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { TrendPoint } from "@/lib/types";

interface TrendChartsProps {
  daily: TrendPoint[];
  weekly: TrendPoint[];
  monthly: TrendPoint[];
  achievement: TrendPoint[];
  showWeeklyTrend?: boolean;
  showMonthlyTrend?: boolean;
}

type Tab = "daily" | "weekly" | "monthly" | "achievement";

export function TrendCharts({
  daily,
  weekly,
  monthly,
  achievement,
  showWeeklyTrend = true,
  showMonthlyTrend = true,
}: TrendChartsProps) {
  const [tab, setTab] = useState<Tab>("daily");

  const dataMap: Record<Tab, TrendPoint[]> = { daily, weekly, monthly, achievement };
  const data = dataMap[tab].map((d) => ({
    ...d,
    displayLabel:
      tab === "monthly"
        ? new Date(d.label + "-01").toLocaleDateString("en-IN", { month: "short", year: "2-digit" })
        : new Date(d.label).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  }));

  const tabs: { id: Tab; label: string }[] = [
    { id: "daily", label: "Daily" },
    ...(showWeeklyTrend ? [{ id: "weekly" as Tab, label: "Weekly" }] : []),
    ...(showMonthlyTrend ? [{ id: "monthly" as Tab, label: "Monthly" }] : []),
    { id: "achievement", label: "Achievement %" },
  ];

  const isAchievement = tab === "achievement";

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Collection Trends</h2>
            <p className="mt-0.5 text-sm text-slate-500">Performance analytics over time</p>
          </div>
          <div className="flex rounded-lg bg-slate-100 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  tab === t.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="h-72 w-full">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No data for selected filters
            </div>
          ) : isAchievement ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="displayLabel" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => [formatPercent(Number(v)), "Achievement"]} />
                <Line type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : tab === "monthly" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="displayLabel" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [formatCurrency(Number(v)), "Collected"]} />
                <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="displayLabel" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [formatCurrency(Number(v)), "Collected"]} />
                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={2} fill="url(#trendGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
