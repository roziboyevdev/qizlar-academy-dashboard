'use client';

import dynamic from 'next/dynamic';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import Loader from 'components/Loader';

const LegacyAppShell = dynamic(() => import('../../legacy/LegacyAppShell'), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-background px-4">
      <Loader className="my-0" />
      <p className="mt-4 text-center text-sm text-muted-foreground">Yuklanmoqda…</p>
    </div>
  ),
});

type BoundaryState = { error: Error | null };

class LegacyShellErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[LegacyAppShell]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-[40vh] p-8">
          <h1 className="text-lg font-semibold text-destructive">Ilova yuklanmadi</h1>
          <p className="mt-2 text-sm text-muted-foreground">{this.state.error.message}</p>
          <p className="mt-4 text-xs text-muted-foreground">
            Brauzer konsolini tekshiring. Sahifani yangilang yoki developerga xabar bering.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function LegacyClientShell() {
  return (
    <LegacyShellErrorBoundary>
      <LegacyAppShell />
    </LegacyShellErrorBoundary>
  );
}
