import type { MetadataRoute } from 'next';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lending-girls.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/login', '/dashboard', '/kurslar', '/teachers'];

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
