import { Card, CardBody } from "@/components/ui/card";
import { formatBucket, formatCurrency, formatPercent } from "@/lib/format";
import type { BucketPerformance } from "@/lib/types";

interface BucketCardsProps {
  data: BucketPerformance[];
}

const bucketColors: Record<string, string> = {
  B1: "border-emerald-200 bg-emerald-50",
  B2: "border-sky-200 bg-sky-50",
  B3: "border-indigo-200 bg-indigo-50",
  B4: "border-amber-200 bg-amber-50",
  B5: "border-orange-200 bg-orange-50",
  B6_PLUS: "border-rose-200 bg-rose-50",
};

export function BucketCards({ data }: BucketCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {data.map((bucket) => (
        <Card
          key={bucket.bucket}
          className={`${bucketColors[bucket.bucket] ?? "border-slate-200"} transition-shadow hover:shadow-md`}
        >
          <CardBody>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-900">
                {formatBucket(bucket.bucket)}
              </span>
              <span className="text-xs text-slate-500">{bucket.accountCount} accts</span>
            </div>
            <div className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Allocation</span>
                <span className="font-medium text-slate-800">{formatCurrency(bucket.allocated)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Collection</span>
                <span className="font-medium text-slate-800">{formatCurrency(bucket.collected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Achievement</span>
                <span className="font-semibold text-indigo-600">{formatPercent(bucket.achievement)}</span>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/80">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${Math.min(bucket.achievement, 100)}%` }}
              />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
