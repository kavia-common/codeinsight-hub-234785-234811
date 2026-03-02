import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="stack">
      <section className="card" role="alert" aria-live="assertive">
        <div className="cardInner stack">
          <div className="h1">404 — Page Not Found</div>
          <p className="muted small">
            The route you tried doesn’t exist in this console.
          </p>
          <div className="row">
            <Link className="btn btnPrimary" href="/dashboard">
              Go to dashboard
            </Link>
            <Link className="btn" href="/">
              Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
