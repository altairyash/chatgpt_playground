"use client";

import { FormEvent, useState } from "react";
import AuditTool from "./components/AuditTool";

const outcomes = [
  { n: "01", title: "Know where you show up", body: "Build a baseline across buyer questions and selected AI answer experiences. Separate observed mentions and citations from assumptions." },
  { n: "02", title: "Find the sources shaping answers", body: "Map competitor citations, review sites, comparison pages, directories, and other credible sources worth understanding." },
  { n: "03", title: "Close the visibility gaps", body: "Prioritize answer-ready pages, clearer product facts, structured data, useful comparison content, and credible third-party coverage." },
  { n: "04", title: "Measure what changes", body: "Repeat the same prompt set over time and connect visibility trends to qualified visits and leads when analytics data is available." },
];
const methodSteps = [
  { n: "01", title: "Baseline", body: "Define your category, audience, competitors, markets, and the prompts your buyers actually ask." },
  { n: "02", title: "Prioritize", body: "Use observed answers and cited sources to create a ranked plan—not a generic checklist or a promise of instant rankings." },
  { n: "03", title: "Improve", body: "Implement the highest-value content and technical changes, with your approval for any publishing or outreach." },
  { n: "04", title: "Re-measure", body: "Re-run the same prompts, report changes, and adjust based on evidence." },
];

