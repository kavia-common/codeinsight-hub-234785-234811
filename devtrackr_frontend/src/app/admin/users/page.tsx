"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { useOrg } from "@/components/OrgContext";
import { listUsers, updateUserRole } from "@/lib/api/devtrackr";
import type { User, UserRole } from "@/lib/api/types";

const ROLES: UserRole[] = ["owner", "admin", "member", "viewer"];

export default function AdminUsersPage() {
  const { activeOrgId } = useOrg();
  const orgId = activeOrgId ?? "";

  const users = useSWR(orgId ? ["users", orgId] : null, async () => listUsers(orgId));

  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const rows = useMemo(() => users.data ?? [], [users.data]);

  const onChangeRole = async (u: User, role: UserRole) => {
    setBusyId(u.id);
    setToast(null);
    try {
      await updateUserRole({ orgId, userId: u.id, role });
      setToast(`Updated role: ${u.email} → ${role} (placeholder).`);
      void users.mutate();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="stack">
      <header className="card">
        <div className="cardInner stack">
          <div className="h1">Admin · Users & roles</div>
          <p className="muted small">
            UI is ready; backend must enforce RBAC server-side.
          </p>
          {toast ? (
            <div className="toast" role="status" aria-live="polite">
              {toast}
            </div>
          ) : null}
        </div>
      </header>

      <section className="card">
        <div className="cardInner stack">
          <div className="h2">Users</div>
          {users.isLoading ? (
            <div className="muted small">Loading…</div>
          ) : users.error ? (
            <div className="toast" role="alert">
              Failed to load users:{" "}
              {users.error instanceof Error
                ? users.error.message
                : String(users.error)}
            </div>
          ) : rows.length === 0 ? (
            <div className="muted small">No users.</div>
          ) : (
            <table className="table" aria-label="Users table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div>{u.name}</div>
                      <div className="muted small">{u.email}</div>
                    </td>
                    <td>
                      <span className="badge badgePrimary">{u.role}</span>
                    </td>
                    <td>
                      <span className="badge">{u.status}</span>
                    </td>
                    <td>
                      <div className="row">
                        <select
                          className="select"
                          value={u.role}
                          onChange={(e) => onChangeRole(u, e.target.value as UserRole)}
                          disabled={busyId === u.id}
                          aria-label={`Change role for ${u.email}`}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <span className="muted small">
                          {busyId === u.id ? "Saving…" : "—"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
