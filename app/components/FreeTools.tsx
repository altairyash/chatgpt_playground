"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "./ui/Tabs";

type ToolTab = "robots" | "llms" | "meta";
const toolTabs: ToolTab[] = ["robots", "llms", "meta"];

function normalizeHttpUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if ((url.protocol !== "https:" && url.protocol !== "http:") || url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function downloadText(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function FreeTools() {
  const [active, setActive] = useState<ToolTab>("robots");
  const [robotsMode, setRobotsMode] = useState("open");
  const [sitemap, setSitemap] = useState("");
  const [blockTraining, setBlockTraining] = useState(false);
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [pageDescription, setPageDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [pageType, setPageType] = useState("website");
  const [pageUrls, setPageUrls] = useState("");
  const [copied, setCopied] = useState("");
  const normalizedSitemap = sitemap.trim() ? normalizeHttpUrl(sitemap) : null;
  const normalizedSiteUrl = normalizeHttpUrl(siteUrl);
  const normalizedOgImage = ogImage.trim() ? normalizeHttpUrl(ogImage) : null;
  const invalidPageUrlCount = pageUrls.split("\n").map((item) => item.trim()).filter(Boolean)
    .filter((item) => !normalizeHttpUrl(item)).length;

  const robotsOutput = useMemo(() => {
    const lines: string[] = [];
    if (robotsMode === "closed") {
      lines.push("User-agent: *", "Disallow: /");
    } else {
      lines.push("User-agent: *", "Disallow:");
    }
    if (blockTraining) {
      lines.push("", "# Optional: block selected AI training crawlers");
      for (const bot of ["GPTBot", "ClaudeBot", "Google-Extended", "CCBot"]) {
        lines.push("", `User-agent: ${bot}`, "Disallow: /");
      }
      lines.push("", "# Review each provider's current crawler documentation before publishing.");
    }
    if (normalizedSitemap) lines.push("", "Sitemap: " + normalizedSitemap);
    return lines.join("\n");
  }, [robotsMode, normalizedSitemap, blockTraining]);

  const llmsOutput = useMemo(() => {
    const name = siteName.trim() || "Your site";
    const description = siteDescription.trim() || "Add a short, accurate description of this website.";
    const urls = pageUrls.split("\n").map((item) => normalizeHttpUrl(item.trim())).filter((item): item is string => Boolean(item));
    return [
      `# ${name}`,
      "",
      description,
      "",
      "## Key pages",
      ...(urls.length ? urls.map((url) => { const label = url.replace(/^https?:\/\//, "").replace(/[\[\]()]/g, "_").slice(0, 180); const markdownUrl = url.replace(/\(/g, "%28").replace(/\)/g, "%29"); return "- [" + label + "](" + markdownUrl + ")"; }) : ["- Add valid public HTTP or HTTPS page URLs in the field above."]),
      "",
      "> Keep this file accurate and useful. It is a discovery aid, not a guarantee of AI citations.",
    ].join("\n");
  }, [siteName, siteDescription, pageUrls]);

  const metaOutput = useMemo(() => {
    const canonical = normalizedSiteUrl;
    const title = escapeHtml(pageTitle.trim() || "Your page title");
    const description = escapeHtml(pageDescription.trim() || "Add a concise, accurate page description.");
    const image = normalizedOgImage;
    return [
      "<!-- Basic metadata -->",
      `<title>${title}</title>`,
      `<meta name="description" content="${description}" />`,
      "",
      "<!-- Open Graph -->",
      ...(canonical ? [`<link rel="canonical" href="${escapeHtml(canonical)}" />`] : ["<!-- Add a valid HTTP(S) page URL to include canonical and og:url tags. -->"]),
      '<meta property="og:type" content="' + pageType + '" />',
      ...(canonical ? [`<meta property="og:url" content="${escapeHtml(canonical)}" />`] : []),
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
      ...(image ? [`<meta property="og:image" content="${escapeHtml(image)}" />`] : []),
      "",
      "<!-- X / Twitter -->",
      '<meta name="twitter:card" content="summary_large_image" />',
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${description}" />`,
      ...(image ? [`<meta name="twitter:image" content="${escapeHtml(image)}" />`] : []),
    ].join("\n");
  }, [normalizedSiteUrl, pageTitle, pageDescription, normalizedOgImage, pageType]);

  async function copyOutput(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      window.setTimeout(() => setCopied(""), 1800);
    } catch {
      setCopied("Copy unavailable — select the output and copy it manually.");
    }
  }

  const output = active === "robots" ? robotsOutput : active === "llms" ? llmsOutput : metaOutput;

  return (
    <main className="cg4-inner cg4-free-tools-page">
      <div className="shell">
<header className="free-tools-hero">
        <div className="eyebrow">FREE · NO ACCOUNT REQUIRED</div>
        <h1>Small tools for a more <em>discoverable website.</em></h1>
        <p>Generate useful website files and metadata in your browser. No account, no paywall, and no claim that a generated file alone will make an AI assistant cite you.</p>
        <div className="free-tools-pills"><span>Runs in your browser</span><span>Copy or download</span><span>Nothing submitted to CiteGlance</span></div>
      </header>

      <section className="free-tools-workbench" aria-label="Free website tools">
        <TabsRoot value={active} onValueChange={(value) => { setActive(value as ToolTab); setCopied(""); }} className="cg21-tabs-root">
          <TabsList className="free-tools-tabs" aria-label="Choose a tool">
            <TabsTrigger id="free-tools-tab-robots" value="robots">robots.txt builder</TabsTrigger>
            <TabsTrigger id="free-tools-tab-llms" value="llms">llms.txt starter</TabsTrigger>
            <TabsTrigger id="free-tools-tab-meta" value="meta">Open Graph tags</TabsTrigger>
          </TabsList>
          <TabsContent value={active} key={active} id="free-tools-panel" tabIndex={0}> 
            <div className="free-tools-columns">
          <div className="free-tools-fields">
            {active === "robots" && <>
              <h2>Build your robots.txt</h2>
              <p>Choose a simple crawl policy and optionally add selected AI training bot rules. Review carefully before publishing; robots.txt is a request, not access control.</p>
              <label htmlFor="robots-mode">Default crawler access</label>
              <select id="robots-mode" value={robotsMode} onChange={(e) => setRobotsMode(e.target.value)}><option value="open">Allow crawling across the site</option><option value="closed">Block all crawlers across the site</option></select>
              {robotsMode === "closed" && <p className="free-tools-warning">This blocks all crawlers site-wide, including search and retrieval crawlers. Only use it if that is intentional.</p>}
              <label className="free-tools-checkbox"><input type="checkbox" checked={blockTraining} onChange={(e) => setBlockTraining(e.target.checked)} /> Add rules blocking selected AI training crawlers</label>
              <label htmlFor="sitemap-url">Sitemap URL (optional)</label>
              <input id="sitemap-url" type="url" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="https://example.com/sitemap.xml" />
              {sitemap.trim() && !normalizedSitemap && <p className="free-tools-warning">Use a public HTTP or HTTPS sitemap URL. The invalid value is omitted from the output.</p>}
              <p className="free-tools-warning">Important: blocking crawlers may reduce discovery. Training crawlers and search/retrieval crawlers can be different; this preset does not block every AI-related bot.</p>
            </>}
            {active === "llms" && <>
              <h2>Create an llms.txt starter</h2>
              <p>Make a plain-text guide to your important public pages. It uses only the details you enter here; it does not crawl or invent website content.</p>
              <label htmlFor="llms-name">Website or brand name</label><input id="llms-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Acme Software" />
              <label htmlFor="llms-description">Short, factual description</label><textarea id="llms-description" value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} placeholder="What does the company do, and who is it for?" rows={3} />
              <label htmlFor="llms-urls">Important public URLs (one per line)</label><textarea id="llms-urls" value={pageUrls} onChange={(e) => setPageUrls(e.target.value)} placeholder={"https://example.com/product\nhttps://example.com/pricing\nhttps://example.com/docs"} rows={6} />
              {invalidPageUrlCount > 0 && <p className="free-tools-warning">{invalidPageUrlCount} invalid URL(s) are omitted. Enter complete public HTTP or HTTPS URLs.</p>}
              <p className="free-tools-warning">Check every URL and statement before publishing. llms.txt is an emerging convention, not a ranking factor guarantee.</p>
            </>}
            {active === "meta" && <>
              <h2>Generate social metadata</h2>
              <p>Prepare basic HTML and Open Graph tags for link previews. Use a public, absolute URL for the canonical page and preview image.</p>
              <label htmlFor="meta-url">Canonical page URL</label><input id="meta-url" type="url" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="https://example.com/page" />
              {siteUrl.trim() && !normalizedSiteUrl && <p className="free-tools-warning">Enter a valid public HTTP or HTTPS page URL to generate canonical tags.</p>}
              <label htmlFor="meta-title">Page title</label><input id="meta-title" value={pageTitle} onChange={(e) => setPageTitle(e.target.value)} placeholder="A clear, specific page title" />
              <label htmlFor="meta-description">Description</label><textarea id="meta-description" value={pageDescription} onChange={(e) => setPageDescription(e.target.value)} placeholder="Summarize the page accurately." rows={3} />
              <label htmlFor="meta-image">Social preview image URL (optional)</label><input id="meta-image" type="url" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/social-card.png" />
              {ogImage.trim() && !normalizedOgImage && <p className="free-tools-warning">Use a public HTTP or HTTPS image URL. The invalid value is omitted.</p>}
              <label htmlFor="meta-type">Page type</label><select id="meta-type" value={pageType} onChange={(e) => setPageType(e.target.value)}><option value="website">Website</option><option value="article">Article</option><option value="product">Product</option></select>
            </>}
          </div>
          <div className="free-tools-output">
            <div className="free-tools-output-head"><div><span className="eyebrow">LIVE OUTPUT</span><strong>{active === "robots" ? "robots.txt" : active === "llms" ? "llms.txt" : "meta-tags.html"}</strong></div><span className="free-tools-live">LIVE PREVIEW</span></div>
            <pre aria-label="Generated file preview">{output}</pre>
            <div className="free-tools-output-actions">
              <button type="button" onClick={() => copyOutput(output, "Copied to clipboard.")}>Copy output</button>
              <button type="button" onClick={() => downloadText(active === "robots" ? "robots.txt" : active === "llms" ? "llms.txt" : "meta-tags.html", output, active === "meta" ? "text/html" : "text/plain")}>Download file</button>
            </div>
            {copied && <p className="free-tools-copied" role="status">{copied}</p>}
            </div>
          </TabsContent>
        </TabsRoot>
      </section>

      <section className="free-tools-next">
        <div><div className="eyebrow">THE NEXT STEP</div><h2>Files are a start.<br/><em>Evidence is better.</em></h2><p>Use the free AEO readiness check to inspect your public homepage, then get a scoped review if you need buyer-prompt research, competitor comparisons, and prioritized actions.</p></div>
        <div className="free-tools-next-actions"><Link className="button button-primary" href="/#free-check">Run the free site check <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/services">Explore the paid sprint ↗</Link></div>
      </section>
      </div>
    </main>
  );
}
