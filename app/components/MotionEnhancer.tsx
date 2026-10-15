"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelectors = [
  ".cg3-hero-copy", ".cg3-research-card", ".cg3-capabilities",
  ".cg3-section-intro", ".cg3-work-item", ".cg3-principle",
  ".cg3-offers-heading", ".cg3-offer-card", ".cg3-free-copy",
  ".cg3-tool-wrap", ".cg3-request-copy", ".cg3-form", ".cg3-faq-heading",
  ".cg3-faq-list", ".pricing-hero", ".pricing-card", ".pricing-notes",
  ".guide-article", ".guide-section", ".guide-cta", ".free-tools-hero",
  ".free-tools-workbench", ".free-tools-next",
];

export default function MotionEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(revealSelectors.join(",")));
    if (!nodes.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("cg4-motion-visible"));
      return;
    }
    nodes.forEach((node) => node.classList.add("cg4-motion-pending"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("cg4-motion-visible");
        entry.target.classList.remove("cg4-motion-pending");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -45px 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
