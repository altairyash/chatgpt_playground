import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

function isPrivateAddress(ip: string) {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 198 && (b === 18 || b === 19));
  }
  const normalized = ip.toLowerCase();
  return normalized === "::1" || normalized === "::" ||
    normalized.startsWith("fc") || normalized.startsWith("fd") ||
    normalized.startsWith("fe80:") || normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") || normalized.startsWith("::ffff:192.168.");
}

async function safeUrl(raw: string) {
  const url = new URL(raw);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("Use a public HTTP or HTTPS website URL.");
  if (url.username || url.password) throw new Error("URLs with embedded credentials are not supported.");
  if (["localhost", "localhost.localdomain"].includes(url.hostname.toLowerCase())) throw new Error("Please enter a public website.");
  const ipVersion = isIP(url.hostname);
  const addresses = ipVersion ? [{ address: url.hostname }] : await lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some((item) => isPrivateAddress(item.address))) {
    throw new Error("This address does not appear to be a public website.");
  }
  return url;
}

async function getPublicResponse(raw: string) {
  let current = raw;
  for (let i = 0; i < 4; i++) {
    const url = await safeUrl(current);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    let response: Response;
    try {
      response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": "SignalAuditBot/1.0 (+https://signalsaudit.example; public homepage diagnostic)" },
      });
    } finally {
      clearTimeout(timer);
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) return response;
      current = new URL(location, url).toString();
      continue;
    }
    return response;
  }
  throw new Error("Too many redirects. Try the final URL shown in your browser.");
}

