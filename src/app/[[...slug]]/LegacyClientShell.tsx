'use client';

import dynamic from 'next/dynamic';

const LegacyAppShell = dynamic(() => import('legacy/LegacyAppShell'), {
  ssr: false,
});

export default function LegacyClientShell() {
  return <LegacyAppShell />;
}
