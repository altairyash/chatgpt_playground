"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import AuditTool from "./components/AuditTool";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "./components/ui/Tabs";
import Link from "next/link";

type ResearchView = "questions" | "answers" | "sources";

const researchViews: Record<ResearchView, { eyebrow: string; title: string; body: string; rows: { label: string; detail: string }[] }> = {
  questions: {
    eyebrow: "01 / BUYER PROMPTS",
    title: "Which tools should we shortlist for [use case]?",
    body: "Start with real evaluation language—not branded prompts designed to flatter one company.",
    rows: [
      { label: "Category discovery", detail: "What buyers ask before they know the vendors" },
      { label: "Alternative comparison", detail: "How shortlisted products are contrasted" },
      { label: "Problem-led search", detail: "Which tools are suggested for a specific job" },
    ],
  },
  answers: {
    eyebrow: "02 / ANSWER EVIDENCE",
    title: "Record what the answer actually says.",
    body: "Capture the response context, the brands named, the language used, and the limits of each observation.",
    rows: [
      { label: "Brand mentions", detail: "Exact wording and context—not just a yes/no score" },
      { label: "Competitor framing", detail: "Which alternatives appear and how they are described" },
      { label: "Test conditions", detail: "Platform, date, prompt, and access method recorded" },
    ],
  },
  sources: {
    eyebrow: "03 / CITATION TRAIL",
    title: "Follow recommendations back to their sources.",
    body: "Trace available citations to the pages, publishers, and references that may be shaping buyer understanding.",
    rows: [
      { label: "Comparison pages", detail: "Independent lists and vendor comparisons" },
      { label: "Reviews and editorial", detail: "Third-party context worth checking" },
      { label: "Your own pages", detail: "Product facts, documentation, and useful answers" },
    ],
  },
};

