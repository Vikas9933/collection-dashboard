import { Suspense } from "react";
import {
  Briefcase,
  CircleDollarSign,
  HandCoins,
  Percent,
  UserCheck,
  Users,
  Wallet,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { TrendCharts } from "@/components/dashboard/trend-charts";
import { BucketChart } from "@/components/dashboard/bucket-chart";
import { BucketCards } from "@/components/dashboard/bucket-cards";
import { AgentTable } from "@/components/dashboard/agent-table";
import { TeamTable } from "@/components/dashboard/team-table";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { CustomerSearch } from "@/components/dashboard/customer-search";
import { FieldVisitsTable } from "@/components/dashboard/field-visits-table";
import { SettlementsTable } from "@/components/dashboard/settlements-table";
import { ExportBar } from "@/components/dashboard/export-bar";
import {
  getAgentPerformance,
  getAchievementTrend,
  getBucketPerformance,
  getCollectionTrends,
  getCurrentProfile,
  getDashboardKpis,
  getFieldVisits,
  getFilterOptions,
  getSettlements,
  getTeamPerformance,
  parseFilters,
  searchCustomers,
} from "@/lib/dashboard";
import { getDashboardConfig } from "@/app/dashboard/admin/actions";
import { getAccountsForFieldVisit } from "@/app/dashboard/actions";
import { canApproveSettlement, canExport } from "@/lib/auth/permissions";
import { formatCurrency, formatNumber, formatPercent, formatRole } from "@/lib/format";
import type { DashboardConfig } from "@/lib/types";

interface DashboardPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function FiltersSkeleton() {
  return <div className="h-24 animate-pulse rounded-xl bg-slate-200" />;
}

async function DashboardContent({
  filters,
  searchQuery,
  config,
  showExport,
  showSettlementActions,
}: {
  filters: ReturnType<typeof parseFilters>;
  searchQuery?: string;
  config: DashboardConfig;
  showExport: boolean;
  showSettlementActions: boolean;
}) {
  const [
    kpis,
    trends,
    achievement,
    buckets,
    agents,
    teams,
    visits,
    settlements,
    customers,
    accounts,
    profile,
  ] = await Promise.all([
    getDashboardKpis(filters),
    getCollectionTrends(filters),
    getAchievementTrend(filters),
    getBucketPerformance(filters),
    getAgentPerformance(filters),
    getTeamPerformance(filters),
    getFieldVisits(),
    getSettlements(),
    searchQuery ? searchCustomers(searchQuery) : Promise.resolve([]),
    getAccountsForFieldVisit(),
    getCurrentProfile(),
  ]);

  return (
    <div className="space-y-8">
      {/* §2 Dashboard Overview — KPI Cards */}
      <section id="overview">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Dashboard Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
          <KpiCard title="Accounts Allocated" value={formatNumber(kpis.totalAccounts)} icon={Briefcase} accent="indigo" />
          <KpiCard title="Outstanding Amount" value={formatCurrency(kpis.totalOutstanding)} icon={Wallet} accent="rose" />
          <KpiCard title="Collection Amount" value={formatCurrency(kpis.totalCollected)} icon={CircleDollarSign} accent="emerald" />
          <KpiCard title="Collection %" value={formatPercent(kpis.collectionPercentage)} icon={Percent} accent="sky" />
          <KpiCard title="PTP Count" value={formatNumber(kpis.ptpCount)} icon={HandCoins} accent="violet" />
          <KpiCard title="PTP Amount" value={formatCurrency(kpis.ptpAmount)} icon={HandCoins} accent="violet" />
          <KpiCard title="Kept PTP" value={formatNumber(kpis.keptPtp)} icon={CheckCircle2} accent="emerald" />
          <KpiCard title="Broken PTP" value={formatNumber(kpis.brokenPtp)} icon={XCircle} accent="amber" />
          <KpiCard title="Active Agents" value={formatNumber(kpis.activeAgents)} icon={UserCheck} accent="indigo" />
          <KpiCard title="Active Teams" value={formatNumber(kpis.activeTeams)} icon={Users} accent="sky" />
        </div>
      </section>

      {/* §4 Performance Analytics */}
      <section id="analytics">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Performance Analytics
        </h2>
        <div className="grid gap-6 xl:grid-cols-2">
          <TrendCharts
            daily={trends.daily}
            weekly={trends.weekly}
            monthly={trends.monthly}
            achievement={achievement}
            showWeeklyTrend={config.showWeeklyTrend}
            showMonthlyTrend={config.showMonthlyTrend}
          />
          <div id="buckets">
            <BucketChart data={buckets.filter((b) => b.accountCount > 0)} />
          </div>
        </div>
      </section>

      {/* §7 Bucket Analysis */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Bucket Analysis (B1 – B6+)
        </h2>
        <BucketCards data={buckets} />
      </section>

      {/* §5 Agent Performance */}
      <section id="agents">
        <AgentTable agents={agents} />
      </section>

      {/* §6 Team Performance */}
      <section id="teams">
        <TeamTable teams={teams} />
      </section>

      {/* §8 Customer Search */}
      <section>
        <CustomerSearch results={customers} />
      </section>

      {/* §9 Field Visit Tracking */}
      <section>
        <FieldVisitsTable visits={visits} accounts={accounts} />
      </section>

      {/* §10 Settlement Tracker */}
      <section>
        <SettlementsTable settlements={settlements} canApprove={showSettlementActions} />
      </section>

      {/* §11 Report Section */}
      {showExport && (
        <section>
          <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-slate-200" />}>
            <ExportBar />
          </Suspense>
        </section>
      )}
    </div>
  );
}

async function FiltersSection() {
  const options = await getFilterOptions();
  return <FilterBar {...options} />;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const [profile, config] = await Promise.all([getCurrentProfile(), getDashboardConfig()]);
  const filters = parseFilters(params);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white px-5 py-4">
        <p className="text-sm text-indigo-900">
          Welcome back,{" "}
          <span className="font-semibold">{profile?.full_name}</span>
          {profile && (
            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {formatRole(profile.role)}
            </span>
          )}
          . Monitor collection performance, PTP tracking, and team productivity.
          {" "}KPI target: <span className="font-semibold">{config.kpiTargetPercent}%</span>
        </p>
      </div>

      {/* §3 Dashboard Filters */}
      <Suspense fallback={<FiltersSkeleton />}>
        <FiltersSection />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200" />
            ))}
          </div>
        }
      >
        <DashboardContent
          filters={filters}
          searchQuery={params.q}
          config={config}
          showExport={profile ? canExport(profile) : false}
          showSettlementActions={profile ? canApproveSettlement(profile) : false}
        />
      </Suspense>
    </div>
  );
}
