"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";
import { useOrg } from "@/components/OrgContext";

type NavItem = { href: string; label: string; hint: string };

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      className="card"
      style={undefined}
      aria-current={active ? "page" : undefined}
    >
      <div className="cardInner">
        <div className="row" style={undefined}>
          <span className={active ? "badge badgePrimary" : "badge"}>{item.label}</span>
          <span className="muted small">{item.hint}</span>
        </div>
      </div>
    </Link>
  );
}

// PUBLIC_INTERFACE
export function AppShell({ children }: { children: React.ReactNode }) {
  /** Main app chrome: sidebar + content area. */
  const { orgs, activeOrgId, setActiveOrgId, loading, error } = useOrg();

  const nav: NavItem[] = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard", hint: "analytics + status" },
      { href: "/repos", label: "Repos", hint: "sync + selection" },
      { href: "/prs", label: "PR/MR", hint: "summary + risk" },
      { href: "/admin/users", label: "Admin", hint: "users + roles" },
      { href: "/audit", label: "Audit", hint: "events + trails" },
      { href: "/settings/billing", label: "Billing", hint: "plans + seats" },
      { href: "/settings", label: "Settings", hint: "profile + org" },
    ],
    [],
  );

  return (
    <div className="appShell">
      <aside className="sidebar" aria-label="Sidebar">
        <div className="stack">
          <div className="card">
            <div className="cardInner stack">
              <div>
                <div className="h1">DevTrackr</div>
                <div className="muted small">retro analytics console</div>
              </div>

              <hr className="hr" />

              <div className="stack">
                <div>
                  <label className="label" htmlFor="orgSelect">
                    Active org
                  </label>
                  <select
                    id="orgSelect"
                    className="select"
                    value={activeOrgId ?? ""}
                    onChange={(e) => setActiveOrgId(e.target.value)}
                    disabled={loading || !!error || orgs.length === 0}
                  >
                    {orgs.length === 0 ? (
                      <option value="">No orgs</option>
                    ) : (
                      orgs.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))
                    )}
                  </select>
                  {error ? <div className="toast" style={undefined}>{error}</div> : null}
                </div>

                <div className="row">
                  <span className="kbd">TIP</span>
                  <span className="muted small">
                    Configure <span className="kbd">NEXT_PUBLIC_API_BASE_URL</span> to
                    connect backend.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="stack" aria-label="Primary navigation">
            {nav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          <div className="card">
            <div className="cardInner">
              <div className="muted small">
                OAuth:{" "}
                <Link className="badge badgeCyan" href="/connect">
                  connect providers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
