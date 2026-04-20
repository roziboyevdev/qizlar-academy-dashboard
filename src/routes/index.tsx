import React, { Suspense, lazy } from 'react';
import { Routes as DOMRoutes, Route } from 'react-router-dom';
import { Toaster } from 'components/ui/toaster';
import Loader from 'components/Loader';
const LandingPage = lazy(() => import('legacy-pages/Landing'));

export const Routes = () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <DOMRoutes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/kurslar" element={<LandingPage />} />
          <Route path="/advantages" element={<LandingPage />} />
          <Route path="/testimonials" element={<LandingPage />} />
          <Route path="/register" element={<LandingPage />} />
          <Route path="*" element={<LandingPage />} />
        </DOMRoutes>
      </Suspense>
      <Toaster />
    </>
  );
};
