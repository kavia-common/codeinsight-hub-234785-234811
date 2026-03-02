"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { useOrg } from "@/components/OrgContext";
import { listRepos, syncRepo } from "@/lib/api/devtrackr";

export default function ReposPage() {
  const { activeOrgId } = useOrg();
  const orgId = activeOrgId ?? "";
  const canLoad = Boolean(orgId);

  const repos = useSWR(canLoad ? ["repos", orgId] : null, async () => listRepos(orgId));
  const [busyRepoId, setBusyRepoId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const items = useMemo(() => repos.data ?? [], [repos.data]);

  const onSync = async (repoId: string) => {
    setBusyRepoId(repoId);
    setToast(null);
    try {
      await syncRepo({ orgId, repoId });
      setToast("Sync triggered (placeholder).");
      void repos.mutate();
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Failed to sync repo");
    } finally {
      setBusyRepoId(null);
    }
  };

  return (
    <div className="stack">
      <header className="card">
        <div className="cardInner stack">
          <div className="h1">Repositories</div>
          <p className="muted small">
            Select and sync repos for analytics. OAuth connect happens in{" "}
            <span className="kbd">Connect</span>.
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
          <div className="h2">Repo list</div>
          {repos.isLoading ? (
            <div className="muted small">Loading…</div>
          ) : repos.error ? (
            <div className="toast" role="alert">
              Failed to load repos (mock fallback should still render).{" "}
              {repos.error instanceof Error
                ? repos.error.message
                : String(repos.error)}
            </div>
          ) : items.length === 0 ? (
            <div className="muted small">No repos found.</div>
          ) : (
            <table className="table" aria-label="Repos table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Repo</th>
                  <th>Status</th>
                  <th style={undefined}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <span className={r.provider === "github" ? "badge badgePrimary" : "badge badgeCyan"}>
                        {r.provider}
                      </span>
                    </td>
                    <td>
                      <div>{r.fullName}</div>
                      <div className="muted small">{r.name}</div>
                    </td>
                    <td>
                      {r.isSynced ? (
                        <span className="badge badgeCyan">synced</span>
                      ) : (
                        <span className="badge">not synced</span>
                      )}
                    </td>
                    <td>
                      <div className="row">
                        <button
                          className="btn btnPrimary"
                          onClick={() => onSync(r.id)}
                          disabled={busyRepoId === r.id}
                        >
                          {busyRepoId === r.id ? "Syncing…" : "Sync"}
                        </button>
                        <span className="muted small">
                          (triggers job; endpoint placeholder)
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
