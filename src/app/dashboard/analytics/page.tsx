import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/dashboard";
import { UpgradeGate } from "@/components/subscription/upgrade-gate";
import { requireFeature } from "@/lib/subscriptions/guard";

export const metadata = {
  title: "Advanced Analytics | Collection & Recovery Dashboard",
};

export default async function AnalyticsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();

  try {
    await requireFeature(supabase, profile, "advanced_analytics");
  } catch {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <UpgradeGate featureKey="advanced_analytics" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Advanced Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">
          Pro-tier analytics: target vs achievement, supervisor, team leader, and agent performance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          "Target vs Achievement Dashboard",
          "Supervisor Performance",
          "Team Leader Performance",
          "Agent Performance",
          "Agency Performance Monitoring",
        ].map((title) => (
          <div
            key={title}
            className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm"
          >
            <p className="font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm text-slate-500">
              Connect your existing dashboard KPIs here. Feature gate validated server-side for Pro
              plan.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
