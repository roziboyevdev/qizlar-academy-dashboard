import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../index.css';

const siteName = 'Qizlar Akademiyasi';

const title = `${siteName} — qizlar uchun onlayn ta'lim platformasi, kurslar va mentorlik`;

const description =
  "Qizlar Akademiyasi — qizlar va ayollar uchun zamonaviy onlayn ta'lim platformasi. IT kurslari, ingliz tili, dizayn, biznes, SMM, dasturlash, mentorlik, sertifikatli kurslar va o'zbek tilidagi ta'lim dasturlari.";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://qizlarakademiyasi.uz'
).replace(/\/+$/, '');

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

  alternates: {
    canonical: '/',
    languages: {
      'uz-UZ': '/',
    },
  },

  keywords: [
    'Qizlar Akademiyasi',
    'qizlar akademiyasi uz',
    'qizlar uchun kurslar',
    "qizlar uchun onlayn ta'lim",
    'qizlar akademiyasi',
    'qizlar akademiyasi uzbekistan',
    'qizlar akademiyasi tashkent',
    'qizlar akademiyasi tashkent shahar',
    'qizlar akademiyasi tashkent shahar',
    'qiz',
    'qizlar',
    'qizlar ovozi',
    'qizlar uchun ta’lim platformasi',
    'ayollar uchun kurslar',
    'ayollar uchun ta’lim',
    "o'zbekcha kurslar",
    "o'zbek tilida kurslar",
    'online kurslar uzbekistan',
    'uzbekistan online education',
    'it kurslari',
    'dasturlash kurslari',
    'flutter kurslari',
    'python kurslari',
    'frontend kurslari',
    'backend kurslari',
    'grafik dizayn kurslari',
    'smm kurslari',
    'marketing kurslari',
    'biznes kurslari',
    'ingliz tili kurslari',
    'IELTS kurslari',
    'kompyuter savodxonligi',
    'masofaviy ta’lim',
    'sertifikatli kurslar',
    'mentorlik dasturi',
    'talabgir kasblar',
    'ish topish uchun kurslar',
    'uzbek qizlari uchun kurslar',
    'women education uzbekistan',
    'girls education platform',
    'online academy uzbekistan',
  ],

  category: 'education',

  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName,
    type: 'website',
    locale: 'uz_UZ',
    countryName: 'Uzbekistan',
    images: [
      {
        url: '/logo_only.svg',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/logo_only.svg'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },

  other: {
    author: 'Qizlar Akademiyasi',
    publisher: 'Qizlar Akademiyasi',
    copyright: 'Qizlar Akademiyasi',
    revisit: '7 days',
    distribution: 'global',
    rating: 'general',
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