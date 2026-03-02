"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { useOrg } from "@/components/OrgContext";
import { listPullRequests, listRepos } from "@/lib/api/devtrackr";
import type { Provider } from "@/lib/api/types";

export default function PrListPage() {
  const { activeOrgId } = useOrg();
  const orgId = activeOrgId ?? "";

  const [provider, setProvider] = useState<Provider | "all">("all");
  const [repoId, setRepoId] = useState<string>("");

  const repos = useSWR(orgId ? ["repos", orgId] : null, async () => listRepos(orgId));

  const prs = useSWR(
    orgId ? ["prs", orgId, provider, repoId] : null,
    async () =>
      listPullRequests({
        orgId,
        provider: provider === "all" ? undefined : provider,
        repoId: repoId || undefined,
      }),
  );

  const rows = useMemo(() => prs.data ?? [], [prs.data]);

  return (
    <div className="stack">
      <header className="card">
        <div className="cardInner stack">
          <div className="h1">PR / MR</div>
          <p className="muted small">
            Summary + risk are placeholders. Backend will populate AI outputs and diffs.
          </p>

          <div className="grid2" aria-label="Filters">
            <div>
              <label className="label" htmlFor="provider">
                Provider
              </label>
              <select
                id="provider"
                className="select"
                value={provider}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "all" || value === "github" || value === "gitlab") {
                    setProvider(value);
                  }
                }}
              >
                <option value="all">All</option>
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="repo">
                Repo
              </label>
              <select
                id="repo"
                className="select"
                value={repoId}
                onChange={(e) => setRepoId(e.target.value)}
                disabled={!repos.data || repos.data.length === 0}
              >
                <option value="">All repos</option>
                {(repos.data ?? []).map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <section className="card">
        <div className="cardInner stack">
          <div className="h2">Recent items</div>

          {prs.isLoading ? (
            <div className="muted small">Loading…</div>
          ) : prs.error ? (
            <div className="toast" role="alert">
              Failed to load PR/MR list:{" "}
              {prs.error instanceof Error ? prs.error.message : String(prs.error)}
            </div>
          ) : rows.length === 0 ? (
            <div className="muted small">No PR/MR items found.</div>
          ) : (
            <table className="table" aria-label="PR/MR table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Repo</th>
                  <th>Risk</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="row">
                        <span className={p.provider === "github" ? "badge badgePrimary" : "badge badgeCyan"}>
                          {p.provider}
                        </span>
                        <Link className="badge" href={`/prs/${p.id}`}>
                          #{p.number}
                        </Link>
                        <span className="muted small">{p.author}</span>
                      </div>
                      <div style={undefined}>{p.title}</div>
                      <div className="muted small">
                        {new Date(p.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div>{p.repoFullName}</div>
                    </td>
                    <td>
                      <span className="badge badgeCyan">{p.riskScore ?? 0}</span>
                      <div className="muted small">
                        {p.riskScore && p.riskScore > 70
                          ? "high"
                          : p.riskScore && p.riskScore > 40
                            ? "medium"
                            : "low"}
                      </div>
                    </td>
                    <td className="muted small">{p.summary ?? "—"}</td>
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
