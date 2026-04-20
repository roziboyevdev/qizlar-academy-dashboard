import type { MetadataRoute } from 'next';

const siteUrl =
  (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://qizlarakademiyasi.uz').replace(/\/+$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/about', '/kurslar', '/advantages', '/testimonials'];

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
