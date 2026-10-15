import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AEO Studio — AI Search Visibility & Answer Engine Optimization",
  description:
    "Improve how your brand is understood, mentioned, and cited in AI answers. AEO visibility baselines, citation research, competitor gaps, and practical optimization.",
  metadataBase: new URL("https://chatgptplayground.vercel.app"),
  openGraph: {
    title: "AEO Studio — AI Search Visibility",
    description: "Answer Engine Optimization for brand mentions, citations, competitor visibility, and content improvements. Evidence-led, with no ranking guarantees.",
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
