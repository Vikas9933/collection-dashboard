import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { TeamPerformance } from "@/lib/types";

interface TeamTableProps {
  teams: TeamPerformance[];
}

export function TeamTable({ teams }: TeamTableProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-slate-900">Team Performance</h2>
        <p className="mt-0.5 text-sm text-slate-500">Team leader wise allocation & collection</p>
      </CardHeader>
      <CardBody className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-medium">Rank</th>
              <th className="px-5 py-3 font-medium">Team Leader</th>
              <th className="px-5 py-3 font-medium">Team Size</th>
              <th className="px-5 py-3 font-medium">Allocation</th>
              <th className="px-5 py-3 font-medium">Collection</th>
              <th className="px-5 py-3 font-medium">Achievement %</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-slate-400">No team data available</td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.teamId} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-5 py-3.5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">
                      {team.rank}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">{team.teamLeaderName}</td>
                  <td className="px-5 py-3.5 text-slate-600">{team.teamSize}</td>
                  <td className="px-5 py-3.5 text-slate-600">{formatCurrency(team.allocation)}</td>
                  <td className="px-5 py-3.5 font-medium text-slate-900">{formatCurrency(team.collection)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      team.achievement >= 50 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {formatPercent(team.achievement)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
