import { Helmet } from 'react-helmet-async';
import { absoluteUrl, getSiteUrl } from 'config/site';

export type SeoProps = {
  title: string;
  description: string;
  /** To‘liq canonical yo‘li, masalan "/" yoki "/login" */
  canonicalPath?: string;
  /** Mutlaq yoki "/" bilan boshlangan rasm URL */
  ogImage?: string;
  keywords?: string[];
  noindex?: boolean;
  /** application/ld+json uchun bir yoki bir nechta obyekt */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function toOgImageUrl(ogImage: string | undefined): string | undefined {
  if (!ogImage) return undefined;
  if (ogImage.startsWith('http://') || ogImage.startsWith('https://')) return ogImage;
  return absoluteUrl(ogImage.startsWith('/') ? ogImage : `/${ogImage}`) || undefined;
}

export function Seo({
  title,
  description,
  canonicalPath,
  ogImage,
  keywords,
  noindex,
  jsonLd,
}: SeoProps) {
  const siteUrl = getSiteUrl();
  const canonical =
    canonicalPath !== undefined && siteUrl
      ? `${siteUrl}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
      : canonicalPath !== undefined
        ? canonicalPath
        : undefined;

  const ogImageAbsolute = toOgImageUrl(ogImage);

  const robots = noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  const jsonLdBlocks = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet prioritizeSeoTags htmlAttributes={{ lang: 'uz' }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords?.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {canonical ? <link rel="alternate" hrefLang="uz-UZ" href={canonical} /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Qizlar Akademiyasi" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {ogImageAbsolute ? <meta property="og:image" content={ogImageAbsolute} /> : null}
      {ogImageAbsolute ? <meta property="og:image:alt" content={title} /> : null}
      <meta property="og:locale" content="uz_UZ" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImageAbsolute ? <meta name="twitter:image" content={ogImageAbsolute} /> : null}

      {jsonLdBlocks.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
