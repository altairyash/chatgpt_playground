"use client";

import { FormEvent, useState } from "react";

type Check = { label: string; status: "pass" | "review"; detail: string };
type Result = { url: string; checkedAt: string; score: number; checks: Check[]; note: string };

export default function AuditTool() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function runAudit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn’t check that website.");
      setResult(data as Result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn’t check that website. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="free-audit-section" id="free-check">
      <div className="shell free-audit-grid">
        <div className="free-audit-copy">
          <div className="eyebrow">FREE AEO READINESS CHECK</div>
          <h2>Check your site&apos;s<br /><em>AI search readiness.</em></h2>
          <p>Check technical signals that may help answer engines discover and interpret your site. This is a readiness snapshot, not a live ranking test.</p>
          <div className="free-audit-points"><span>✓ No account required</span><span>✓ No payment required</span><span>✓ Results in seconds</span></div>
        </div>
        <div className="free-audit-panel">
          <form onSubmit={runAudit} className="free-audit-form">
            <label htmlFor="free-audit-url">Public website URL</label>
            <div className="free-audit-input-row">
              <input id="free-audit-url" type="text" inputMode="url" autoComplete="url" placeholder="example.com" value={url} onChange={(event) => setUrl(event.target.value)} required />
              <button type="submit" disabled={loading}>{loading ? "Checking…" : "Check site ↗"}</button>
            </div>
            <p className="free-audit-small">We inspect the homepage HTML only. Please only submit sites you’re authorized to test.</p>
          </form>
          {error && <p className="audit-error" role="alert">{error}</p>}
          {result && (
            <div className="audit-results" aria-live="polite">
              <div className="audit-result-head">
                <div><span className="audit-result-kicker">AEO READINESS SNAPSHOT</span><strong>{new URL(result.url).hostname}</strong></div>
                <div className="audit-score"><b>{result.score}</b><span>/ 100 signals</span></div>
              </div>
              <div className="audit-result-list">
                {result.checks.map((item) => (
                  <div className="audit-result-item" key={item.label}>
                    <span className={item.status === "pass" ? "result-status result-pass" : "result-status result-review"}>{item.status === "pass" ? "✓" : "!"}</span>
                    <div><strong>{item.label}</strong><p>{item.detail}</p></div>
                  </div>
                ))}
              </div>
              <p className="audit-result-note">{result.note}</p>
              <div className="audit-result-actions"><button type="button" className="audit-download-button" onClick={() => window.print()}>Save report as PDF ↗</button><a className="audit-upgrade-link" href={`#request`} onClick={() => setUrl(result.url)}>Need help prioritizing AEO improvements? Request a review ↓</a></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
