import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_CONFIG.url;

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/browse`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/rankings`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/add`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const vendors = await prisma.vendor.findMany({
      where: { status: "APPROVED" },
      select: { slug: true, updatedAt: true },
    });

    const vendorPages: MetadataRoute.Sitemap = vendors.map((v) => ({
      url: `${base}/vendor/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticPages, ...vendorPages];
  } catch {
    return staticPages;
  }
}
