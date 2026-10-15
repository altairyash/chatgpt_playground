import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://chatgptplayground.vercel.app/",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://chatgptplayground.vercel.app/aeo-guide",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
