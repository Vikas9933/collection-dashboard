"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { planTierBadgeClass, sortSubscriptionPlans } from "@/lib/subscriptions/plans";
import { FEATURE_LABELS, featuresForPlanCode } from "@/lib/subscriptions/features";
import type { SubscriptionPlan, SubscriptionPlanCode, TenantSubscriptionContext } from "@/lib/types";
import { SUBSCRIPTION_PLAN_ORDER } from "@/lib/subscriptions/plans";

interface UpgradePlanModalProps {
  context: TenantSubscriptionContext;
  plans: SubscriptionPlan[];
  canChangePlan: boolean;
}

export function UpgradePlanModal({ context, plans, canChangePlan }: UpgradePlanModalProps) {
  const [open, setOpen] = useState(false);
  const tierPlans = sortSubscriptionPlans(plans);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
      >
        <Sparkles className="h-4 w-4" />
        {canChangePlan ? "Change plan" : "Request upgrade"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} aria-hidden />
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Compare subscription plans</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current: <span className="font-semibold text-slate-800">{context.planName}</span>
                  {!canChangePlan && " — contact your platform administrator to upgrade."}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {tierPlans.map((plan) => {
                const isCurrent = plan.code === context.planCode;
                const code = plan.code as SubscriptionPlanCode;
                const highlights = featuresForPlanCode(code).slice(0, 6);
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl border p-4 ${isCurrent ? "border-indigo-400 ring-2 ring-indigo-100" : "border-slate-200"}`}
                  >
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${planTierBadgeClass(plan.code)}`}
                    >
                      {plan.name}
                    </span>
                    {isCurrent && (
                      <p className="mt-2 text-xs font-semibold text-indigo-600">Your current plan</p>
                    )}
                    <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      {plan.max_users} users · {plan.max_storage_mb} MB
                    </p>
                    <ul className="mt-3 space-y-1 text-xs text-slate-600">
                      {highlights.map((key) => (
                        <li key={key}>• {FEATURE_LABELS[key]}</li>
                      ))}
                      {featuresForPlanCode(code).length > 6 && (
                        <li className="text-slate-400">
                          +{featuresForPlanCode(code).length - 6} more features
                        </li>
                      )}
                    </ul>
                  </div>
                );
              })}
            </div>

            {!canChangePlan && (
              <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Client Admins can view usage and request upgrades. Only the Super Admin can change
                plans from the Platform panel.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export { SUBSCRIPTION_PLAN_ORDER };
