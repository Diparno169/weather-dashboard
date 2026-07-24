import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://skyline-weather.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
