import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AEO Studio — AI Search Visibility & Answer Engine Optimization",
  description:
    "Improve how your brand is understood, mentioned, and cited in AI answers. AEO visibility baselines, citation research, competitor gaps, and practical optimization.",
  metadataBase: new URL("https://chatgptplayground.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "AEO Studio — AI Search Visibility",
    description: "Answer Engine Optimization for brand mentions, citations, competitor visibility, and content improvements. Evidence-led, with no ranking guarantees.",
    type: "website",
    url: "https://chatgptplayground.vercel.app/",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://chatgptplayground.vercel.app/#organization",
      name: "AEO Studio",
      url: "https://chatgptplayground.vercel.app/",
      description: "Answer Engine Optimization service focused on AI search visibility measurement, citation research, competitor analysis, and practical website and content improvements.",
    },
    {
      "@type": "WebSite",
      "@id": "https://chatgptplayground.vercel.app/#website",
      name: "AEO Studio",
      url: "https://chatgptplayground.vercel.app/",
      publisher: { "@id": "https://chatgptplayground.vercel.app/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "Service",
      "@id": "https://chatgptplayground.vercel.app/#aeo-service",
      name: "Answer Engine Optimization (AEO)",
      serviceType: "AI search visibility and Answer Engine Optimization",
      provider: { "@id": "https://chatgptplayground.vercel.app/#organization" },
      description: "AEO baseline assessment, citation and competitor research, and prioritized content and technical recommendations. No guaranteed rankings, citations, or revenue outcomes.",
      url: "https://chatgptplayground.vercel.app/#assessment",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
