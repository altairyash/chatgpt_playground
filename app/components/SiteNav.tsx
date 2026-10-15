"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const primaryLinks = [
  { label: "Method", path: "/#method", activePath: "/" },
  { label: "Free tools", path: "/free-tools", activePath: "/free-tools" },
  { label: "Pricing", path: "/pricing", activePath: "/pricing" },
  { label: "Services", path: "/services", activePath: "/services" },
];

export default function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [routePending, setRoutePending] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setRoutePending(false);
  }, [pathname]);

  function handleNavigation(href: string) {
    const targetPath = href.split("#")[0] || pathname;
    if (targetPath !== pathname) setRoutePending(true);
    setMenuOpen(false);
  }

  function homeAnchor(anchor: string) {
    return pathname === "/" ? anchor : "/" + anchor.replace(/^#/, "#");
  }

  return (
    <div className="cg4-nav-wrap">
      <span className={routePending ? "cg4-route-progress is-active" : "cg4-route-progress"} aria-hidden="true" />
      <nav className="cg3-nav cg4-site-nav" aria-label="Main navigation">
        <Link className="cg3-brand" href="/" onClick={() => handleNavigation("/")} aria-label="CiteGlance home">
          <span className="cg3-brand-mark">c<span>.</span></span>
          <span>CiteGlance</span>
        </Link>

        <div className={menuOpen ? "cg3-nav-links is-open" : "cg3-nav-links"}>
          {primaryLinks.map((item) => {
            const href = item.label === "Method" ? homeAnchor("#method") : item.path;
            const active = item.activePath === "/" ? pathname === "/" : pathname === item.activePath;
            return (
              <Link key={item.label} href={href} onClick={() => handleNavigation(href)}
                aria-current={active ? "page" : undefined}
                className={active ? "cg4-nav-link is-current" : "cg4-nav-link"}>
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link className="cg3-nav-cta" href={homeAnchor("#offers")} onClick={() => handleNavigation(homeAnchor("#offers"))}>
          Explore the research <span aria-hidden="true">↗</span>
        </Link>

        <button className={menuOpen ? "cg4-mobile-toggle is-open" : "cg4-mobile-toggle"} type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen} aria-controls="cg4-mobile-links" onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
      </nav>
      <div id="cg4-mobile-links" className={menuOpen ? "cg4-mobile-menu is-open" : "cg4-mobile-menu"} aria-hidden={!menuOpen}>
        {primaryLinks.map((item) => {
          const href = item.label === "Method" ? homeAnchor("#method") : item.path;
          const active = item.activePath === "/" ? pathname === "/" : pathname === item.activePath;
          return (
            <Link key={item.label} href={href} tabIndex={menuOpen ? 0 : -1}
              onClick={() => handleNavigation(href)} className={active ? "is-current" : ""}>
              {item.label}<span aria-hidden="true">↗</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
