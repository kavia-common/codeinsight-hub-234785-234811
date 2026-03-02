"use client";

import React, { useState } from "react";
import { useOrg } from "@/components/OrgContext";

export default function SettingsPage() {
  const { orgs, activeOrgId } = useOrg();
  const activeOrg = orgs.find((o) => o.id === activeOrgId) ?? null;

  const [displayName, setDisplayName] = useState("Retro User");
  const [email, setEmail] = useState("user@example.com");
  const [toast, setToast] = useState<string | null>(null);

  const onSave = () => {
    setToast("Saved (placeholder). Backend endpoint pending.");
  };

  return (
    <div className="stack">
      <header className="card">
        <div className="cardInner stack">
          <div className="h1">Settings</div>
          <p className="muted small">
            Profile/org settings are placeholders until auth endpoints exist.
          </p>
          {toast ? (
            <div className="toast" role="status" aria-live="polite">
              {toast}
            </div>
          ) : null}
        </div>
      </header>

      <section className="grid2">
        <div className="card">
          <div className="cardInner stack">
            <div className="h2">Profile</div>
            <div>
              <label className="label" htmlFor="name">
                Display name
              </label>
              <input
                id="name"
                className="input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className="btn btnPrimary" onClick={onSave}>
              Save
            </button>
          </div>
        </div>

        <div className="card">
          <div className="cardInner stack">
            <div className="h2">Organization</div>
            <div className="muted small">
              Active org:{" "}
              <span className="badge badgePrimary">{activeOrg?.name ?? "—"}</span>
            </div>
            <div className="muted small">
              This page will later include: invites, SSO, API tokens, webhooks.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
