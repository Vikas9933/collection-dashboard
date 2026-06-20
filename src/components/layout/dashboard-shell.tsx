import { Sidebar, MobileNav } from "@/components/layout/sidebar";
import { formatRole } from "@/lib/format";
import type { DashboardConfig, Profile, SubscriptionFeatureKey, TenantSubscriptionContext } from "@/lib/types";

interface DashboardShellProps {
  children: React.ReactNode;
  profile: Profile | null;
  config: DashboardConfig;
  enabledFeatures?: Record<SubscriptionFeatureKey, boolean>;
  subscriptionContext?: TenantSubscriptionContext | null;
}

export function DashboardShell({
  children,
  profile,
  config,
  enabledFeatures,
  subscriptionContext,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <div className="hidden shrink-0 lg:block">
        <Sidebar
          profile={profile}
          enabledFeatures={enabledFeatures}
          subscriptionContext={subscriptionContext}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MobileNav
                profile={profile}
                enabledFeatures={enabledFeatures}
                subscriptionContext={subscriptionContext}
              />
              <div>
                <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                  {config.dashboardTitle}
                </h1>
                <p className="text-xs text-slate-500 sm:text-sm">
                  {profile?.full_name} · {profile ? formatRole(profile.role) : "User"}
                </p>
              </div>
            </div>
            <div className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:block">
              Live data
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
