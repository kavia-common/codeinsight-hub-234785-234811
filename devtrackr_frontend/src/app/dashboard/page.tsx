"use client";

import React, { useMemo } from "react";
import useSWR from "swr";
import { useOrg } from "@/components/OrgContext";
import { listPullRequests, listRepos } from "@/lib/api/devtrackr";

export default function DashboardPage() {
  const { activeOrgId } = useOrg();

  const orgId = activeOrgId ?? "";
  const canLoad = Boolean(orgId);

  const repos = useSWR(
    canLoad ? ["repos", orgId] : null,
    async () => listRepos(orgId),
  );

  const prs = useSWR(
    canLoad ? ["prs", orgId] : null,
    async () => listPullRequests({ orgId }),
  );

  const metrics = useMemo(() => {
    const repoCount = repos.data?.length ?? 0;
    const synced = repos.data?.filter((r) => r.isSynced).length ?? 0;

    const prCount = prs.data?.length ?? 0;
    const avgRisk =
      prCount > 0
        ? Math.round(
            (prs.data?.reduce((sum, p) => sum + (p.riskScore ?? 0), 0) ?? 0) /
              prCount,
          )
        : 0;

    return { repoCount, synced, prCount, avgRisk };
  }, [repos.data, prs.data]);

  return (
    <div className="stack">
      <header className="card">
        <div className="cardInner stack">
          <div className="h1">Dashboard</div>
          <div className="muted small">
            Live analytics cards (AI summary/risk placeholders until backend/AI is ready).
          </div>
        </div>
      </header>

      <section className="grid2" aria-label="Metrics">
        <div className="card">
          <div className="cardInner stack">
            <div className="h2">Repos</div>
            <div className="row">
              <span className="badge badgePrimary">{metrics.repoCount}</span>
              <span className="muted small">total</span>
            </div>
            <div className="row">
              <span className="badge badgeCyan">{metrics.synced}</span>
              <span className="muted small">synced</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="cardInner stack">
            <div className="h2">PR/MR</div>
            <div className="row">
              <span className="badge badgePrimary">{metrics.prCount}</span>
              <span className="muted small">recent</span>
            </div>
            <div className="row">
              <span className="badge badgeCyan">{metrics.avgRisk}</span>
              <span className="muted small">avg risk</span>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="cardInner stack">
          <div className="h2">Status</div>
          <div className="muted small">
            {repos.isLoading || prs.isLoading
              ? "Loading data…"
              : repos.error || prs.error
                ? "Using mock mode (backend unavailable or endpoints not implemented)."
                : "Connected to backend endpoints."}
          </div>
          <hr className="hr" />
          <div className="muted small">
            Next up: commit analytics, team velocity, risk trendline, webhook status.
          </div>
        </div>
      </section>
    </div>
  );
}
