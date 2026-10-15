import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CiteGlance Pricing | Free Tools, Snapshot & Visibility Sprint",
  description:
    "Start with free website tools, try a focused AI buyer-visibility snapshot, or commission a full competitor and citation-source research sprint.",
  alternates: { canonical: "/pricing" },
};

const tiers = [
  {
    name: "Free tools",
    price: "$0",
    cadence: "Always free",
    description: "Fix basic discovery and metadata issues yourself.",
    items: ["robots.txt builder", "llms.txt starter", "Open Graph metadata generator", "Free homepage readiness check"],
    cta: "Use free tools",
    href: "/free-tools",
    featured: false,
  },
  {
    name: "Buyer visibility snapshot",
    price: "$99",
    cadence: "One-time pilot price",
    description: "A small, decision-useful starting point for one B2B software brand.",
    items: ["Up to 10 buyer-intent prompts", "One agreed AI answer platform", "Up to 3 named competitors", "Observed answers and available citations", "Short findings summary with next steps"],
    cta: "Request a snapshot",
    href: "/#assessment",
    featured: true,
  },
  {
    name: "AI Buyer Visibility Sprint",
    price: "$1,500",
    cadence: "Fixed scope · one-time",
    description: "A deeper research engagement for growth-stage B2B software teams.",
    items: ["Up to 20 buyer-intent prompts", "Up to 3 AI answer platforms, subject to access", "Competitor and citation-source map", "Prompt-level evidence and methodology", "Prioritized 30-day action plan"],
    cta: "Discuss the sprint",
    href: "/services",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <main>
      <nav className="nav shell free-tools-nav">
        <Link className="brand" href="/"><span className="brand-mark">C</span><span>Cite<span className="brand-light">Glance</span></span></Link>
        <div className="aeonav-links"><Link className="nav-link" href="/free-tools">Free tools</Link><Link className="nav-link" href="/services">Services</Link><Link className="button button-primary" href="/#assessment">Get assessed <span aria-hidden="true">↗</span></Link></div>
      </nav>
      <header className="shell pricing-hero">
        <div className="eyebrow">STRAIGHTFORWARD PRICING</div>
        <h1>Start free.<br/><em>Pay for evidence when you need it.</em></h1>
        <p>Use the utilities without an account. If you need actual AI answer research, start with a small pilot before committing to a larger sprint. We only report what was observed and what could be verified.</p>
      </header>
      <section className="shell pricing-grid" aria-label="CiteGlance pricing plans">
        {tiers.map((tier) => (
          <article className={tier.featured ? "pricing-card pricing-featured" : "pricing-card"} key={tier.name}>
            {tier.featured && <span className="pricing-pilot-label">LOW-RISK FIRST STEP</span>}
            <h2>{tier.name}</h2>
            <div className="pricing-price">{tier.price}<span>{tier.cadence}</span></div>
            <p className="pricing-description">{tier.description}</p>
            <ul>{tier.items.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
            <Link className={tier.featured ? "button button-primary pricing-cta" : "button pricing-secondary pricing-cta"} href={tier.href}>{tier.cta} <span aria-hidden="true">↗</span></Link>
          </article>
        ))}
      </section>
      <section className="shell pricing-notes">
        <h2>What we won’t promise</h2>
        <p>AI answers vary by prompt, location, model, and time. We do not guarantee rankings, brand mentions, citations, leads, or revenue. Before any paid snapshot or sprint begins, we confirm the available platforms, exact scope, evidence format, and delivery date.</p>
        <p>The $99 snapshot is an early-access pilot offer. Its scope is deliberately narrow; it is not a recurring tracking subscription or a substitute for the full sprint.</p>
      </section>
      <footer className="footer"><div className="shell footer-inner"><Link className="brand" href="/"><span className="brand-mark">C</span><span>Cite<span className="brand-light">Glance</span></span></Link><span><Link href="/free-tools">Free tools</Link> · <Link href="/services">Services</Link></span><span>Evidence before promises.</span><span>© {new Date().getFullYear()} CiteGlance</span></div></footer>
    </main>
  );
}
