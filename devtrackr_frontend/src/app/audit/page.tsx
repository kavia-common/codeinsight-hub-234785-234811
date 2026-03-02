"use client";

import React, { useMemo } from "react";
import useSWR from "swr";
import { useOrg } from "@/components/OrgContext";
import { listAudit } from "@/lib/api/devtrackr";

export default function AuditPage() {
  const { activeOrgId } = useOrg();
  const orgId = activeOrgId ?? "";

  const audit = useSWR(orgId ? ["audit", orgId] : null, async () => listAudit(orgId));
  const rows = useMemo(() => audit.data ?? [], [audit.data]);

  return (
    <div className="stack">
      <header className="card">
        <div className="cardInner stack">
          <div className="h1">Audit log</div>
          <p className="muted small">
            Immutable event trail (connects, sync triggers, role changes, billing actions).
          </p>
        </div>
      </header>

      <section className="card">
        <div className="cardInner stack">
          <div className="h2">Events</div>

          {audit.isLoading ? (
            <div className="muted small">Loading…</div>
          ) : audit.error ? (
            <div className="toast" role="alert">
              Failed to load audit:{" "}
              {audit.error instanceof Error
                ? audit.error.message
                : String(audit.error)}
            </div>
          ) : rows.length === 0 ? (
            <div className="muted small">No events.</div>
          ) : (
            <table className="table" aria-label="Audit table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Actor</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Meta</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id}>
                    <td className="muted small">{new Date(e.ts).toLocaleString()}</td>
                    <td>{e.actor}</td>
                    <td>
                      <span className="badge badgePrimary">{e.action}</span>
                    </td>
                    <td className="muted small">{e.target ?? "—"}</td>
                    <td className="muted small">{e.meta ?? "—"}</td>
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
