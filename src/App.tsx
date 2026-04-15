import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import React from 'react';
import { Routes } from './routes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from 'services/react-query';
import { ThemeProvider } from 'providers/ThemeProvider';
import { AuthProvider } from 'providers/auth';
import { UserProvider } from 'providers/UserProvider';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? React.lazy(async () => {
        const mod = await import('@tanstack/react-query-devtools');
        return { default: mod.ReactQueryDevtools };
      })
    : null;

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <AuthProvider>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <ThemeProvider defaultTheme="light" storageKey="ui-theme">
                <Routes />
              </ThemeProvider>
            </BrowserRouter>
          </AuthProvider>
        </UserProvider>
        {ReactQueryDevtools ? (
          <React.Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </React.Suspense>
        ) : null}
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
