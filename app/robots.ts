import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: "https://chatgptplayground.vercel.app/sitemap.xml",
    host: "https://chatgptplayground.vercel.app",
  };
}
