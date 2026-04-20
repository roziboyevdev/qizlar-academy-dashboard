import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../index.css';

const siteName = 'Qizlar Akademiyasi';
const title = `${siteName} — qizlar uchun onlayn ta'lim platformasi`;
const description =
  "Qizlar Akademiyasi: qizlar uchun onlayn kurslar, mentorlik va zamonaviy ta'lim yo'nalishlari.";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://qizlarakademiyasi.uz/';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: '/logo_only.svg',
    shortcut: '/logo_only.svg',
    apple: '/logo_only.svg',
  },
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    'Qizlar Akademiyasi',
    'qizlar uchun kurslar',
    "qizlar uchun onlayn ta'lim",
    "ayollar uchun kurslar",
    "o'zbekcha kurslar",
    'it kurslari',
  ],
  openGraph: {
    title,
    description,
    url: '/',
    siteName,
    type: 'website',
    locale: 'uz_UZ',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