export default function Home() {
  const [researchView, setResearchView] = useState<ResearchView>("questions");
  const [website, setWebsite] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [offer, setOffer] = useState("Buyer visibility snapshot — $99 pilot");
  const [goal, setGoal] = useState("Understand why competitors are recommended");
  const [sent, setSent] = useState<"missing" | "prepared" | "">("");

  function chooseOffer(value: string) {
    setOffer(value);
    document.getElementById("request")?.scrollIntoView({ behavior: "smooth" });
  }

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const inbox = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    if (!inbox) {
      setSent("missing");
      return;
    }
    const subject = encodeURIComponent("CiteGlance | " + offer);
    const body = encodeURIComponent(
      "Website: " + website + "\nCompany: " + (company || "Not provided") +
      "\nContact: " + email + "\nEngagement: " + offer + "\nPriority: " + goal +
      "\n\nPlease follow up to confirm scope, platform access, and delivery timing."
    );
    window.location.href = "mailto:" + inbox + "?subject=" + subject + "&body=" + body;
    setSent("prepared");
  }

  const activeResearch = researchViews[researchView];

  return (
    <main className="cg3">
      <section className="cg3-hero" id="top">
        <div className="cg3-hero-copy">
          <div className="cg3-eyebrow"><span className="cg3-eyebrow-dot" /> INDEPENDENT RESEARCH FOR B2B SOFTWARE</div>
          <h1>When buyers ask AI what to buy, <em>know what it says about you.</em></h1>
          <p className="cg3-hero-lede">CiteGlance tests real buyer questions, records which brands and sources appear, and turns the evidence into a focused plan to improve your visibility.</p>
          <div className="cg3-actions">
            <a className="cg3-button cg3-button-primary" href="#offers">Explore the $99 snapshot <span aria-hidden="true">↗</span></a>
            <a className="cg3-text-link" href="#method">See the research method <span aria-hidden="true">↓</span></a>
          </div>
          <div className="cg3-trust">
            <span><b>01</b> Buyer-intent prompts</span>
            <span><b>02</b> Source-level evidence</span>
            <span><b>03</b> No ranking promises</span>
          </div>
        </div>

        <div className="cg3-research-card" aria-label="Interactive example of the research method">
          <div className="cg3-card-head">
            <div><span className="cg3-card-index">CG / FIELDNOTE 001</span><strong>Inside a visibility study</strong></div>
            <span className="cg3-sample-tag">SAMPLE FORMAT</span>
          </div>
          <div className="cg3-card-question">
            <span className="cg3-mono-label">THE QUESTION</span>
            <p>“Which platforms are worth shortlisting for <em>[this job to be done]</em>?”</p>
          </div>
          <TabsRoot value={researchView} onValueChange={(value) => setResearchView(value as ResearchView)} className="cg21-tabs-root">
            <TabsList className="cg3-tabs" aria-label="Research stages">
              <TabsTrigger value="questions">Prompts</TabsTrigger>
              <TabsTrigger value="answers">Answer log</TabsTrigger>
              <TabsTrigger value="sources">Source map</TabsTrigger>
            </TabsList>
            <TabsContent value={researchView} key={researchView} className="cg3-research-detail">
              <span className="cg3-mono-label">{activeResearch.eyebrow}</span>
              <h2>{activeResearch.title}</h2>
              <p>{activeResearch.body}</p>
              <div className="cg3-evidence-list">
                {activeResearch.rows.map((row, index) => (
                  <div className="cg3-evidence-row" key={row.label}>
                    <span className="cg3-evidence-number">0{index + 1}</span>
                    <div>
                      <strong>{row.label}</strong>
                      <small>{row.detail}</small>
                    </div>
                    <span className="cg3-evidence-arrow" aria-hidden="true">↗</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </TabsRoot>
          <div className="cg3-card-foot"><span>Designed to be checked, not taken on faith.</span><span>METHOD NOTE ↗</span></div>
          <p className="cg3-sample-disclaimer">Illustrative layout only. No live AI query, customer result, or performance claim is shown.</p>
        </div>

        <div className="cg3-hero-index"><span>RESEARCH</span><span className="cg3-index-line" /><span>INTERPRETATION</span><span className="cg3-index-line" /><span>ACTION</span></div>
      </section>

      <section className="cg3-capabilities" aria-label="Research capabilities">
        <div className="cg3-capabilities-label">WHAT WE INVESTIGATE</div>
        <div>Brand mentions <span>↗</span></div>
        <div>Competitor presence <span>↗</span></div>
        <div>Citation sources <span>↗</span></div>
        <div>Content opportunities <span>↗</span></div>
      </section>

      <section className="cg3-method" id="method">
        <div className="cg3-section-intro">
          <span className="cg3-section-kicker">01 / THE WORK</span>
          <h2>A score won’t tell you <em>why.</em></h2>
          <p>Visibility research should leave you with more than a number. It should show what was tested, what was observed, where the answer got its information, and what deserves attention next.</p>
          <Link className="cg3-inline-link" href="/services">See what the sprint includes <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="cg3-work-list">
          <article className="cg3-work-item">
            <span className="cg3-work-number">01</span>
            <div><h3>Test the questions buyers ask</h3><p>Build a relevant prompt set around category discovery, use cases, competitor alternatives, and evaluation criteria.</p></div>
            <span className="cg3-work-symbol">?</span>
          </article>
          <article className="cg3-work-item">
            <span className="cg3-work-number">02</span>
            <div><h3>Trace brands and sources</h3><p>Record answer context, observed mentions, competitors, and available citations—along with platform and test conditions.</p></div>
            <span className="cg3-work-symbol">↗</span>
          </article>
          <article className="cg3-work-item">
            <span className="cg3-work-number">03</span>
            <div><h3>Prioritize the next move</h3><p>Get a reasoned 30-day plan spanning product clarity, content, technical signals, and credible external sources.</p></div>
            <span className="cg3-work-symbol">↳</span>
          </article>
          <article className="cg3-work-item">
            <span className="cg3-work-number">04</span>
            <div><h3>Re-check with the same method</h3><p>Repeat the agreed prompts over time, distinguish changes from noise, and connect the work to qualified traffic when data is available.</p></div>
            <span className="cg3-work-symbol">↻</span>
          </article>
        </div>
      </section>

      <section className="cg3-principle">
        <div className="cg3-principle-mark" aria-hidden="true">“</div>
        <div>
          <span className="cg3-section-kicker">THE PRINCIPLE</span>
          <h2>AI discovery is observable. <em>Not controllable.</em></h2>
          <p>Answers vary by model, prompt, market, and time. We report what we can observe, make the method explicit, and never promise rankings, mentions, citations, leads, or revenue.</p>
        </div>
        <Link href="/aeo-guide" aria-label="Read our practical AEO guide">Read the guide <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="cg3-offers" id="offers">
        <div className="cg3-offers-heading">
          <div><span className="cg3-section-kicker">02 / START WITH THE RIGHT DEPTH</span><h2>Small pilot. <em>Serious evidence.</em></h2></div>
          <p>Start narrow to answer one question, or commission a full competitor and citation-source study. Scope is confirmed before payment.</p>
        </div>
        <div className="cg3-offer-grid">
          <article className="cg3-offer-card cg3-offer-pilot">
            <div className="cg3-offer-top"><span>01 / PILOT</span><span className="cg3-offer-badge">LOW-RISK FIRST STEP</span></div>
            <h3>Buyer visibility snapshot</h3>
            <p className="cg3-offer-description">A focused first look at one B2B software brand.</p>
            <div className="cg3-price">$99 <span>one-time pilot</span></div>
            <ul>
              <li>Up to 10 buyer-intent prompts</li>
              <li>One agreed AI answer platform</li>
              <li>Up to 3 named competitors</li>
              <li>Observed answers and available citations</li>
              <li>Short findings summary and next steps</li>
            </ul>
            <button className="cg3-button cg3-button-dark" type="button" onClick={() => chooseOffer("Buyer visibility snapshot — $99 pilot")}>Request the snapshot <span aria-hidden="true">↗</span></button>
          </article>
          <article className="cg3-offer-card cg3-offer-sprint">
            <div className="cg3-offer-top"><span>02 / FULL STUDY</span><span className="cg3-offer-badge cg3-badge-dark">FOR GROWTH TEAMS</span></div>
            <h3>AI Buyer Visibility Sprint</h3>
            <p className="cg3-offer-description">A deeper research engagement for teams with active growth budgets.</p>
            <div className="cg3-price">$1,500 <span>fixed scope · one-time</span></div>
            <ul>
              <li>Up to 20 buyer-intent prompts</li>
              <li>Up to 3 AI experiences, subject to access</li>
              <li>Competitor and citation-source map</li>
              <li>Prompt-level evidence and method notes</li>
              <li>Prioritized 30-day action plan</li>
            </ul>
            <button className="cg3-button cg3-button-primary" type="button" onClick={() => chooseOffer("AI Buyer Visibility Sprint — $1,500")}>Discuss the sprint <span aria-hidden="true">↗</span></button>
          </article>
        </div>
        <p className="cg3-scope-note">The snapshot is an early-access pilot. Platform access and reproducibility vary. The scope, method, evidence format, and delivery timing are agreed before work begins.</p>
      </section>

      <section className="cg3-free-check" id="free-check">
        <div className="cg3-free-copy">
          <span className="cg3-section-kicker">03 / FREE, SELF-SERVE</span>
          <h2>Not ready for a study? <em>Start with your site.</em></h2>
          <p>Run a free homepage readiness check or generate basic discovery files. These tools examine technical signals; they do not query AI engines or predict rankings.</p>
          <Link className="cg3-inline-link" href="/free-tools">Open all free tools <span aria-hidden="true">↗</span></Link>
          <div className="cg3-free-list"><span>robots.txt builder</span><span>llms.txt starter</span><span>Open Graph generator</span></div>
        </div>
        <div className="cg3-tool-wrap"><AuditTool /></div>
      </section>

      <section className="cg3-request" id="assessment">
        <div className="cg3-request-copy">
          <span className="cg3-section-kicker">04 / TALK SCOPE, NOT SALES HYPE</span>
          <h2>Bring us the category. <em>We’ll bring the evidence.</em></h2>
          <p>For B2B software teams where being understood in the buying process matters. Share your site and what you need to learn; the first step is agreeing what can be tested.</p>
          <div className="cg3-request-points"><span><b>→</b> Scope agreed before payment</span><span><b>→</b> No made-up benchmarks or fake proof</span><span><b>→</b> Recommendations tied to observed evidence</span></div>
        </div>
        <form className="cg3-form" id="request" onSubmit={submitLead}>
          <div className="cg3-form-top"><span className="cg3-section-kicker">REQUEST DETAILS</span><span className="cg3-form-mark" aria-hidden="true">↗</span></div>
          <label htmlFor="cg3-website">Company website</label>
          <input id="cg3-website" type="url" placeholder="https://yourcompany.com" value={website} onChange={(event) => setWebsite(event.target.value)} required />
          <label htmlFor="cg3-company">Company name <span>(optional)</span></label>
          <input id="cg3-company" type="text" placeholder="Your company" value={company} onChange={(event) => setCompany(event.target.value)} />
          <label htmlFor="cg3-email">Work email</label>
          <input id="cg3-email" type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="cg3-offer">What are you considering?</label>
          <select id="cg3-offer" value={offer} onChange={(event) => setOffer(event.target.value)}>
            <option>Buyer visibility snapshot — $99 pilot</option>
            <option>AI Buyer Visibility Sprint — $1,500</option>
          </select>
          <label htmlFor="cg3-goal">Your main question</label>
          <select id="cg3-goal" value={goal} onChange={(event) => setGoal(event.target.value)}>
            <option>Understand why competitors are recommended</option>
            <option>Check whether AI mentions our product</option>
            <option>Find the sources behind AI answers</option>
            <option>Prioritize our AI discovery strategy</option>
          </select>
          <button className="cg3-button cg3-button-primary cg3-submit" type="submit">Prepare request email <span aria-hidden="true">↗</span></button>
          {sent === "missing" && <p className="cg3-form-message" role="status">The request has not been sent: the site’s contact inbox is not configured. Please contact the site owner to finish setup.</p>}
          {sent === "prepared" && <p className="cg3-form-message" role="status">Your email app should open with the request prepared. Send that email to complete the request.</p>}
          <p className="cg3-form-note">No payment is taken here. The browser opens an email draft; it does not submit silently.</p>
        </form>
      </section>

      <section className="cg3-faq">
        <div className="cg3-faq-heading"><span className="cg3-section-kicker">A FEW STRAIGHT ANSWERS</span><h2>Less mystery. <em>More method.</em></h2></div>
        <div className="cg3-faq-list">
          <details><summary>Can you guarantee a ChatGPT ranking?</summary><p>No. AI answers vary by prompt, model, location, and time. We measure observed visibility and recommend changes supported by evidence.</p></details>
          <details><summary>Is this just traditional SEO?</summary><p>It overlaps with technical SEO and content quality, but also examines AI-generated mentions, citations, recommendation prompts, and competitor presence.</p></details>
          <details><summary>Does the free checker measure AI visibility?</summary><p>No. The free checker inspects public homepage technical signals. Engine-level visibility research is a separate, scoped engagement.</p></details>
          <details><summary>Do you fabricate reviews or third-party mentions?</summary><p>No. The work focuses on accurate company facts, useful content, technical clarity, and legitimate external sources—not fake reviews or spam.</p></details>
        </div>
      </section>
    </main>
  );
}
