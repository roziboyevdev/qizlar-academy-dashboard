import React, { useContext } from 'react';

import MainLayout from 'layout/MainLayout';
import AuthLayout from 'layout/AuthLayout';
import { Routes as DOMRoutes, Route } from 'react-router-dom';
import { Toaster } from 'components/ui/toaster';
import { useRefreshToken } from 'modules/auth/hooks/useRefreshToken';
import AuthPage from 'pages/Auth';
import HomePage from 'pages/Home';
import CoursesPage from 'pages/Courses';
import ModulesPage from 'pages/Modules';
import LessonsPage from 'pages/Lessons';
import NewsPage from 'pages/News';
import PuzzlesPage from 'pages/Puzzles';
import Info from 'pages/Info';
import NotificationsPage from 'pages/Notifications';
import { AuthContext } from 'providers/auth';
import Certificate from 'pages/Certificate/Page';
import LastExam from 'pages/LastExam';
import StoryPage from 'pages/Story/Page';
import BannerPage from 'pages/Banner/Page';
import CategoryPage from 'pages/Category/Page';
import ProductPage from 'pages/Product/Page';
import DonationPage from 'pages/Donation/Page';
import PremiumPlanPage from 'pages/PremiumPlans/Page';
import PremiumPage from 'pages/Premium/Page';
import UsersCertificatesPage from 'pages/UsersCertificates/Page';
import VacancyPage from 'pages/Vacancy';
import TeachersPage from 'pages/Teachers/Page';
import NewQuizPage from 'pages/NewQuiz';
import PromocodePage from 'pages/Promocode';
import OrdersPage from 'pages/Orders/Page';
import MeetingPage from 'pages/Meeting';
import CourseAssistantPage from 'pages/CourseAssistant/Page';
import MarketPromocodePage from 'pages/MarketPromocode/Page';

export const Routes = () => {
  const { isLoading } = useRefreshToken();
  const { isAuthenticated } = useContext(AuthContext);
  const routes = [
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/teachers',
      element: <TeachersPage />,
    },
    {
      path: '/courses',
      element: <CoursesPage />,
    },
    {
      path: '/course-assistants',
      element: <CourseAssistantPage />,
    },
    {
      path: '/courses/:courseId',
      element: <ModulesPage />,
    },
    {
      path: '/exam/:lessonId',
      element: <LastExam />,
    },
    {
      path: '/courses/:courseId/:moduleId',
      element: <LessonsPage />,
    },
    {
      path: '/courses/:courseId/:moduleId/:lessonId',
      element: <NewQuizPage />,
      // element: <QuizzesPage />,
    },

    {
      path: '/news',
      element: <NewsPage />,
    },

    {
      path: '/puzzles',
      element: <PuzzlesPage />,
    },
    {
      path: '/notifications',
      element: <NotificationsPage />,
    },
    {
      path: '/info',
      element: <Info />,
    },
    {
      path: '/certificate',
      element: <Certificate />,
    },
    {
      path: '/story',
      element: <StoryPage />,
    },
    {
      path: '/banner',
      element: <BannerPage />,
    },
    {
      path: '/category',
      element: <CategoryPage />,
    },
    {
      path: '/category/:categoryId',
      element: <ProductPage />,
    },
    {
      path: '/donation',
      element: <DonationPage />,
    },
    {
      path: '/premium-plan',
      element: <PremiumPlanPage />,
    },
    {
      path: '/premium',
      element: <PremiumPage />,
    },
    {
      path: '/user-certificate',
      element: <UsersCertificatesPage />,
    },
    {
      path: '/promocode',
      element: <PromocodePage />,
    },
      {
      path: '/market-promocode',
      element: <MarketPromocodePage />,
    },
    {
      path: '/orders',
      element: <OrdersPage />,
    },
    {
      path: '/vacancy',
      element: <VacancyPage />,
    },
    {
      path: '/meeting',
      element: <MeetingPage />,
    },
  ];

  return (
    <>
      {isLoading ? null : isAuthenticated ? (
        <MainLayout>
          <DOMRoutes>
            {routes.map((route) => (
              <Route path={route.path} element={route.element} key={route.path} />
            ))}
          </DOMRoutes>
        </MainLayout>
      ) : (
        <AuthLayout>
          <DOMRoutes>
            <Route path="/" element={<AuthPage />} />
            <Route path="*" element={<AuthPage />} />
          </DOMRoutes>
        </AuthLayout>
      )}
      <Toaster />
    </>
  );
};
