import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Signal Audit — Make your website easier to understand",
  description:
    "A practical technical audit for website structure, metadata, crawlability, and machine-readable content. Clear fixes, no ranking promises.",
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: "Signal Audit",
    description: "Clear, practical website search-readiness fixes.",
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
