const trimTrailingSlashes = (url: string) => url.replace(/\/+$/, '');

/**
 * Canonical / Open Graph base URL. Set REACT_APP_SITE_URL in production
 * (masalan https://www.qizlarakademiyasi.uz yoki admin domeni).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.REACT_APP_SITE_URL?.trim();
  if (fromEnv) return trimTrailingSlashes(fromEnv);
  if (typeof window !== 'undefined' && window.location?.origin) {
    return trimTrailingSlashes(window.location.origin);
  }
  return 'https://www.qizlarakademiyasi.uz';
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!path.startsWith('/')) return `${base}/${path}`;
  return base ? `${base}${path}` : path;
}