export default function Home() {
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [goal, setGoal] = useState("Appear in AI recommendations");
  const [sent, setSent] = useState(false);

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inbox = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    if (!inbox) {
      setSent(true);
      return;
    }
    const subject = encodeURIComponent("CiteGlance — AI buyer visibility sprint");
    const body = encodeURIComponent(
      `New AEO assessment request\n\nWebsite: ${website}\nCompany: ${company || "Not provided"}\nContact: ${email}\nGoal: ${goal}\n\nPlease follow up to scope the initial assessment.`
    );
    window.location.href = `mailto:${inbox}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main>
      <nav className="nav shell aeonav">
        <a className="brand" href="#top" aria-label="CiteGlance home"><span className="brand-mark">C</span><span>Cite<span className="brand-light">Glance</span></span></a>
        <div className="aeonav-links"><a className="nav-link" href="#method">Method</a><a className="nav-link" href="/free-tools">Free tools</a><a className="nav-link" href="/pricing">Pricing</a><a className="nav-link" href="/services">Services</a><a className="nav-link" href="/chatgpt-visibility">Guides</a><a className="button button-primary" href="#assessment">Get assessed <span aria-hidden="true">↗</span></a></div>
      </nav>

      <section className="aeo-hero shell" id="top">
        <div className="aeo-hero-copy">
          <div className="eyebrow"><span className="pulse" /> ANSWER ENGINE OPTIMIZATION</div>
          <h1>When customers ask AI who to choose, <em>be in the conversation.</em></h1>
          <p className="aeo-lede">CiteGlance helps growth-stage B2B software companies understand whether AI tools surface their product when buyers compare solutions. Get a buyer-prompt visibility study, competitor and citation-source analysis, and a prioritized growth plan—without made-up scores or ranking promises.</p>
          <div className="hero-actions"><a className="button button-primary" href="#assessment">Get an AI visibility baseline <span aria-hidden="true">↗</span></a><a className="text-link" href="#method">See how it works <span aria-hidden="true">↓</span></a></div>
          <div className="trust-row"><span><span className="check">✓</span> Evidence before edits</span><span><span className="check">✓</span> Built around buyer prompts</span><span><span className="check">✓</span> No ranking guarantees</span></div>
        </div>
        <div className="aeo-visual" aria-label="Illustrative AI answer visibility report">
          <div className="aeo-orbit"></div>
          <div className="aeo-report">
            <div className="aeo-report-top"><span className="window-dots"><i /><i /><i /></span><span>AI VISIBILITY SNAPSHOT</span><span className="status">SAMPLE</span></div>
            <div className="aeo-question"><small>BUYER PROMPT</small><strong>“What is the best solution for my team?”</strong></div>
            <div className="aeo-answer"><span className="answer-avatar">AI</span><div><strong>Brand mention</strong><p>Was your brand named in the answer?</p></div><span className="answer-tag">TRACK</span></div>
            <div className="aeo-answer"><span className="answer-avatar cite">↗</span><div><strong>Source citations</strong><p>Which pages informed the recommendation?</p></div><span className="answer-tag">MAP</span></div>
            <div className="aeo-answer"><span className="answer-avatar comp">◎</span><div><strong>Competitor share</strong><p>Who appears instead—and why?</p></div><span className="answer-tag">COMPARE</span></div>
            <div className="aeo-report-foot"><span>01</span><div><strong>Observe → improve → repeat</strong><small>Illustrative workflow, not customer data</small></div></div>
          </div>
        </div>
        <div className="hero-index"><span>01 / 04</span><span className="index-rule" /><span>AI SEARCH VISIBILITY</span></div>
      </section>

      <section className="proof-strip"><div className="shell proof-inner"><span className="proof-label">The work spans</span><span>AI VISIBILITY</span><b>·</b><span>CITATION RESEARCH</span><b>·</b><span>CONTENT STRATEGY</span><b>·</b><span>MEASUREMENT</span></div></section>

      <section className="section shell aeo-outcomes" id="what-we-do">
        <div className="section-intro"><div className="eyebrow">THE AEO LOOP</div><h2>From AI answers<br />to <em>actionable work.</em></h2><p>Dashboards alone do not improve visibility. The job is to identify the gaps, make credible improvements, and measure whether the answers change.</p></div>
        <div className="checks-list">{outcomes.map((item) => <article className="check-item" key={item.n}><span className="check-number">{item.n}</span><div><h3>{item.title}</h3><p>{item.body}</p></div><span className="item-arrow">↗</span></article>)}</div>
      </section>

      <section className="process-section" id="method"><div className="shell process-grid"><div><div className="eyebrow">A REPEATABLE METHOD</div><h2>Measure first.<br /><em>Improve with proof.</em></h2><p className="aeo-process-intro">AI answers vary by prompt, model, location, and time. A useful program tracks a consistent baseline and labels uncertainty honestly.</p></div><div className="process-steps">{methodSteps.map((item) => <div className="process-step" key={item.n}><span>{item.n}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></div>)}</div></div></section>

      <AuditTool />

      <section className="request-section shell" id="assessment">
        <div className="request-copy"><div className="eyebrow">START WITH YOUR BRAND</div><h2>Find your biggest<br /><em>AI visibility gaps.</em></h2><p>Built for B2B SaaS teams with meaningful contract values and active growth budgets. We test buyer-intent prompts, record which brands and sources appear, compare competitors, and translate the findings into specific actions. Platform access and test method are documented.</p><div className="price-note"><span className="price-dot" /><span><strong>AI Buyer Visibility Sprint · $1,500 fixed-scope</strong><small>20 buyer prompts · 3 AI platforms · competitor and source analysis · 30-day plan</small></span></div></div>
        <form className="request-form" onSubmit={submitLead}>
          <div className="form-top"><span className="form-icon">↗</span><div><strong>Request an AI buyer visibility sprint</strong><small>For B2B software teams evaluating AI-driven discovery</small></div></div>
          <label htmlFor="site-url">Website URL</label><input id="site-url" type="url" placeholder="https://yourbrand.com" value={website} onChange={(e) => setWebsite(e.target.value)} required />
          <label htmlFor="company-name">Brand or company <span className="aeo-optional">(optional)</span></label><input id="company-name" type="text" placeholder="Your company" value={company} onChange={(e) => setCompany(e.target.value)} />
          <label htmlFor="contact-email">Work email</label><input id="contact-email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="goal">Main goal</label><select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}><option>Appear in AI recommendations</option><option>Earn more citations</option><option>Understand competitors</option><option>Improve AI-driven leads</option></select>
          <button className="button button-primary submit-button" type="submit">Request a scoped proposal <span aria-hidden="true">↗</span></button>
          {sent && !process.env.NEXT_PUBLIC_CONTACT_EMAIL && <p className="form-message" role="status">The request is filled in, but the contact inbox is not configured. Please contact the site owner to finish setup.</p>}
          {sent && process.env.NEXT_PUBLIC_CONTACT_EMAIL && <p className="form-message" role="status">Your email app should open with the request prepared. Send it to complete the request.</p>}
          <p className="form-privacy">No payment is taken here. We confirm the scope before starting work.</p>
        </form>
      </section>

      <section className="aeo-faq shell"><div className="eyebrow">STRAIGHT ANSWERS</div><h2>AEO, without the <em>hype.</em></h2><div className="aeo-faq-grid"><article><h3>Can anyone guarantee a ChatGPT ranking?</h3><p>No. AI answers are probabilistic and change across prompts, models, and time. We measure observed visibility and work on factors we can reasonably influence.</p></article><article><h3>Is this just traditional SEO?</h3><p>It overlaps with technical SEO and content quality, but AEO also studies AI-generated mentions, citations, recommendation prompts, and competitor presence.</p></article><article><h3>Do you fabricate reviews or mentions?</h3><p>No. We focus on useful content, accurate company facts, technical clarity, and legitimate third-party visibility—not fake reviews or spam.</p></article><article><h3>Do you already track every AI platform automatically?</h3><p>The free checker is a technical snapshot, not an AI-engine rank tracker. Engine-level measurement must be scoped to the tools, access, and prompts actually available.</p></article></div></section>

      <footer className="footer"><div className="shell footer-inner"><a className="brand" href="#top"><span className="brand-mark">C</span><span>Cite<span className="brand-light">Glance</span></span></a><span><a href="/free-tools">Free tools</a> · <a href="/aeo-guide">AEO guide</a> · <a href="/chatgpt-visibility">ChatGPT visibility playbook</a></span><span>Useful evidence. Practical improvements. No ranking guarantees.</span><span>© {new Date().getFullYear()} CiteGlance</span></div></footer>
    </main>
  );
}
