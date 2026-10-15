#!/usr/bin/env python3
"""Conservative public-page technical SEO / AI-readiness audit.

Usage:
  python audit.py https://example.com --max-pages 20 --out report.md

Only audits public pages on the supplied host. Respects robots.txt disallow rules,
uses a delay between requests, and does not submit forms or access authenticated pages.
This is a starter diagnostic, not a ranking or AI-citation predictor.
"""
from __future__ import annotations

import argparse
import time
import urllib.error
import urllib.parse
import urllib.robotparser
import urllib.request
from collections import deque
from html.parser import HTMLParser
from pathlib import Path


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.in_title = False
        self.description = ""
        self.canonical = ""
        self.robots = ""
        self.h1 = []
        self._in_h1 = False
        self._h1_text = ""
        self.jsonld_count = 0
        self.links = []
        self.images_missing_alt = 0
        self.word_count = 0
        self._text = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            name = (a.get("name") or "").lower()
            if name == "description":
                self.description = a.get("content", "").strip()
            elif name == "robots":
                self.robots = a.get("content", "").strip()
        elif tag == "link" and "canonical" in (a.get("rel") or "").lower().split():
            self.canonical = a.get("href", "").strip()
        elif tag == "h1":
            self._in_h1 = True
            self._h1_text = ""
        elif tag == "script" and (a.get("type") or "").lower() == "application/ld+json":
            self.jsonld_count += 1
        elif tag == "a" and a.get("href"):
            self.links.append(a["href"])
        elif tag == "img" and not (a.get("alt") or "").strip():
            self.images_missing_alt += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "h1" and self._in_h1:
            self.h1.append(self._h1_text.strip())
            self._in_h1 = False

    def handle_data(self, data):
        text = data.strip()
        if self.in_title:
            self.title += data
        if self._in_h1:
            self._h1_text += data
        if text:
            self._text.append(text)
            self.word_count += len(text.split())


def fetch(url, timeout=12):
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "PublicSiteReadinessAudit/0.1 (+contact site owner before large crawls)"},
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        content_type = response.headers.get("Content-Type", "")
        body = response.read(1_500_000)
        return response.status, response.geturl(), content_type, response.headers, body


def normalize_url(href, base, host):
    absolute = urllib.parse.urljoin(base, href)
    p = urllib.parse.urlsplit(absolute)
    if p.scheme not in ("http", "https") or p.netloc.lower() != host.lower():
        return None
    if p.path.lower().endswith((".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".zip")):
        return None
    return urllib.parse.urlunsplit((p.scheme, p.netloc, p.path or "/", p.query, ""))


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("url", help="Public website URL, e.g. https://example.com")
    ap.add_argument("--max-pages", type=int, default=20)
    ap.add_argument("--delay", type=float, default=1.0)
    ap.add_argument("--out", default="readiness-report.md")
    args = ap.parse_args()

    start = args.url if "://" in args.url else "https://" + args.url
    parts = urllib.parse.urlsplit(start)
    if not parts.hostname:
        raise SystemExit("Please provide a valid public URL.")
    host = parts.netloc
    start = urllib.parse.urlunsplit((parts.scheme, parts.netloc, parts.path or "/", "", ""))

    robots_url = f"{parts.scheme}://{host}/robots.txt"
    rp = urllib.robotparser.RobotFileParser()
    rp.set_url(robots_url)
    try:
        rp.read()
        robots_status = "read successfully"
    except Exception:
        robots_status = "unavailable; crawl restricted to the supplied start URL"
    ua = "PublicSiteReadinessAudit"
    queue = deque([start])
    seen = set()
    rows = []
    errors = []

    while queue and len(seen) < max(1, min(args.max_pages, 100)):
        url = queue.popleft()
        if url in seen:
            continue
        seen.add(url)
        if url != start and not rp.can_fetch(ua, url):
            continue
        if url == start and robots_status != "read successfully":
            # With no robots.txt, audit only the explicitly supplied URL.
            pass
        elif not rp.can_fetch(ua, url):
            continue
        try:
            status, final_url, ctype, headers, body = fetch(url)
            if "text/html" not in ctype.lower():
                rows.append({"url": url, "status": status, "note": f"Skipped non-HTML content ({ctype})"})
                continue
            parser = PageParser()
            parser.feed(body.decode("utf-8", errors="replace"))
            title = " ".join(parser.title.split())
            issues = []
            if not title:
                issues.append("missing title")
            elif len(title) > 60:
                issues.append(f"title long ({len(title)} chars)")
            if not parser.description:
                issues.append("missing meta description")
            elif len(parser.description) > 160:
                issues.append(f"description long ({len(parser.description)} chars)")
            if len(parser.h1) == 0:
                issues.append("missing H1")
            elif len(parser.h1) > 1:
                issues.append(f"{len(parser.h1)} H1 headings")
            if not parser.canonical:
                issues.append("missing canonical")
            if parser.jsonld_count == 0:
                issues.append("no JSON-LD detected")
            if "noindex" in parser.robots.lower():
                issues.append("page says noindex")
            if parser.images_missing_alt:
                issues.append(f"{parser.images_missing_alt} images missing alt")
            rows.append({
                "url": final_url, "status": status, "title": title or "(none)",
                "description": parser.description or "(none)",
                "h1": " | ".join(parser.h1) or "(none)",
                "canonical": parser.canonical or "(none)",
                "jsonld": parser.jsonld_count, "words": parser.word_count,
                "issues": issues or ["no basic checks failed"],
            })
            for href in parser.links:
                child = normalize_url(href, final_url, host)
                if child and child not in seen and child not in queue and rp.can_fetch(ua, child):
                    queue.append(child)
        except (urllib.error.URLError, TimeoutError, ValueError) as exc:
            errors.append((url, str(exc)))
        time.sleep(max(0.5, args.delay))

    lines = [
        "# Website AI/Search Readiness Report", "",
        f"- Start URL: {start}", f"- Host: {host}",
        f"- Pages visited: {len(rows)}", f"- robots.txt: {robots_status}",
        "", "> This automated checklist flags basic technical signals. It does not predict rankings, AI citations, or traffic. Review findings manually before making changes.", "",
        "## Summary", "",
    ]
    issue_total = sum(len(r.get("issues", [])) for r in rows)
    lines += [f"- Pages with results: {len(rows)}", f"- Flagged checks (not unique root causes): {issue_total}", ""]
    for i, row in enumerate(rows, 1):
        lines += [f"## {i}. {row['url']}", "", f"- HTTP status: {row['status']}"]
        if "note" in row:
            lines += [f"- Note: {row['note']}", ""]
            continue
        lines += [
            f"- Title: {row['title']}",
            f"- Meta description: {row['description']}",
            f"- H1: {row['h1']}",
            f"- Canonical: {row['canonical']}",
            f"- JSON-LD script blocks: {row['jsonld']}",
            f"- Approximate visible-text words: {row['words']}",
            "- Findings:",
        ]
        lines += [f"  - {issue}" for issue in row["issues"]]
        lines.append("")
    if errors:
        lines += ["## Fetch errors", ""] + [f"- {url}: {err}" for url, err in errors] + [""]
    lines += ["## Recommended next steps", "",
        "1. Manually verify each finding in the browser and page source.",
        "2. Prioritize crawl/indexing blockers and incorrect canonical or noindex directives.",
        "3. Add valid structured data only where it accurately describes visible page content.",
        "4. Improve page titles, descriptions, headings, and image alternatives where useful.",
        "5. Re-run the audit after changes and document what changed.", "",
    ]
    Path(args.out).write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {args.out} ({len(rows)} page results).")


if __name__ == "__main__":
    main()