function check(label: string, passed: boolean, detail: string) {
  return { label, status: passed ? "pass" : "review", detail };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body?.url !== "string" || body.url.length > 2048) {
      return NextResponse.json({ error: "Enter a valid website URL." }, { status: 400 });
    }
    let candidate = body.url.trim();
    if (!/^https?:\/\//i.test(candidate)) candidate = "https://" + candidate;
    const url = await safeUrl(candidate);
    const response = await getPublicResponse(url.toString());
    if (!response.ok) {
      return NextResponse.json({ error: `The website returned HTTP ${response.status}. Check the URL and try again.` }, { status: 422 });
    }
    const type = response.headers.get("content-type") || "";
    if (!type.toLowerCase().includes("text/html")) {
      return NextResponse.json({ error: "That URL did not return an HTML page. Try the website homepage." }, { status: 422 });
    }
    const reader = response.body?.getReader();
    if (!reader) throw new Error("The page response was empty.");
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (total < 1_000_000) {
      const { done, value } = await reader.read();
      if (done) break;
      const piece = value.subarray(0, Math.max(0, 1_000_000 - total));
      chunks.push(piece);
      total += piece.length;
      if (piece.length < value.length) break;
    }
    await reader.cancel().catch(() => undefined);
    const html = new TextDecoder().decode(Buffer.concat(chunks));
    const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1]?.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() || "";
    const description = html.match(/<meta\b(?=[^>]*\bname\s*=\s*["']description["'])(?=[^>]*\bcontent\s*=\s*["']([^"']*)["'])[^>]*>/i)?.[1] || "";
    const canonical = /<link\b(?=[^>]*\brel\s*=\s*["'][^"']*canonical[^"']*["'])[^>]*\bhref\s*=\s*["']([^"']+)["']/i.test(html) ||
      /<link\b(?=[^>]*\bhref\s*=\s*["'][^"']+["'])(?=[^>]*\brel\s*=\s*["'][^"']*canonical[^"']*["'])[^>]*>/i.test(html);
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    const jsonLd = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["']/i.test(html);
    const robotsMeta = html.match(/<meta\b(?=[^>]*\bname\s*=\s*["']robots["'])[^>]*\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] || "";
    const xRobots = response.headers.get("x-robots-tag") || "";
    const noindex = /noindex/i.test(robotsMeta) || /noindex/i.test(xRobots);
    const images = [...html.matchAll(/<img\b([^>]*)>/gi)];
    const missingAlt = images.filter((match) => !/\balt\s*=\s*["'][^"']*["']/i.test(match[1])).length;
    const hasLang = /<html\b[^>]*\blang\s*=/i.test(html);
    const pageUrl = response.url || url.toString();
    const origin = new URL(pageUrl);
    async function probe(path: string) {
      const target = new URL(path, origin);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2200);
      try {
        const probeResponse = await fetch(target, {
          method: "GET",
          redirect: "error",
          signal: controller.signal,
          headers: { "user-agent": "SignalAuditBot/1.0 (+public AEO readiness check)" },
        });
        await probeResponse.body?.cancel().catch(() => undefined);
        return { ok: probeResponse.ok, status: probeResponse.status };
      } catch {
        return { ok: false, status: 0 };
      } finally {
        clearTimeout(timer);
      }
    }
    const [robotsProbe, sitemapProbe, llmsProbe] = await Promise.all([
      probe("/robots.txt"), probe("/sitemap.xml"), probe("/llms.txt"),
    ]);
    const checks = [
      check("Page is reachable", true, `Homepage returned HTTP ${response.status}.`),
      check("Page title", Boolean(title), title ? `Found “${title.slice(0, 140)}” (${title.length} characters).` : "No HTML title was detected."),
      check("Meta description", Boolean(description.trim()), description.trim() ? `Found a description (${description.trim().length} characters).` : "No meta description was detected in the page HTML."),
      check("Main heading (H1)", h1Count === 1, h1Count === 0 ? "No H1 heading was detected." : h1Count === 1 ? "One H1 tag was detected." : `${h1Count} H1 tags were detected; review whether they reflect a clear page hierarchy.`),
      check("Canonical URL", canonical, canonical ? "A canonical link tag was detected." : "No canonical link tag was detected."),
      check("Structured data (JSON-LD)", jsonLd, jsonLd ? "At least one JSON-LD script was detected; validity is not confirmed." : "No JSON-LD script was detected. It is only useful when relevant and accurate."),
      check("Indexing directives", !noindex, noindex ? "A noindex directive was detected; confirm this page is meant to stay out of search results." : "No noindex directive was detected in the inspected HTML or response header."),
      check("Image alternative text", missingAlt === 0, images.length ? (missingAlt ? `${missingAlt} of ${images.length} image tags lack an explicit alt attribute.` : `${images.length} image tags have an alt attribute.`) : "No standard img tags were detected in the returned HTML."),
      check("Document language", hasLang, hasLang ? "The HTML element declares a language." : "The HTML element has no lang attribute in the returned HTML."),
      check("Open Graph metadata", /<meta\\b[^>]*property\\s*=\\s*["']og:title["']/i.test(html) && /<meta\\b[^>]*property\\s*=\\s*["']og:description["']/i.test(html), "Open Graph title and description help platforms interpret and preview the page; this is a supporting signal, not a ranking guarantee."),
      check("Robots.txt", robotsProbe.ok, robotsProbe.ok ? "robots.txt is reachable. Its directives were not deeply validated." : "robots.txt was not reachable at the standard path; confirm crawler rules are intentionally configured."),
      check("XML sitemap", sitemapProbe.ok, sitemapProbe.ok ? "sitemap.xml is reachable. Its URLs and freshness were not validated." : "sitemap.xml was not reachable at the standard path; confirm a sitemap exists and is submitted where appropriate."),
      check("llms.txt discovery file", llmsProbe.ok, llmsProbe.ok ? "llms.txt is reachable. This emerging convention is not a confirmed requirement for AI visibility." : "No reachable llms.txt was detected at the standard path. Consider one as optional documentation, not a guaranteed ranking lever."),
    ];
    return NextResponse.json({
      url: pageUrl,
      checkedAt: new Date().toISOString(),
      score: Math.round(checks.filter((item) => item.status === "pass").length / checks.length * 100),
      checks,
      note: "AEO readiness snapshot based on homepage HTML and a few standard public files. It does not query AI answer engines, measure brand mentions, validate schema, crawl the whole site, or predict rankings/citations.",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The audit could not be completed.";
    const safeMessage = message.includes("fetch failed") || message.includes("ENOTFOUND") || message.includes("timed out") || message.includes("abort") ?
      "The site could not be reached from our scanner. Check that the URL is public and try again." : message;
    return NextResponse.json({ error: safeMessage }, { status: 400 });
  }
}
