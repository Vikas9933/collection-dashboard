import { createClient } from "@/lib/supabase/server";

export type AuditAction =
  | "user.create"
  | "user.update"
  | "user.reject"
  | "tenant.delete"
  | "tenant.activate"
  | "tenant.deactivate"
  | "config.update"
  | "upload.accounts"
  | "settlement.approve"
  | "settlement.reject"
  | "field_visit.create"
  | "export.report";

export async function logAudit(params: {
  userId: string;
  tenantId?: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  payload?: Record<string, unknown>;
}) {
  try {
    const supabase = await createClient();
    await supabase.from("audit_logs").insert({
      user_id: params.userId,
      tenant_id: params.tenantId ?? null,
      action: params.action,
      entity: params.entity,
      entity_id: params.entityId ?? null,
      payload: params.payload ?? {},
    });
  } catch {
    // Audit failures must not block primary operations
  }
}
