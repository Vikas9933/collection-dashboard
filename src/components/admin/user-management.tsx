"use client";

import { useMemo, useState, useTransition } from "react";
import { CheckCircle2, Clock, Loader2, Plus, Shield, UserCheck, UserX } from "lucide-react";
import { createAdminUser, rejectSignupRequest, updateUserRole } from "@/app/dashboard/admin/actions";
import { creatableRoles } from "@/lib/auth/roles";
import { formatRole, formatDateTime } from "@/lib/format";
import type { AdminUserRow, UserRole } from "@/lib/types";

interface UserManagementProps {
  users: AdminUserRow[];
  agencies: { id: string; name: string }[];
  teams: { id: string; name: string; agency_id: string }[];
  tenants?: { id: string; name: string; slug: string }[];
  hasServiceRole: boolean;
  isSuperAdmin?: boolean;
  actorRole: UserRole;
}

function agencyName(agencies: UserManagementProps["agencies"], id: string | null) {
  if (!id) return "—";
  return agencies.find((a) => a.id === id)?.name ?? "—";
}

function teamName(teams: UserManagementProps["teams"], id: string | null) {
  if (!id) return "—";
  return teams.find((t) => t.id === id)?.name ?? "—";
}

function clientName(tenants: UserManagementProps["tenants"], tenantId: string | null) {
  if (!tenantId) return "Unassigned — no client";
  return tenants?.find((t) => t.id === tenantId)?.name ?? "Unknown client";
}

export function UserManagement({
  users,
  agencies,
  teams,
  tenants = [],
  hasServiceRole,
  isSuperAdmin = false,
  actorRole,
}: UserManagementProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const assignableRoles = useMemo(() => creatableRoles(actorRole), [actorRole]);

  const pendingUsers = useMemo(() => users.filter((u) => !u.is_active), [users]);
  const activeUsers = useMemo(() => users.filter((u) => u.is_active), [users]);

  function handleCreate(formData: FormData) {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await createAdminUser(formData);
      if (result.error) setError(result.error);
      else if (result.success) setMessage(result.success);
    });
  }

  function handleReject(profileId: string, email: string) {
    const confirmed = window.confirm(
      `Reject the sign-up request for ${email}?\n\nTheir account will be removed and they will need to register again.`
    );
    if (!confirmed) return;

    setMessage(null);
    setError(null);
    const formData = new FormData();
    formData.set("profileId", profileId);
    startTransition(async () => {
      const result = await rejectSignupRequest(formData);
      if (result.error) setError(result.error);
      else if (result.success) setMessage(result.success);
    });
  }

  function handleUpdate(formData: FormData, activate = false) {
    setMessage(null);
    setError(null);
    if (activate) {
      formData.set("isActive", "true");
    }
    startTransition(async () => {
      const result = await updateUserRole(formData);
      if (result.error) setError(result.error);
      else if (result.success) setMessage(result.success);
    });
  }

  return (
    <div className="space-y-6">
      {!hasServiceRole && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Add <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code> to enable creating new users
          from this panel. Rejecting sign-up requests also requires it.
        </div>
      )}

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

      {/* Pending approvals — users waiting for admin to grant access */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <h3 className="font-semibold text-slate-900">Pending approvals</h3>
              <p className="text-sm text-slate-600">
                New sign-ups waiting for role, agency, team, and activation
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
            {pendingUsers.length} waiting
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <p className="rounded-lg border border-dashed border-amber-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
            No users waiting for approval.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{user.full_name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                    {isSuperAdmin && (
                      <p className="mt-1 text-sm font-medium text-indigo-700">
                        Client: {clientName(tenants, user.tenant_id)}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-amber-700">
                      Registered {formatDateTime(user.created_at)}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                    Inactive — cannot sign in to dashboard
                  </span>
                </div>

                <form
                  action={(fd) => handleUpdate(fd, true)}
                  className="flex flex-wrap items-end gap-2"
                >
                  <input type="hidden" name="profileId" value={user.id} />
                  <input type="hidden" name="isActive" value="true" />

                  <label className="flex flex-col gap-1 text-xs text-slate-500">
                    Role
                    <select
                      name="role"
                      defaultValue={user.role === "admin" ? "agent" : user.role}
                      required
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-900"
                    >
                      {assignableRoles.filter((r) => r !== "admin").map((role) => (
                        <option key={role} value={role}>
                          {formatRole(role)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs text-slate-500">
                    Agency
                    <select
                      name="agencyId"
                      defaultValue={user.agency_id ?? ""}
                      required
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-900"
                    >
                      <option value="" disabled>
                        Select agency
                      </option>
                      {agencies.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs text-slate-500">
                    Team
                    <select
                      name="teamId"
                      defaultValue={user.team_id ?? ""}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-900"
                    >
                      <option value="">No team (supervisors only)</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserCheck className="h-4 w-4" />
                    )}
                    Approve & grant access
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleReject(user.id, user.email)}
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserX className="h-4 w-4" />
                    )}
                    Reject request
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Create user (pre-approved)</h3>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          {isSuperAdmin
            ? "Select a client, then create an active user for that client."
            : "Creates an active user immediately — no pending approval step."}
        </p>
        <form action={handleCreate} className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {isSuperAdmin && (
            <select
              name="tenantId"
              required
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400 md:col-span-2 xl:col-span-3"
            >
              <option value="">Select client account</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.slug})
                </option>
              ))}
            </select>
          )}
          <input
            name="fullName"
            required
            placeholder="Full name"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Password (6+ chars)"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
          <select
            name="role"
            defaultValue="agent"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          >
            {assignableRoles.map((role) => (
              <option key={role} value={role}>
                {formatRole(role)}
              </option>
            ))}
          </select>
          <select
            name="agencyId"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          >
            <option value="">Select agency</option>
            {agencies.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select
            name="teamId"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          >
            <option value="">Select team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isPending || !hasServiceRole || (isSuperAdmin && tenants.length === 0)}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 md:col-span-2 xl:col-span-3"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Create user
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <Shield className="h-4 w-4 text-indigo-600" />
          <div>
            <h3 className="font-semibold text-slate-900">All users</h3>
            <p className="text-sm text-slate-500">
              {activeUsers.length} active · {pendingUsers.length} pending
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Agency</th>
                <th className="px-4 py-3 font-medium">Team</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    No users yet
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-50 align-top">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{user.full_name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatRole(user.role)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {agencyName(agencies, user.agency_id)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {teamName(teams, user.team_id)}
                    </td>
                    <td className="px-4 py-3">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          <Clock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <form action={(fd) => handleUpdate(fd)} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="profileId" value={user.id} />
                        <select
                          name="role"
                          defaultValue={user.role}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        >
                          {assignableRoles.map((role) => (
                            <option key={role} value={role}>
                              {formatRole(role)}
                            </option>
                          ))}
                        </select>
                        <select
                          name="agencyId"
                          defaultValue={user.agency_id ?? ""}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        >
                          <option value="">No agency</option>
                          {agencies.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                        <select
                          name="teamId"
                          defaultValue={user.team_id ?? ""}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        >
                          <option value="">No team</option>
                          {teams.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                        <select
                          name="isActive"
                          defaultValue={user.is_active ? "true" : "false"}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        >
                          <option value="true">Active</option>
                          <option value="false">Inactive</option>
                        </select>
                        <button
                          type="submit"
                          disabled={isPending}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                          Save
                        </button>
                      </form>
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
