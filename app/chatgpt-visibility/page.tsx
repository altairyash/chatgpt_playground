import type { Metadata } from "next";
import Link from "next/link";

const prompts = [
  { title: "Category discovery", example: "What are the best [category] tools for a [company type]?" },
  { title: "Use-case fit", example: "Which [category] product is best for [specific use case]?" },
  { title: "Comparison", example: "Compare [your brand] with [competitor] for [buyer need]." },
  { title: "Alternatives", example: "What are alternatives to [competitor] for a [team size] team?" },
  { title: "Trust and evidence", example: "Which [category] providers have strong evidence for [important outcome]?" },
];

export const metadata: Metadata = {
  title: "How to Check Whether ChatGPT Mentions Your Brand | AEO Studio",
  description: "A practical method to test brand mentions and citations in ChatGPT and other AI answer engines, record competitors, and turn observations into an AEO action plan.",
  alternates: { canonical: "/chatgpt-visibility" },
  openGraph: {
    title: "How to Check Whether ChatGPT Mentions Your Brand",
    description: "Build a repeatable AI visibility baseline with buyer prompts, citation records, competitor comparisons, and honest measurement.",
    type: "article",
  },
};

export default function ChatGPTVisibilityPage() {
  return (
    <main>
      <nav className="nav shell">
        <Link className="brand" href="/" aria-label="AEO Studio home"><span className="brand-mark">A</span><span>AEO<span className="brand-light"> studio</span></span></Link>
        <Link className="nav-link" href="/#assessment">Request an assessment <span aria-hidden="true">↗</span></Link>
      </nav>
      <article className="shell guide-article">
        <div className="eyebrow">AI VISIBILITY · PRACTICAL PLAYBOOK</div>
        <h1>How to check whether ChatGPT <em>mentions your brand.</em></h1>
        <p className="guide-lede">You do not need a mysterious “AI ranking score” to start. Build a small, repeatable set of buyer questions, record what each answer actually says, and keep the prompt, model, date, and evidence alongside every observation.</p>
        <p className="guide-updated">A practical measurement framework from AEO Studio · October 2026</p>

        <section className="guide-section">
          <h2>1. Start with buyer questions, not vanity prompts</h2>
          <p>Write prompts that reflect real decisions in your category. Include broad discovery questions, use-case questions, comparisons, alternatives, and questions about trust. Avoid only asking “What do you know about [brand]?”—that tests recall, not whether a buyer would encounter your brand naturally.</p>
          <div className="guide-checklist">
            {prompts.map((item, index) => (
              <div className="guide-check" key={item.title}>
                <span className="guide-number">{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{item.title}</h3><p>{item.example}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <h2>2. Record the answer and its evidence</h2>
          <p>For each run, save the exact prompt, platform and model when known, date, market or locale, whether your brand appeared, whether the description was accurate, and any source URLs shown. Keep the original answer or a dated capture where permitted. Do not treat an unlinked brand mention as a citation.</p>
          <p>Separate at least three outcomes: <strong>mention</strong> (the brand is named), <strong>citation</strong> (a source URL is provided), and <strong>recommendation fit</strong> (the answer connects the brand to the buyer&apos;s stated need). They are related but not interchangeable.</p>
        </section>

        <section className="guide-section">
          <h2>3. Compare competitors fairly</h2>
          <p>Use the same prompt set for your brand and competitors. Count observed appearances across the test set, note which URLs are cited, and classify the sources: your own site, independent editorial coverage, review platforms, directories, or other sources. Small prompt sets are directional evidence—not a universal market-share estimate.</p>
          <p>Repeat the test on a consistent schedule. Answers can vary by account, region, prompt wording, retrieval availability, and model updates, so preserve the conditions and label any changes you cannot control.</p>
        </section>

        <section className="guide-section">
          <h2>4. Turn findings into changes you can defend</h2>
          <div className="guide-checklist">
            <div className="guide-check"><span className="guide-number">A</span><div><h3>Fix factual gaps</h3><p>Make your product, audience, geography, differentiators, pricing model, and evidence clear and consistent across public pages.</p></div></div>
            <div className="guide-check"><span className="guide-number">B</span><div><h3>Improve answer-ready pages</h3><p>Answer specific buyer questions directly, cite primary evidence, show dates where freshness matters, and make authorship and company identity clear.</p></div></div>
            <div className="guide-check"><span className="guide-number">C</span><div><h3>Understand cited sources</h3><p>If independent pages repeatedly appear, study what they cover and pursue legitimate inclusion or corrections. Do not manufacture reviews or spam directories.</p></div></div>
            <div className="guide-check"><span className="guide-number">D</span><div><h3>Re-test before claiming impact</h3><p>Run the same prompts again after changes. Report observed differences and limitations; do not attribute every change to a single edit without evidence.</p></div></div>
          </div>
        </section>

        <section className="guide-section">
          <h2>Can this be fully automated?</h2>
          <p>Parts can be automated, but the measurement method matters. Approved model APIs can help run a repeatable prompt set; they are not necessarily identical to the consumer-facing ChatGPT search experience. Reliable tracking should state which product, endpoint, account type, and retrieval mode were actually tested. A technical website scanner alone cannot tell you whether ChatGPT recommends your brand.</p>
          <p>For a useful business baseline, combine actual answer observations with technical checks, citation research, and—when access is available—qualified visits and lead data. Treat scores as internal tracking aids, not promises of ranking or revenue.</p>
        </section>

        <section className="guide-cta">
          <div className="eyebrow">START WITH YOUR WEBSITE</div>
          <h2>Find technical gaps before changing content.</h2>
          <p>Run the free homepage check for metadata, crawlability signals, structured-data presence, and standard discovery files. It does not query AI engines or claim to measure brand mentions.</p>
          <Link className="button button-primary" href="/#free-check">Run the free AEO check <span aria-hidden="true">↗</span></Link>
          <p>Want help designing a repeatable prompt set and interpreting evidence? <Link href="/#assessment"><strong>Request an AEO baseline.</strong></Link></p>
        </section>
      </article>
      <footer className="footer"><div className="shell footer-inner"><Link className="brand" href="/"><span className="brand-mark">A</span><span>AEO<span className="brand-light"> studio</span></span></Link><span>Useful evidence. Practical improvements. No ranking guarantees.</span><span>© {new Date().getFullYear()} AEO Studio</span></div></footer>
    </main>
  );
}
