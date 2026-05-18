import type { NextConfig } from 'next';
import os from 'node:os';

/**
 * Devda Next.js `/_next/*` so‘rovlarini Origin bo‘yicha tekshiradi. `localhost`
 * ruxsat etilgan; `127.0.0.1` va mahalliy tarmoq IP alohida origin — ro‘yxatda
 * bo‘lmasa chunk 403 bo‘ladi → dynamic import tugamaydi, loader cheksiz turadi.
 *
 * Joriy mashinaning mahalliy (non-internal) IPv4 manzillari avtomatik qo‘shiladi.
 * Qo‘shimcha: NEXT_DEV_EXTRA_ORIGINS=hostname1,hostname2
 */
function localLanIPv4Addresses(): string[] {
  const set = new Set<string>();
  const nets = os.networkInterfaces();
  if (!nets) return [];
  for (const key of Object.keys(nets)) {
    for (const net of nets[key] ?? []) {
      const isV4 = net.family === 'IPv4' || net.family === 4;
      if (isV4 && !net.internal && net.address) {
        set.add(net.address);
      }
    }
  }
  return [...set];
}

const extraDevOrigins =
  process.env.NEXT_DEV_EXTRA_ORIGINS?.split(',')
    .map((h) => h.trim())
    .filter(Boolean) ?? [];

const discoverLan = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: [
    '127.0.0.1',
    ...(discoverLan ? localLanIPv4Addresses() : []),
    ...extraDevOrigins,
  ],
};

export default nextConfig;
