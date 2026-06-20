import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { AgentPerformance } from "@/lib/types";

interface AgentTableProps {
  agents: AgentPerformance[];
}

export function AgentTable({ agents }: AgentTableProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-slate-900">Agent Performance</h2>
        <p className="mt-0.5 text-sm text-slate-500">
          Agent wise allocation, collection, PTP tracking & ranking
        </p>
      </CardHeader>
      <CardBody className="overflow-x-auto p-0">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Agent Name</th>
              <th className="px-4 py-3 font-medium">Accounts</th>
              <th className="px-4 py-3 font-medium">Collection</th>
              <th className="px-4 py-3 font-medium">Collection %</th>
              <th className="px-4 py-3 font-medium">PTP Count</th>
              <th className="px-4 py-3 font-medium">PTP Amount</th>
              <th className="px-4 py-3 font-medium">Kept</th>
              <th className="px-4 py-3 font-medium">Broken</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-8 text-center text-slate-400">
                  No agent data available
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent.agentId} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3.5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600">
                      {agent.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">{agent.agentName}</td>
                  <td className="px-4 py-3.5 text-slate-600">{agent.allocatedAccounts}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">{formatCurrency(agent.collectedAmount)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      agent.collectionPercentage >= 50 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {formatPercent(agent.collectionPercentage)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{formatNumber(agent.ptpCount)}</td>
                  <td className="px-4 py-3.5 text-slate-600">{formatCurrency(agent.ptpAmount)}</td>
                  <td className="px-4 py-3.5 text-emerald-600">{formatNumber(agent.keptPtp)}</td>
                  <td className="px-4 py-3.5 text-amber-600">{formatNumber(agent.brokenPtp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
