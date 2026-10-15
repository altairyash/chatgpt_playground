import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="cg3-footer cg4-site-footer">
      <Link className="cg3-brand" href="/" aria-label="CiteGlance home">
        <span className="cg3-brand-mark">c<span>.</span></span>
        <span>CiteGlance</span>
      </Link>
      <div className="cg3-footer-links">
        <Link href="/services">Services</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/free-tools">Free tools</Link>
        <Link href="/aeo-guide">AEO guide</Link>
        <Link href="/chatgpt-visibility">ChatGPT playbook</Link>
      </div>
      <p>Evidence-led AI buyer visibility research. No ranking guarantees.</p>
      <span>© {new Date().getFullYear()} CiteGlance</span>
    </footer>
  );
}
