"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Check = { label: string; status: "pass" | "review"; detail: string };
type AiPriority = { priority: "first" | "next" | "later"; title: string; finding: string; action: string };
type AiReview = {
  status: "ready" | "not_configured" | "unavailable";
  summary: string;
  priorities: AiPriority[];
  caveat: string;
};
type Result = { url: string; checkedAt: string; score: number; checks: Check[]; note: string; aiReview?: AiReview };
type ActionItem = {
  id: string;
  priority: "first" | "next" | "later";
  title: string;
  finding: string;
  action: string;
};

function suggestedFix(check: Check): string {
  const fixes: Record<string, string> = {
    "Page title": "Add a unique, concise title that clearly identifies this page and its intended audience.",
    "Meta description": "Write a distinct, accurate summary that tells the right visitor what the page offers.",
    "Main heading (H1)": "Add one clear primary heading that matches the page’s main purpose.",
    "Canonical URL": "Add an absolute canonical URL for the preferred version of this page.",
    "Structured data (JSON-LD)": "Add only relevant, valid structured data that matches visible page content, then validate it.",
    "Indexing directives": "Confirm whether the page should be indexed. Remove an accidental noindex directive if search discovery is intended.",
    "Image alternative text": "Add concise alt text to informative images; use empty alt text for purely decorative images.",
    "Document language": "Set the HTML lang attribute to the page’s actual language.",
    "Open Graph metadata": "Add accurate Open Graph title and description tags for clear link previews.",
    "Robots.txt": "Review crawler-specific rules and confirm they match your discovery and content-use preferences.",
    "AI search crawler access": "Inspect robots.txt for OAI-SearchBot, PerplexityBot, Claude-SearchBot, Googlebot, and Bingbot. Confirm the intended access policy and separately test CDN/firewall controls; training crawlers are a different policy.",
    "XML sitemap": "Publish an XML sitemap with canonical, indexable URLs and keep it updated.",
    "llms.txt discovery file": "Treat llms.txt as optional documentation. If you use it, keep it short, accurate, and useful.",
  };
  return fixes[check.label] || "Review the finding above, confirm it matters for this page, and make the smallest accurate fix.";
}

function buildActionPlan(result: Result): ActionItem[] {
  if (result.aiReview?.status === "ready" && result.aiReview.priorities.length > 0) {
    return result.aiReview.priorities.map((item, index) => ({
      id: "ai-" + index,
      priority: item.priority,
      title: item.title,
      finding: item.finding,
      action: item.action,
    }));
  }
  const rank = (check: Check) => {
    if (["Indexing directives", "Page title", "Main heading (H1)", "Canonical URL"].includes(check.label)) return 0;
    if (["Meta description", "Open Graph metadata", "Robots.txt", "XML sitemap"].includes(check.label)) return 1;
    return 2;
  };
  return result.checks
    .map((check, index) => ({ check, index }))
    .filter(({ check }) => check.status === "review")
    .sort((a, b) => rank(a.check) - rank(b.check) || a.index - b.index)
    .map(({ check, index }) => ({
      id: "technical-" + index,
      priority: rank(check) === 0 ? "first" : rank(check) === 2 ? "later" : "next",
      title: check.label,
      finding: check.detail,
      action: suggestedFix(check),
    }));
}

