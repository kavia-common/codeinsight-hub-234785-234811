"use client";

import React, { useMemo } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useOrg } from "@/components/OrgContext";
import { getPullRequest } from "@/lib/api/devtrackr";

// PUBLIC_INTERFACE
export function PrDetailClient({ prId }: { prId: string }) {
  /** Client-side PR/MR detail view (data fetching + interactivity). */
  const { activeOrgId } = useOrg();
  const orgId = activeOrgId ?? "";

  const pr = useSWR(
    orgId && prId ? ["pr", orgId, prId] : null,
    async () => getPullRequest({ orgId, prId }),
  );

  const item = useMemo(() => pr.data ?? null, [pr.data]);

  return (
    <div className="stack">
      <header className="card">
        <div className="cardInner stack">
          <div className="row" style={undefined}>
            <Link className="btn" href="/prs">
              ← Back
            </Link>
            <span className="muted small">Detail view</span>
          </div>

          {pr.isLoading ? (
            <div className="muted small">Loading…</div>
          ) : pr.error ? (
            <div className="toast" role="alert">
              Failed to load:{" "}
              {pr.error instanceof Error ? pr.error.message : String(pr.error)}
            </div>
          ) : !item ? (
            <div className="toast" role="alert">
              PR/MR not found.
            </div>
          ) : (
            <>
              <div className="h1">
                <span
                  className={
                    item.provider === "github"
                      ? "badge badgePrimary"
                      : "badge badgeCyan"
                  }
                >
                  {item.provider}
                </span>{" "}
                #{item.number} — {item.title}
              </div>
              <div className="muted small">
                {item.repoFullName} · {item.author} ·{" "}
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </>
          )}
        </div>
      </header>

      {item ? (
        <div className="grid2">
          <section className="card" aria-label="AI summary">
            <div className="cardInner stack">
              <div className="h2">AI Summary</div>
              <p className="muted small">
                {item.summary ??
                  "Placeholder: backend will generate a structured summary from diffs, commits, and discussion."}
              </p>
              <div className="muted small">
                Expected: bullets, impacted modules, tests, rollout notes.
              </div>
            </div>
          </section>

          <section className="card" aria-label="Risk">
            <div className="cardInner stack">
              <div className="h2">Risk</div>
              <div className="row">
                <span className="badge badgeCyan">{item.riskScore ?? 0}</span>
                <span className="muted small">/ 100</span>
              </div>
              <ul className="muted small" style={undefined}>
                {(item.riskNotes ?? [
                  "Placeholder: code churn + surface area",
                  "Placeholder: auth/billing boundaries",
                  "Placeholder: missing tests",
                ]).map((n) => (
                  <li key={n} style={undefined}>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      ) : null}

      <section className="card">
        <div className="cardInner stack">
          <div className="h2">Diff insights (placeholder)</div>
          <div className="muted small">
            This section will show file-level changes, hot spots, and security indicators
            once backend analysis endpoints exist.
          </div>
        </div>
      </section>
    </div>
  );
}
