import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AEO Audit Services | AEO Studio",
  description: "A focused Answer Engine Optimization audit with technical checks, content and entity gaps, public citation research, and a prioritized action plan.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main>
      <nav className="nav shell">
        <Link className="brand" href="/">AEO<span className="brand-light"> studio</span></Link>
        <Link className="nav-link" href="/#assessment">Request an assessment ↗</Link>
      </nav>
      <article className="shell guide-article">
        <div className="eyebrow">SERVICES · CLEAR SCOPE</div>
        <h1>A practical AEO audit. <em>No ranking promises.</em></h1>
        <p className="guide-lede">A focused review of how clearly your brand is represented on your website and across relevant public sources, turned into a prioritized action plan.</p>
        <section className="guide-section">
          <h2>Foundations Sprint</h2>
          <p><strong>₹4,999 one-time pilot price</strong> for one brand and one website. Scope is confirmed before payment.</p>
          <div className="guide-checklist">
            <div className="guide-check"><span className="guide-number">01</span><div><h3>Technical readiness</h3><p>Review metadata, indexing signals, canonical setup, structured-data presence, and discovery files.</p></div></div>
            <div className="guide-check"><span className="guide-number">02</span><div><h3>Brand and content clarity</h3><p>Find gaps in core company facts, buyer questions, page structure, and supporting evidence.</p></div></div>
            <div className="guide-check"><span className="guide-number">03</span><div><h3>Public-source research</h3><p>Review relevant public citations and competitor positioning. Any AI-answer tests are labeled with the actual platform and method used.</p></div></div>
            <div className="guide-check"><span className="guide-number">04</span><div><h3>Prioritized action plan</h3><p>Get a practical 30-day roadmap with effort and impact notes for each recommendation.</p></div></div>
          </div>
          <p>The free scanner is only a technical snapshot. The paid audit does not include automatic ongoing monitoring or guarantee that an AI assistant will mention, cite, or recommend your brand.</p>
          <Link className="button button-primary" href="/#assessment">Discuss your website ↗</Link>
        </section>
        <section className="guide-section">
          <h2>After the audit</h2>
          <p>You can implement the recommendations yourself. Hands-on implementation or ongoing monitoring is separately scoped and quoted. We do not sell fake reviews, spammy placements, or fabricated visibility reports.</p>
        </section>
      </article>
      <footer className="footer"><div className="shell footer-inner"><Link className="brand" href="/">AEO<span className="brand-light"> studio</span></Link><span>Useful evidence. Practical improvements. No ranking guarantees.</span><span>© {new Date().getFullYear()} AEO Studio</span></div></footer>
    </main>
  );
}
