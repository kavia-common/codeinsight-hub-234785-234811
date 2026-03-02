"use client";

import React, { useMemo, useState } from "react";
import { connectProvider, healthCheck } from "@/lib/api/devtrackr";
import type { Provider } from "@/lib/api/types";

type ConnectState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "ready"; backendOk: boolean }
  | { status: "connecting"; provider: Provider }
  | { status: "error"; message: string };

function ProviderCard({
  provider,
  onConnect,
  disabled,
}: {
  provider: Provider;
  onConnect: (p: Provider) => void;
  disabled: boolean;
}) {
  const title = provider === "github" ? "GitHub" : "GitLab";
  const hint =
    provider === "github"
      ? "OAuth app + repo access"
      : "OAuth app + groups/projects";

  return (
    <section className="card" aria-label={`${title} connect`}>
      <div className="cardInner stack">
        <div className="row">
          <span className="badge badgePrimary">{title}</span>
          <span className="muted small">{hint}</span>
        </div>
        <p className="muted small">
          Connect {title} to sync repos, analyze PR/MR changes, and populate
          dashboards. (Backend routes may be pending; this UX is wired for them.)
        </p>
        <button
          className="btn btnPrimary"
          onClick={() => onConnect(provider)}
          disabled={disabled}
        >
          Connect {title}
        </button>
      </div>
    </section>
  );
}

export default function ConnectPage() {
  const [state, setState] = useState<ConnectState>({ status: "idle" });

  const canClick = useMemo(
    () => state.status !== "connecting" && state.status !== "checking",
    [state.status],
  );

  const onCheckBackend = async () => {
    setState({ status: "checking" });
    const ok = await healthCheck();
    setState({ status: "ready", backendOk: ok });
  };

  const onConnect = async (provider: Provider) => {
    setState({ status: "connecting", provider });
    try {
      const { url } = await connectProvider(provider);
      // In production, backend would return an actual URL; we attempt redirect when available.
      if (url && url !== "#") {
        window.location.href = url;
        return;
      }
      setState({
        status: "error",
        message:
          "OAuth start URL not available yet (placeholder). Backend endpoint expected at /oauth/{provider}/start.",
      });
    } catch (e) {
      setState({
        status: "error",
        message: e instanceof Error ? e.message : "Failed to start OAuth flow",
      });
    }
  };

  return (
    <div className="stack">
      <header className="card">
        <div className="cardInner stack">
          <div className="h1">Connect providers</div>
          <p className="muted">
            Retro flow: <span className="kbd">connect → select org → pick repos</span>.
          </p>

          <div className="row">
            <button className="btn" onClick={onCheckBackend} disabled={!canClick}>
              Check backend
            </button>
            {state.status === "ready" ? (
              <span className={state.backendOk ? "badge badgeCyan" : "badge badgeDanger"}>
                {state.backendOk ? "backend reachable" : "backend unreachable (mock mode)"}
              </span>
            ) : null}
          </div>

          {state.status === "error" ? (
            <div className="toast" role="alert">
              {state.message}
            </div>
          ) : null}
        </div>
      </header>

      <div className="grid2">
        <ProviderCard provider="github" onConnect={onConnect} disabled={!canClick} />
        <ProviderCard provider="gitlab" onConnect={onConnect} disabled={!canClick} />
      </div>
    </div>
  );
}
