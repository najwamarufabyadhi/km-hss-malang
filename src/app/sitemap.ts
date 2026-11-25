import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/public-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { posts } = await getPublishedPosts({ page: 1, limit: 100 });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/tentang`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/berita`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/struktur`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/anggota`, changeFrequency: "weekly", priority: 0.8 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/berita/${post.slug}`,
    lastModified: post.updated_at || post.published_at || undefined,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}
