"use client";

import type { SubscriptionPlan, TenantSubscriptionContext } from "@/lib/types";
import { planTierBadgeClass } from "@/lib/subscriptions/plans";
import { UpgradePlanModal } from "./upgrade-plan-modal";
import { PlanComparisonTable } from "./plan-comparison-table";

function UsageBar({ used, limit, label }: { used: number; limit: number; label: string }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const tone = pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">
          {used} / {limit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface SubscriptionPanelProps {
  context: TenantSubscriptionContext;
  plans: SubscriptionPlan[];
  canManagePlan: boolean;
  canRequestUpgrade: boolean;
}

export function SubscriptionPanel({
  context,
  plans,
  canManagePlan,
  canRequestUpgrade,
}: SubscriptionPanelProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm lg:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Current plan</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{context.planName}</p>
          <p className="mt-1 text-sm text-slate-600">{context.organizationName}</p>
          <span
            className={`mt-3 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${planTierBadgeClass(context.planCode)}`}
          >
            {context.planStatus.replace("_", " ")}
          </span>
          <div className="mt-6 space-y-4">
            <UsageBar
              used={context.currentUserCount}
              limit={context.userLimit}
              label="Users"
            />
            <UsageBar
              used={context.currentStorageUsedMb}
              limit={context.storageLimitMb}
              label="Storage (MB)"
            />
          </div>
          <div className="mt-6">
            <UpgradePlanModal
              context={context}
              plans={plans}
              canChangePlan={canManagePlan || canRequestUpgrade}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-slate-900">Usage statistics</h3>
          <p className="mt-1 text-sm text-slate-500">
            Real-time organization usage for billing and limit enforcement.
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <dt className="text-xs font-medium uppercase text-slate-500">Active users</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">{context.currentUserCount}</dd>
              <dd className="text-xs text-slate-500">Limit: {context.userLimit}</dd>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <dt className="text-xs font-medium uppercase text-slate-500">Storage used</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">{context.currentStorageUsedMb} MB</dd>
              <dd className="text-xs text-slate-500">Limit: {context.storageLimitMb} MB</dd>
            </div>
          </dl>
          {!canManagePlan && (
            <p className="mt-4 text-sm text-slate-600">
              Need more seats or storage? Use the compare plans button above and contact your Super
              Admin to upgrade.
            </p>
          )}
        </div>
      </div>

      <PlanComparisonTable plans={plans} currentPlanCode={context.planCode} />
    </div>
  );
}
