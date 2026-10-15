"use client";

import { FormEvent, useState } from "react";

const checks = [
  { number: "01", title: "Can search engines read it?", detail: "Indexability signals, robots directives, canonical URLs, and crawl paths." },
  { number: "02", title: "Is each page clearly described?", detail: "Page titles, meta descriptions, heading structure, and duplicate patterns." },
  { number: "03", title: "Can machines interpret the content?", detail: "Structured data presence, basic schema validity signals, and content clarity." },
  { number: "04", title: "What should you fix first?", detail: "A prioritized action list, with examples your developer can actually use." },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent("Website AI/search readiness audit request");
    const body = encodeURIComponent(
      `Hi, I'd like to discuss a website audit.\n\nWebsite: ${url}\nContact email: ${email}\n\nPlease let me know the next steps and scope.`
    );
    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    if (!contactEmail) {
      setSent(true);
      return;
    }
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#" aria-label="Signal Audit home">
          <span className="brand-mark">S</span>
          <span>signal<span className="brand-light">audit</span></span>
        </a>
        <a className="nav-link" href="#process">How it works <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> TECHNICAL CLARITY FOR THE AI SEARCH ERA</div>
          <h1>Help your website make sense to <em>machines.</em></h1>
          <p className="hero-sub">A focused technical review of the signals that help search engines and AI-powered discovery tools understand your site — with a practical list of what to fix.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#request">Request an audit <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="#what-you-get">See what’s included <span aria-hidden="true">↓</span></a>
          </div>
          <div className="trust-row">
            <span><span className="check">✓</span> Actionable findings</span>
            <span><span className="check">✓</span> Developer-friendly</span>
            <span><span className="check">✓</span> No ranking guarantees</span>
          </div>
        </div>
        <div className="visual-wrap" aria-label="Illustration of a website technical audit">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="audit-card">
            <div className="audit-top"><span className="window-dots"><i /><i /><i /></span><span className="audit-label">SITE SIGNAL REPORT</span><span className="status">PREVIEW</span></div>
            <div className="report-domain"><div className="domain-icon">↗</div><div><strong>yourwebsite.com</strong><small>Technical snapshot</small></div><span className="mini-arrow">↗</span></div>
            <div className="report-line"><span>Indexability signals</span><span className="line-value"><i className="dot dot-green" /> Detected</span></div>
            <div className="report-line"><span>Metadata coverage</span><span className="line-value"><i className="dot dot-amber" /> Review</span></div>
            <div className="report-line"><span>Structured data</span><span className="line-value"><i className="dot dot-amber" /> Review</span></div>
            <div className="report-line"><span>Page structure</span><span className="line-value"><i className="dot dot-green" /> Detected</span></div>
            <div className="report-footer"><span className="footer-icon">✳</span><div><strong>Know what to fix next.</strong><small>Prioritized, plain-English recommendations</small></div></div>
          </div>
          <div className="floating-note"><span className="note-icon">↳</span><span><strong>Clear next steps</strong><small>Not another vague score</small></span></div>
        </div>
        <div className="hero-index"><span>01 / 04</span><span className="index-rule" /><span>TECHNICAL REVIEW</span></div>
      </section>

      <section className="proof-strip">
        <div className="shell proof-inner"><span className="proof-label">A practical review of</span><span>CRAWLABILITY</span><b>·</b><span>METADATA</span><b>·</b><span>STRUCTURED DATA</span><b>·</b><span>CONTENT STRUCTURE</span></div>
      </section>

      <section className="section shell" id="what-you-get">
        <div className="section-intro">
          <div className="eyebrow">THE DELIVERABLE</div>
          <h2>Less guesswork.<br /><em>More useful fixes.</em></h2>
          <p>Not a promise to get you ranked in AI answers. A grounded technical review that helps your team remove avoidable friction and communicate your content more clearly.</p>
        </div>
        <div className="checks-list">
          {checks.map((item) => (
            <article className="check-item" key={item.number}>
              <span className="check-number">{item.number}</span>
              <div><h3>{item.title}</h3><p>{item.detail}</p></div>
              <span className="item-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="shell process-grid">
          <div><div className="eyebrow">A SMALL, CLEAR PROCESS</div><h2>Built around your<br /><em>next action.</em></h2></div>
          <div className="process-steps">
            <div className="process-step"><span>01</span><div><h3>Share your website</h3><p>Send a public URL and tell us what matters most.</p></div></div>
            <div className="process-step"><span>02</span><div><h3>Review the signals</h3><p>We inspect a defined sample of pages and validate key findings.</p></div></div>
            <div className="process-step"><span>03</span><div><h3>Get the action list</h3><p>Receive prioritized observations and practical implementation notes.</p></div></div>
          </div>
        </div>
      </section>

      <section className="request-section shell" id="request">
        <div className="request-copy"><div className="eyebrow">START WITH YOUR URL</div><h2>Let’s make your site<br /><em>easier to understand.</em></h2><p>Share the site you want reviewed. We’ll use that to scope a sensible first pass — no guaranteed rankings, no mystery metrics.</p><div className="price-note"><span className="price-dot" /><span><strong>Starter audit: ₹4,999</strong><small>Proposed starting price · final scope confirmed before payment</small></span></div></div>
        <form className="request-form" onSubmit={handleSubmit}>
          <div className="form-top"><span className="form-icon">↗</span><div><strong>Request a first review</strong><small>Usually takes less than a minute</small></div></div>
          <label htmlFor="site-url">Website URL</label>
          <input id="site-url" type="url" placeholder="https://yourwebsite.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
          <label htmlFor="email">Your email</label>
          <input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="button button-primary submit-button" type="submit">Prepare audit request <span aria-hidden="true">↗</span></button>
          {sent && !process.env.NEXT_PUBLIC_CONTACT_EMAIL && <p className="form-message" role="status">Your details are ready, but email delivery isn’t configured yet. The site owner needs to set NEXT_PUBLIC_CONTACT_EMAIL in Vercel before launch.</p>}
          {sent && process.env.NEXT_PUBLIC_CONTACT_EMAIL && <p className="form-message" role="status">Your email app should open with the request prepared. Send it there to complete the request.</p>}
          <p className="form-privacy">No payment is taken here. We’ll confirm scope before any work begins.</p>
        </form>
      </section>

      <footer className="footer">
        <div className="shell footer-inner"><a className="brand" href="#"><span className="brand-mark">S</span><span>signal<span className="brand-light">audit</span></span></a><span>Practical website diagnostics. Honest recommendations.</span><span>© {new Date().getFullYear()} Signal Audit</span></div>
      </footer>
    </main>
  );
}
