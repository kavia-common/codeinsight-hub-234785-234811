"use client";

import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { useOrg } from "@/components/OrgContext";
import { getBilling } from "@/lib/api/devtrackr";

export default function BillingPage() {
  const { activeOrgId } = useOrg();
  const orgId = activeOrgId ?? "";

  const billing = useSWR(orgId ? ["billing", orgId] : null, async () => getBilling(orgId));
  const data = billing.data;

  const [toast, setToast] = useState<string | null>(null);

  const seatsPct = useMemo(() => {
    if (!data) return 0;
    return Math.min(100, Math.round((data.seatsUsed / Math.max(1, data.seatsLimit)) * 100));
  }, [data]);

  return (
    <div className="stack">
      <header className="card">
        <div className="cardInner stack">
          <div className="h1">Billing</div>
          <p className="muted small">
            Billing-ready UI: plan, seats, renewal. Checkout integration pending.
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
            <div className="h2">Plan</div>
            {billing.isLoading ? (
              <div className="muted small">Loading…</div>
            ) : billing.error ? (
              <div className="toast" role="alert">
                Failed:{" "}
                {billing.error instanceof Error
                  ? billing.error.message
                  : String(billing.error)}
              </div>
            ) : !data ? (
              <div className="muted small">No billing data.</div>
            ) : (
              <>
                <div className="row">
                  <span className="badge badgePrimary">{data.plan}</span>
                  <span className="muted small">
                    renewal:{" "}
                    {data.renewalDate ? new Date(data.renewalDate).toLocaleDateString() : "—"}
                  </span>
                </div>
                <div className="row">
                  <button
                    className="btn btnPrimary"
                    onClick={() => setToast("Upgrade flow placeholder.")}
                  >
                    Upgrade
                  </button>
                  <button
                    className="btn"
                    onClick={() => setToast("Manage payment method placeholder.")}
                  >
                    Manage payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <div className="cardInner stack">
            <div className="h2">Seats</div>
            {!data ? (
              <div className="muted small">—</div>
            ) : (
              <>
                <div className="row">
                  <span className="badge badgeCyan">
                    {data.seatsUsed}/{data.seatsLimit}
                  </span>
                  <span className="muted small">{seatsPct}% utilized</span>
                </div>
                <div className="muted small">
                  Seat enforcement is handled server-side (RBAC + invites).
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="cardInner stack">
          <div className="h2">Invoices (placeholder)</div>
          <div className="muted small">
            Once billing provider is integrated, list invoice PDFs + payment history here.
          </div>
        </div>
      </section>
    </div>
  );
}
