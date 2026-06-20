"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { formatBucket, formatCurrency } from "@/lib/format";
import type { BucketPerformance } from "@/lib/types";

interface BucketChartProps {
  data: BucketPerformance[];
}

export function BucketChart({ data }: BucketChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    label: formatBucket(d.bucket),
  }));

  return (
    <Card className="h-full">
      <CardHeader>
        <h2 className="text-base font-semibold text-slate-900">Bucket Analysis</h2>
        <p className="mt-0.5 text-sm text-slate-500">Collection by delinquency bucket</p>
      </CardHeader>
      <CardBody>
        <div className="h-72 w-full">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No bucket data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === "collected" ? "Collected" : "Allocated",
                  ]}
                  contentStyle={{
                    borderRadius: "0.75rem",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="allocated" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="allocated" />
                <Bar dataKey="collected" fill="#4f46e5" radius={[4, 4, 0, 0]} name="collected" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
