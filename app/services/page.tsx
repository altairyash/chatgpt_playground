import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Buyer Visibility Sprint | CiteGlance",
  description: "A buyer-intent AI search visibility study for growth-stage B2B SaaS companies, including competitor presence, citation-source research, and an actionable growth plan.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main>
      <nav className="nav shell">
        <Link className="brand" href="/">Cite<span className="brand-light">Glance</span></Link>
        <Link className="nav-link" href="/#assessment">Request an assessment ↗</Link>
      </nav>
      <article className="shell guide-article">
        <div className="eyebrow">SERVICES · CLEAR SCOPE</div>
        <h1>Know which software brands AI recommends. <em>And what sources shape the answer.</em></h1>
        <p className="guide-lede">For B2B SaaS teams where one qualified deal can be worth thousands of dollars. We test buyer-intent questions across selected AI answer platforms, map competitors and cited sources, then deliver a commercially prioritized action plan.</p>
        <section className="guide-section">
          <h2>AI Buyer Visibility Sprint</h2>
          <p><strong>$1,500 fixed-scope engagement</strong> for one B2B software brand, one primary market, up to 20 buyer-intent prompts, and up to three AI answer platforms, subject to access and reproducibility. Scope is confirmed before payment.</p>
          <div className="guide-checklist">
            <div className="guide-check"><span className="guide-number">01</span><div><h3>Technical readiness</h3><p>Review how the product is described and represented across key buyer-facing pages and discoverability signals.</p></div></div>
            <div className="guide-check"><span className="guide-number">02</span><div><h3>Brand and content clarity</h3><p>Identify high-intent questions buyers ask when comparing solutions, and where product positioning or proof is missing.</p></div></div>
            <div className="guide-check"><span className="guide-number">03</span><div><h3>Public-source research</h3><p>Record brand mentions, competitor mentions, answer context, and available source citations across the agreed prompt set. Record platform, date, and method; distinguish observations from assumptions.</p></div></div>
            <div className="guide-check"><span className="guide-number">04</span><div><h3>Prioritized action plan</h3><p>Get a prioritized 30-day action plan, competitor/source map, prompt-level findings, and recommendations ranked by likely commercial value and implementation effort.</p></div></div>
          </div>
          <p>The free scanner is only a technical snapshot and is not the paid deliverable. This sprint is a point-in-time research engagement, not continuous monitoring, and cannot guarantee that any AI assistant will mention, cite, or recommend your brand.</p>
          <Link className="button button-primary" href="/#assessment">Discuss your website ↗</Link>
        </section>
        <section className="guide-section">
          <h2>Optional implementation</h2>
          <p>Implementation, repeat measurement, and monthly monitoring can be separately scoped and quoted after the initial study. No fake reviews, paid-for undisclosed mentions, or fabricated visibility data. We do not sell fake reviews, spammy placements, or fabricated visibility reports.</p>
        </section>
      </article>
      <footer className="footer"><div className="shell footer-inner"><Link className="brand" href="/"><span className="brand-mark">C</span><span>Cite<span className="brand-light">Glance</span></span></Link><span><Link href="/free-tools">Free tools</Link> · <Link href="/pricing">Pricing</Link> · <Link href="/chatgpt-visibility">Guides</Link></span><span>Useful evidence. Practical improvements. No ranking guarantees.</span><span>© {new Date().getFullYear()} CiteGlance</span></div></footer>
    </main>
  );
}
