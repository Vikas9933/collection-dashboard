"use client";

import { useState, useTransition } from "react";
import { Building2, Copy, Loader2, Plus, Trash2 } from "lucide-react";
import { createTenant, deactivateTenant, removeTenant } from "@/app/dashboard/admin/actions";
import type { Tenant } from "@/lib/types";

export function TenantManagement({ tenants }: { tenants: Tenant[] }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<{ error?: string; success?: string }>) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) setError(result.error);
      else if (result.success) setMessage(result.success);
    });
  }

  function handleCreate(formData: FormData) {
    run(async () => createTenant(formData));
  }

  function handleDelete(tenantId: string, tenantName: string, slug: string) {
    if (slug === "default") return;
    const confirmed = window.confirm(
      `Permanently delete "${tenantName}"?\n\nThis removes all portfolio data and deletes every user linked to this client. This cannot be undone.`
    );
    if (!confirmed) return;

    const formData = new FormData();
    formData.set("tenantId", tenantId);
    run(async () => removeTenant(formData));
  }

  function copySignupLink(slug: string) {
    const url = `${window.location.origin}/signup?tenant=${slug}`;
    void navigator.clipboard.writeText(url);
    setMessage(`Copied sign-up link for ${slug}`);
  }

  return (
    <div className="space-y-6">
      {(message || error) && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            error
              ? "border border-rose-200 bg-rose-50 text-rose-700"
              : "border border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error ?? message}
        </div>
      )}

      <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Create client account</h3>
        </div>
        <p className="mb-4 text-sm text-slate-600">
          Each client gets isolated data. Users sign up with a client-specific link.
        </p>
        <form action={handleCreate} className="flex flex-wrap gap-3">
          <input
            name="name"
            required
            placeholder="Client name (e.g. Acme Collections)"
            className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
          <input
            name="slug"
            required
            placeholder="slug (e.g. acme-collections)"
            pattern="[a-z0-9-]+"
            className="min-w-[180px] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create client
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <Building2 className="h-4 w-4 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Client accounts ({tenants.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Sign-up link</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    No clients yet. Create one above.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b border-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{tenant.name}</td>
                    <td className="px-4 py-3 text-slate-600">{tenant.slug}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          tenant.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {tenant.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => copySignupLink(tenant.slug)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        /signup?tenant={tenant.slug}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <form
                          action={(fd) => run(async () => deactivateTenant(fd))}
                        >
                          <input type="hidden" name="tenantId" value={tenant.id} />
                          <input
                            type="hidden"
                            name="isActive"
                            value={tenant.is_active ? "false" : "true"}
                          />
                          <button
                            type="submit"
                            disabled={isPending || tenant.slug === "default"}
                            className="text-xs font-medium text-slate-600 hover:text-indigo-600 disabled:opacity-50"
                          >
                            {tenant.is_active ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                        <button
                          type="button"
                          disabled={isPending || tenant.slug === "default"}
                          onClick={() => handleDelete(tenant.id, tenant.name, tenant.slug)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
