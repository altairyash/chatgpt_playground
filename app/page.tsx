"use client";

import { FormEvent, useState } from "react";
import AuditTool from "./components/AuditTool";

const signals = [
  { id: "01", title: "The answers buyers actually see", body: "Test real buying questions across selected AI experiences. Capture brand mentions, competitors, and the sources behind the response." },
  { id: "02", title: "The sources influencing the shortlist", body: "Find the comparison pages, review platforms, publisher coverage, and product documentation shaping recommendations." },
  { id: "03", title: "A plan your team can act on", body: "Turn the evidence into a ranked set of content, technical, and third-party visibility improvements—with clear reasoning." },
];

export default function Home() {
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [goal, setGoal] = useState("Understand why competitors are recommended");
  const [sent, setSent] = useState(false);

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inbox = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    if (!inbox) { setSent(true); return; }
    const subject = encodeURIComponent("CiteGlance — AI buyer visibility sprint");
    const body = encodeURIComponent(`Website: ${website}\nCompany: ${company || "Not provided"}\nContact: ${email}\nGoal: ${goal}\n\nPlease follow up to scope the AI buyer visibility sprint.`);
    window.location.href = `mailto:${inbox}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main className="cg2">
      <nav className="cg2-nav">
        <a className="cg2-logo" href="#top" aria-label="CiteGlance home"><span className="cg2-logo-mark">c<span>.</span></span><span>CiteGlance</span></a>
        <div className="cg2-nav-links"><a href="#approach">Approach</a><a href="/free-tools">Free tools</a><a href="/pricing">Pricing</a><a href="/services">Services</a></div>
        <a className="cg2-nav-cta" href="#assessment">Get your baseline <span>↗</span></a>
      </nav>

      <section className="cg2-hero" id="top">
        <div className="cg2-hero-grid" aria-hidden="true"></div>
        <div className="cg2-hero-copy">
          <div className="cg2-kicker"><span className="cg2-live"></span> AI DISCOVERY INTELLIGENCE FOR B2B</div>
          <h1>When AI makes the shortlist, <em>make sure you're on it.</em></h1>
          <p className="cg2-lede">See how your product appears when buyers ask AI what to buy. Get the evidence, the competitor context, and a clear plan to close the gaps.</p>
          <div className="cg2-hero-actions"><a className="cg2-button" href="#assessment">Explore your visibility <span>↗</span></a><a className="cg2-quiet-link" href="#approach">See how it works <span>↓</span></a></div>
          <div className="cg2-proof-points"><span><b>↗</b> Buyer-intent prompts</span><span><b>◈</b> Source-level evidence</span><span><b>✓</b> No ranking promises</span></div>
        </div>
        <div className="cg2-product" aria-label="Illustrative AI discovery research dashboard">
          <div className="cg2-product-top"><div><span className="cg2-product-dot"></span><span>RESEARCH WORKSPACE</span></div><span className="cg2-demo-label">ILLUSTRATIVE DATA</span></div>
          <div className="cg2-product-title"><div><small>BUYER QUESTION / 014</small><h2>“Best platform for securing AI agents?”</h2></div><span className="cg2-round-arrow">↗</span></div>
          <div className="cg2-metrics"><div><small>BRAND MENTIONS</small><strong>06 <i>of 20</i></strong><span className="cg2-meter"><i style={{width:"30%"}} /></span></div><div><small>SOURCE CITATIONS</small><strong>12 <i>observed</i></strong><span className="cg2-meter"><i style={{width:"62%"}} /></span></div><div><small>COMPETITORS FOUND</small><strong>04 <i>brands</i></strong><span className="cg2-meter"><i style={{width:"45%"}} /></span></div></div>
          <div className="cg2-table-head"><span>OBSERVED IN ANSWERS</span><span>FINDING</span></div>
          <div className="cg2-result"><span className="cg2-result-icon cg2-purple">P</span><div><strong>Your product</strong><small>Named in 6 sampled answers</small></div><span className="cg2-result-status">MENTIONED</span></div>
          <div className="cg2-result"><span className="cg2-result-icon cg2-yellow">↗</span><div><strong>Comparison source</strong><small>Third-party list shapes the shortlist</small></div><span className="cg2-result-status cg2-status-warn">OPPORTUNITY</span></div>
          <div className="cg2-result"><span className="cg2-result-icon cg2-green">◎</span><div><strong>Competitor coverage</strong><small>Two rivals appear more consistently</small></div><span className="cg2-result-status">INVESTIGATE</span></div>
          <div className="cg2-product-foot"><span><b>↳</b> Every finding is tied to an observed prompt.</span><span>VIEW METHOD ↗</span></div>
        </div>
        <div className="cg2-hero-bottom"><span>RESEARCH, NOT GUESSWORK.</span><span>01 — MEASURE&nbsp;&nbsp; / &nbsp;&nbsp;02 — UNDERSTAND&nbsp;&nbsp; / &nbsp;&nbsp;03 — IMPROVE</span></div>
      </section>

      <section className="cg2-marquee" aria-label="Service capabilities"><span>AI ANSWER VISIBILITY</span><i>✳</i><span>CITATION RESEARCH</span><i>✳</i><span>COMPETITOR INTELLIGENCE</span><i>✳</i><span>CONTENT PRIORITIZATION</span></section>

      <section className="cg2-approach" id="approach">
        <div className="cg2-section-head"><div><div className="cg2-section-label">01 / THE APPROACH</div><h2>Know what AI says.<br/><em>Know what to do next.</em></h2></div><p>AI visibility is not a magic score. It is a research problem: ask relevant questions, inspect the answers and their sources, then decide what deserves action.</p></div>
        <div className="cg2-feature-grid">{signals.map((item, index) => <article className="cg2-feature" key={item.id}><div className="cg2-feature-top"><span>{item.id}</span><span className="cg2-feature-symbol">{index === 0 ? "↗" : index === 1 ? "⌕" : "↳"}</span></div><h3>{item.title}</h3><p>{item.body}</p><div className="cg2-feature-line"><span></span></div></article>)}</div>
      </section>

      <section className="cg2-method">
        <div className="cg2-method-copy"><div className="cg2-section-label">02 / HOW THE WORK RUNS</div><h2>Evidence first.<br/><em>Then action.</em></h2><p>AI answers change across prompts, models, and time. We document the test conditions, separate observation from interpretation, and make recommendations your team can verify.</p><a href="/services" className="cg2-dark-link">Explore the sprint <span>↗</span></a></div>
        <div className="cg2-steps"><div className="cg2-step"><span>01</span><div><h3>Establish the baseline</h3><p>Agree the market, buyer prompts, competitors, and AI experiences to test.</p></div><b>↗</b></div><div className="cg2-step"><span>02</span><div><h3>Trace the evidence</h3><p>Record observed mentions, citations, recurring sources, and competitor patterns.</p></div><b>↗</b></div><div className="cg2-step"><span>03</span><div><h3>Prioritize the response</h3><p>Get a focused 30-day action plan with rationale, effort, and dependencies.</p></div><b>↗</b></div></div>
      </section>

      <section className="cg2-tools"><div className="cg2-tools-heading"><div><div className="cg2-section-label">03 / START FOR FREE</div><h2>Useful tools. <em>No gatekeeping.</em></h2></div><p>Run a practical technical check before investing in deeper research.</p></div><div className="cg2-tool-card"><div className="cg2-tool-icon">⌘</div><div><h3>Website readiness toolkit</h3><p>Check technical signals and generate useful starter files for your site. It is a readiness check—not a claim about AI rankings.</p></div><a href="/free-tools">Open free tools <span>↗</span></a></div><AuditTool /></section>

      <section className="cg2-assessment" id="assessment">
        <div className="cg2-assessment-copy"><div className="cg2-section-label">04 / THE PAID SPRINT</div><h2>Stop guessing.<br/><em>See the evidence.</em></h2><p>Built for B2B software teams with meaningful contract values and active growth budgets. We test buyer-intent prompts, map competitors and cited sources, then deliver specific actions.</p><div className="cg2-offer"><div className="cg2-offer-price"><small>FIXED-SCOPE PROJECT</small><strong>$1,500</strong><span>one-time</span></div><div className="cg2-offer-details"><span>20 buyer-intent prompts</span><span>Up to 3 AI experiences, subject to access</span><span>Evidence-backed 30-day plan</span></div></div><small className="cg2-disclaimer">No promise of AI mentions, citations, rankings, or revenue. Scope and methods are agreed before work begins.</small></div>
        <form className="cg2-form" onSubmit={submitLead}><div className="cg2-form-heading"><span>LET'S LOOK CLOSER <b>↗</b></span><h3>Request a scoped proposal</h3><p>Tell us where to start. No payment at this stage.</p></div><label htmlFor="cg2-site">Company website</label><input id="cg2-site" type="url" placeholder="https://yourcompany.com" value={website} onChange={e=>setWebsite(e.target.value)} required/><label htmlFor="cg2-company">Company name <span>(optional)</span></label><input id="cg2-company" type="text" placeholder="Your company" value={company} onChange={e=>setCompany(e.target.value)}/><label htmlFor="cg2-email">Work email</label><input id="cg2-email" type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} required/><label htmlFor="cg2-goal">What do you want to understand?</label><select id="cg2-goal" value={goal} onChange={e=>setGoal(e.target.value)}><option>Understand why competitors are recommended</option><option>Check whether AI mentions our product</option><option>Find the sources behind AI answers</option><option>Prioritize our AI discovery strategy</option></select><button className="cg2-submit" type="submit">Request proposal <span>↗</span></button>{sent && !process.env.NEXT_PUBLIC_CONTACT_EMAIL && <p className="cg2-form-note" role="status">The inbox is not configured on this site yet, so the request has not been delivered.</p>}{sent && process.env.NEXT_PUBLIC_CONTACT_EMAIL && <p className="cg2-form-note" role="status">Your email app should open with the request prepared. Send it to complete the request.</p>}<p className="cg2-privacy">Your details are used only to respond to this request.</p></form>
      </section>

      <section className="cg2-faq"><div className="cg2-section-label">A FEW STRAIGHT ANSWERS</div><div className="cg2-faq-row"><h2>Clear-eyed about<br/><em>what AI can do.</em></h2><div><details><summary>Can you guarantee a ChatGPT ranking?</summary><p>No. AI answers vary by prompt, model, and time. We measure observed visibility and recommend changes we can reasonably support with evidence.</p></details><details><summary>Is this just traditional SEO?</summary><p>It overlaps with technical SEO and content quality, but also examines AI-generated mentions, citations, recommendation prompts, and competitor presence.</p></details><details><summary>Do you automatically track every AI platform?</summary><p>No blanket claim of coverage. The sprint specifies which platforms, prompts, and access methods are used, and records limitations.</p></details></div></div></section>

      <footer className="cg2-footer"><a className="cg2-logo" href="#top"><span className="cg2-logo-mark">c<span>.</span></span><span>CiteGlance</span></a><div><a href="/free-tools">Free tools</a><a href="/pricing">Pricing</a><a href="/services">Services</a><a href="/aeo-guide">AEO guide</a></div><span>Independent research for a changing discovery landscape.</span><small>© {new Date().getFullYear()} CiteGlance</small></footer>
    </main>
  );
}
