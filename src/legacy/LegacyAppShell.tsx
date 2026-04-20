'use client';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'services/react-query';
import { Routes } from 'routes';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? React.lazy(async () => {
        const mod = await import('@tanstack/react-query-devtools');
        return { default: mod.ReactQueryDevtools };
      })
    : null;

export default function LegacyAppShell() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes />
        </BrowserRouter>
        {ReactQueryDevtools ? (
          <React.Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </React.Suspense>
        ) : null}
      </QueryClientProvider>
    </HelmetProvider>
  );
}
