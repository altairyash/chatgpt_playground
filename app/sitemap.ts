import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.citeglance.com/",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://www.citeglance.com/aeo-guide",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.citeglance.com/chatgpt-visibility",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://www.citeglance.com/services",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
