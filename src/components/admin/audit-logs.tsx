import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";

interface AuditLogRow {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  created_at: string;
  profiles: { full_name: string; email: string } | null;
}

export function AuditLogsPanel({ logs }: { logs: AuditLogRow[] }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-slate-900">Audit Logs</h3>
        <p className="mt-0.5 text-sm text-slate-500">Recent admin actions, uploads, and configuration changes</p>
      </CardHeader>
      <CardBody className="overflow-x-auto p-0">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Entity</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-slate-400">
                  No audit logs yet. Run migration 009_audit_logs.sql in Supabase.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 text-slate-600">
                    {formatDateTime(log.created_at)}
                  </td>
                  <td className="px-4 py-3 text-slate-900">
                    {log.profiles?.full_name ?? "System"}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{log.action}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {log.entity}
                    {log.entity_id ? ` · ${log.entity_id.slice(0, 8)}…` : ""}
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
