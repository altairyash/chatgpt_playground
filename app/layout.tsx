import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Audit — AEO & AI Search Readiness Audit",
  description:
    "Check your website’s readiness for AI search and answer engines. Review crawlability, metadata, structured data signals, and machine-readable content. Practical findings, no ranking promises.",
  metadataBase: new URL("https://chatgptplayground.vercel.app"),
  openGraph: {
    title: "Signal Audit — AEO & AI Search Readiness",
    description: "AEO readiness checks for crawlability, metadata, structured data signals, and AI-readable content. Practical findings without ranking guarantees.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