function downloadTextFile(filename: string, contents: string, contentType: string) {
  const blob = new Blob([contents], { type: contentType });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export default function AuditTool() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [doneActions, setDoneActions] = useState<string[]>([]);
  const [actionPlanMessage, setActionPlanMessage] = useState("");

  async function runAudit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 20000);
      let response: Response;
      try {
        response = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeout);
      }
      const data = await response.json().catch(() => ({ error: "The scanner returned an unreadable response. Please try again." }));
      if (!response.ok) throw new Error(data.error || "We couldn’t check that website.");
      const parsed = data as Result;
      setResult(parsed);
      setDoneActions([]);
      setActionPlanMessage("");
    } catch (err) {
      setError(err instanceof DOMException && err.name === "AbortError"
        ? "The scan took longer than expected. Try again; the website may be slow to respond."
        : err instanceof Error ? err.message : "We couldn’t check that website. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const actionPlan = result ? buildActionPlan(result) : [];
  const passedChecks = result ? result.checks.filter((item) => item.status === "pass").length : 0;
  const reviewChecks = result ? result.checks.length - passedChecks : 0;
  const completeActionCount = actionPlan.filter((item) => doneActions.includes(item.id)).length;
  const actionPlanText = result ? [
    "# CiteGlance action plan",
    "",
    "Website: " + new URL(result.url).hostname,
    "Checked: " + new Date(result.checkedAt).toLocaleString(),
    "Technical signals passed: " + passedChecks + " of " + result.checks.length,
    "",
    "## Actions",
    ...(actionPlan.length ? actionPlan.map((item) =>
      "- [" + (doneActions.includes(item.id) ? "x" : " ") + "] " + item.title +
      "\n  Finding: " + item.finding +
      "\n  Next action: " + item.action
    ) : ["- No review flags were returned by the technical checks. This does not measure AI mentions or citations."]),
    "",
    "## All technical checks",
    ...result.checks.map((item) => "- [" + (item.status === "pass" ? "x" : " ") + "] " + item.label + ": " + item.detail),
    "",
    "Note: a technical readiness scan is not an AI ranking, mention, or citation test.",
  ].join("\n") : "";

  async function copyActionPlan() {
    if (!actionPlanText) return;
    try {
      await navigator.clipboard.writeText(actionPlanText);
      setActionPlanMessage("Action plan copied.");
    } catch {
      setActionPlanMessage("Clipboard access was blocked. Use Download action plan instead.");
    }
  }

  function downloadActionPlan() {
    if (!actionPlanText || !result) return;
    downloadTextFile(new URL(result.url).hostname + "-citeglance-action-plan.md", actionPlanText, "text/markdown;charset=utf-8");
    setActionPlanMessage("Your action plan download has started.");
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
        <div className="free-audit-panel" aria-busy={loading}>
          <form onSubmit={runAudit} className="free-audit-form">
            <label htmlFor="free-audit-url">Public website URL</label>
            <div className="free-audit-input-row">
              <input id="free-audit-url" type="text" inputMode="url" autoComplete="url" placeholder="example.com" value={url} onChange={(event) => setUrl(event.target.value)} required />
              <button type="submit" disabled={loading}>{loading ? "Checking…" : "Check site ↗"}</button>
            </div>
            <p className="free-audit-small">We inspect the public homepage HTML only. When AI recommendations are enabled, the submitted URL, a short text excerpt, and technical checks are sent to OpenAI to generate suggestions. No contact-form details are sent.</p>
          </form>
          {loading && (
            <div className="audit-progress" role="status" aria-live="polite">
              <span className="audit-progress-track" aria-hidden="true"><span /></span>
              <strong>Inspecting your public homepage…</strong>
              <p>Checking page metadata, indexing signals, Open Graph tags, and discovery files. Personalized recommendations run after the technical scan when AI is configured.</p>
            </div>
          )}
          {error && <p className="audit-error" role="alert">{error}</p>}
          {result && (
            <div className="audit-results" id="audit-report" aria-live="polite">
              <div className="audit-result-head">
                <div><span className="audit-result-kicker">AEO READINESS SNAPSHOT</span><strong>{new URL(result.url).hostname}</strong></div>
                <div className="audit-score"><b>{result.score}%</b><span>checks passed</span></div>
              </div>
              <div className="audit-result-overview">
                <div className="audit-result-counts">
                  <span><strong>{passedChecks} of {result.checks.length}</strong> checks passed</span>
                  <span><strong>{reviewChecks}</strong> to review</span>
                  <span>Checked {new Date(result.checkedAt).toLocaleString()}</span>
                </div>
                <div className="audit-result-meter" role="progressbar" aria-label="Share of technical checks passed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={result.score}>
                  <span style={{ width: result.score + "%" }} />
                </div>
                <p>The percentage is the share of these technical checks passed. It is not an AI ranking, mention, or citation score.</p>
              </div>
              <div className="audit-result-list">
                {result.checks.map((item) => (
                  <div className="audit-result-item" key={item.label}>
                    <span className={item.status === "pass" ? "result-status result-pass" : "result-status result-review"}>{item.status === "pass" ? "✓" : "!"}</span>
                    <div><strong>{item.label}</strong><p>{item.detail}</p></div>
                  </div>
                ))}
              </div>
              {result.aiReview && (
                <section className="audit-ai-review" aria-label="AI recommendations">
                  <div className="audit-ai-head">
                    <div>
                      <span className="audit-result-kicker">AI NEXT STEPS</span>
                      <h3>What to fix first</h3>
                    </div>
                    <span className={"audit-ai-status audit-ai-" + result.aiReview.status}>
                      {result.aiReview.status === "ready"
                        ? "PERSONALIZED REVIEW"
                        : result.aiReview.status === "not_configured"
                          ? "AI NOT CONNECTED"
                          : "REVIEW UNAVAILABLE"}
                    </span>
                  </div>
                  <p className="audit-ai-summary">{result.aiReview.summary}</p>
                  <p className="audit-ai-caveat">{result.aiReview.caveat}</p>
                </section>
              )}
              <section className="audit-action-plan" aria-label="Personalized action checklist">
                <div className="audit-action-plan-head">
                  <div>
                    <span className="audit-result-kicker">YOUR NEXT STEPS</span>
                    <h3>{actionPlan.length ? "Build your fix list" : "No review flags found"}</h3>
                  </div>
                  {actionPlan.length > 0 && <span className="audit-action-count">{completeActionCount} of {actionPlan.length} done</span>}
                </div>
                {actionPlan.length > 0 ? (
                  <>
                    <p className="audit-action-intro">We’ve started with the most relevant findings. Mark items complete as you fix them; download the plan to keep it or share it with your team.</p>
                    {completeActionCount > 0 && (
                      <div className="audit-action-progress" role="progressbar" aria-label="Action plan completion" aria-valuemin={0} aria-valuemax={actionPlan.length} aria-valuenow={completeActionCount}>
                        <span style={{ width: (completeActionCount / actionPlan.length * 100) + "%" }} />
                      </div>
                    )}
                    <div className="audit-action-list">
                      {actionPlan.map((item) => (
                        <label className={doneActions.includes(item.id) ? "audit-action-item is-done" : "audit-action-item"} key={item.id}>
                          <input
                            type="checkbox"
                            checked={doneActions.includes(item.id)}
                            onChange={(event) => {
                              setDoneActions((current) => event.target.checked
                                ? [...current, item.id]
                                : current.filter((id) => id !== item.id));
                              setActionPlanMessage("");
                            }}
                          />
                          <span className="audit-action-content">
                            <span className="audit-action-priority">{item.priority === "first" ? "FIX FIRST" : item.priority === "later" ? "WHEN READY" : "NEXT UP"}</span>
                            <strong>{item.title}</strong>
                            <span className="audit-action-finding">{item.finding}</span>
                            <span className="audit-action-fix"><b>Suggested action</b> {item.action}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="audit-action-plan-actions">
                      <button type="button" className="audit-download-button" onClick={downloadActionPlan}>Download action plan ↗</button>
                      <button type="button" className="audit-copy-plan-button" onClick={copyActionPlan}>Copy plan</button>
                    </div>
                    {actionPlanMessage && <p className="audit-action-message" role="status">{actionPlanMessage}</p>}
                  </>
                ) : (
                  <p className="audit-action-intro">All observed technical checks passed. That’s a useful baseline, but it doesn’t measure whether AI assistants mention or cite your brand.</p>
                )}
              </section>
              <p className="audit-result-note">{result.note}</p>
              <div className="audit-result-actions"><button type="button" className="audit-download-button" onClick={() => window.print()}>Save report as PDF ↗</button><a className="audit-upgrade-link" href={`#assessment`} onClick={() => setUrl(result.url)}>Need help prioritizing AEO improvements? Request a review ↓</a></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
