import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../index.css';

const siteName = 'Lending Girls';
const title = `${siteName} Dashboard`;
const description =
  "Lending Girls platformasi uchun boshqaruv paneli: kurslar, statistikalar, o'qituvchilar va foydalanuvchilar boshqaruvi.";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lending-girls.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    'Lending Girls',
    'dashboard',
    'education',
    'courses',
    "o'qituvchilar",
    'statistika',
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
