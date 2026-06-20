import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { FieldVisitForm } from "@/components/dashboard/field-visit-form";
import { formatCurrency } from "@/lib/format";
import type { AccountOption, FieldVisitRow } from "@/lib/types";

interface FieldVisitsTableProps {
  visits: FieldVisitRow[];
  accounts: AccountOption[];
}

function BoolBadge({ value, yes = "Yes", no = "No" }: { value: boolean; yes?: string; no?: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
      value ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
    }`}>
      {value ? yes : no}
    </span>
  );
}

export function FieldVisitsTable({ visits, accounts }: FieldVisitsTableProps) {
  return (
    <Card id="visits">
      <CardHeader>
        <h2 className="text-base font-semibold text-slate-900">Field Visit Tracking</h2>
        <p className="mt-0.5 text-sm text-slate-500">Record visits and view history with PTP and settlement interest</p>
      </CardHeader>
      <FieldVisitForm accounts={accounts} />
      <CardBody className="overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Visit Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Loan No.</th>
              <th className="px-4 py-3 font-medium">Agent</th>
              <th className="px-4 py-3 font-medium">Met</th>
              <th className="px-4 py-3 font-medium">PTP</th>
              <th className="px-4 py-3 font-medium">PTP Amt</th>
              <th className="px-4 py-3 font-medium">Settlement</th>
              <th className="px-4 py-3 font-medium">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {visits.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-8 text-center text-slate-400">No field visits recorded</td>
              </tr>
            ) : (
              visits.map((v) => (
                <tr key={v.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-4 py-3.5 text-slate-600">{v.visitDate}</td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">{v.customerName}</td>
                  <td className="px-4 py-3.5 text-slate-600">{v.loanNumber}</td>
                  <td className="px-4 py-3.5 text-slate-600">{v.agentName}</td>
                  <td className="px-4 py-3.5"><BoolBadge value={v.customerMet} /></td>
                  <td className="px-4 py-3.5"><BoolBadge value={v.promiseToPay} /></td>
                  <td className="px-4 py-3.5 text-slate-600">{v.ptpAmount ? formatCurrency(v.ptpAmount) : "—"}</td>
                  <td className="px-4 py-3.5"><BoolBadge value={v.settlementInterest} /></td>
                  <td className="max-w-[180px] truncate px-4 py-3.5 text-slate-500">{v.remarks ?? "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}
