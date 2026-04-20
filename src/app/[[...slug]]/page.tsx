import type { Metadata } from 'next';
import LegacyAppShell from 'legacy/LegacyAppShell';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return {
      title: 'Dashboard',
      alternates: { canonical: '/' },
    };
  }

  const normalizedPath = `/${slug.join('/')}`;
  return {
    alternates: { canonical: normalizedPath },
  };
}

export default function CatchAllPage() {
  return <LegacyAppShell />;
}
