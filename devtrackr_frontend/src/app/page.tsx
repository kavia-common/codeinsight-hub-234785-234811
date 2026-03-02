import Link from "next/link";

export default function Home() {
  return (
    <div className="stack">
      <section className="card">
        <div className="cardInner stack">
          <div className="h1">Welcome to DevTrackr</div>
          <p className="muted small">
            Start here: connect GitHub/GitLab, then pick repos to sync, then review PR/MR
            summaries + dashboards.
          </p>

          <div className="row">
            <Link className="btn btnPrimary" href="/dashboard">
              Open dashboard
            </Link>
            <Link className="btn" href="/connect">
              Connect providers
            </Link>
            <Link className="btn" href="/repos">
              Select repos
            </Link>
          </div>

          <hr className="hr" />

          <p className="muted small">
            Note: backend OpenAPI currently only exposes a health check. UI uses mock
            fallback for missing endpoints while staying wired to expected routes.
          </p>
        </div>
      </section>
    </div>
  );
}
