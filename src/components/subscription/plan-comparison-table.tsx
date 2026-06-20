import type { SubscriptionPlan, SubscriptionFeatureKey } from "@/lib/types";
import { FEATURE_LABELS, featuresForPlanCode } from "@/lib/subscriptions/features";
import { planTierBadgeClass, sortSubscriptionPlans } from "@/lib/subscriptions/plans";
import type { SubscriptionPlanCode } from "@/lib/subscriptions/plans";

const COMPARISON_FEATURES: SubscriptionFeatureKey[] = [
  "user_management",
  "dashboard",
  "excel_export",
  "advanced_analytics",
  "settlement_tracking",
  "audit_logs",
  "email_notifications",
  "api_integration",
  "webhooks",
  "white_label",
];

export function PlanComparisonTable({
  plans,
  currentPlanCode,
}: {
  plans: SubscriptionPlan[];
  currentPlanCode: string;
}) {
  const tierPlans = sortSubscriptionPlans(plans);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="font-semibold text-slate-900">Plan comparison</h3>
        <p className="text-sm text-slate-500">
          Feature bundles live in the database and can be updated without redeploying code.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase text-slate-500">
              <th className="px-4 py-3 font-medium">Feature</th>
              {tierPlans.map((plan) => (
                <th key={plan.id} className="px-4 py-3 font-medium">
                  <span className={`rounded-full border px-2 py-0.5 ${planTierBadgeClass(plan.code)}`}>
                    {plan.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_FEATURES.map((feature) => (
              <tr key={feature} className="border-b border-slate-50">
                <td className="px-4 py-2.5 text-slate-700">{FEATURE_LABELS[feature]}</td>
                {tierPlans.map((plan) => {
                  const included = featuresForPlanCode(plan.code as SubscriptionPlanCode).includes(
                    feature
                  );
                  const isCurrent = plan.code === currentPlanCode;
                  return (
                    <td
                      key={plan.id}
                      className={`px-4 py-2.5 text-center ${isCurrent ? "bg-indigo-50/50" : ""}`}
                    >
                      {included ? (
                        <span className="font-semibold text-emerald-600">✓</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
