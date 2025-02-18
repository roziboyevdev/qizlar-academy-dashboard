import React, { useContext } from "react";

import MainLayout from "layout/MainLayout";
import AuthLayout from "layout/AuthLayout";
import { Routes as DOMRoutes, Route } from "react-router-dom";
import { Toaster } from "components/ui/toaster";
import { useRefreshToken } from "modules/auth/hooks/useRefreshToken";
import AuthPage from "pages/Auth";
import HomePage from "pages/Home";
import CoursesPage from "pages/Courses";
import ModulesPage from "pages/Modules";
import LessonsPage from "pages/Lessons";
import GrandmastersPage from "pages/Grandmasters";
import NewsPage from "pages/News";
import BooksPage from "pages/Books";
import AfishaPage from "pages/Afisha";
import ReviewGamesPage from "pages/ReviewGames";
import LiveStreamsPage from "pages/LiveStreams";
import PuzzlesPage from "pages/Puzzles";
import Info from "pages/Info";
import NotificationsPage from "pages/Notifications";
import { AuthContext } from "providers/auth";
import Certificate from "pages/Certificate/Page";
import LastExam from "pages/LastExam";
import StoryPage from "pages/Story/Page";
import BannerPage from "pages/Banner/Page";
import CategoryPage from "pages/Category/Page";
import ProductPage from "pages/Product/Page";
import DonationPage from "pages/Donation/Page";
import PremiumPlanPage from "pages/PremiumPlans/Page";
import PremiumPage from "pages/Premium/Page";
import UsersCertificatesPage from "pages/UsersCertificates/Page";
import VacancyPage from "pages/Vacancy";
import TeachersPage from "pages/Teachers/Page";
import NewQuizPage from "pages/NewQuiz";
import PromocodePage from "pages/Promocode";

export const Routes = () => {
  const { isLoading } = useRefreshToken();
  const { isAuthenticated } = useContext(AuthContext);
  const routes = [
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/teachers",
      element: <TeachersPage />,
    },
    {
      path: "/courses",
      element: <CoursesPage />,
    },
    {
      path: "/courses/:courseId",
      element: <ModulesPage />,
    },
    {
      path: "/exam/:lessonId",
      element: <LastExam />,
    },
    {
      path: "/courses/:courseId/:moduleId",
      element: <LessonsPage />,
    },
    {
      path: "/courses/:courseId/:moduleId/:lessonId",
      element: <NewQuizPage />,
      // element: <QuizzesPage />,
    },
    {
      path: "/grandmasters",
      element: <GrandmastersPage />,
    },
    {
      path: "/news",
      element: <NewsPage />,
    },
    {
      path: "/books",
      element: <BooksPage />,
    },
    {
      path: "/afisha",
      element: <AfishaPage />,
    },
    {
      path: "/review-games",
      element: <ReviewGamesPage />,
    },
    {
      path: "/live-streams",
      element: <LiveStreamsPage />,
    },
    {
      path: "/puzzles",
      element: <PuzzlesPage />,
    },
    {
      path: "/notifications",
      element: <NotificationsPage />,
    },
    {
      path: "/info",
      element: <Info />,
    },
    {
      path: "/certificate",
      element: <Certificate />,
    },
    {
      path: "/story",
      element: <StoryPage />,
    },
    {
      path: "/banner",
      element: <BannerPage />,
    },
    {
      path: "/category",
      element: <CategoryPage />,
    },
    {
      path: "/category/:categoryId",
      element: <ProductPage />,
    },
    {
      path: "/donation",
      element: <DonationPage />,
    },
    {
      path: "/premium-plan",
      element: <PremiumPlanPage />,
    },
    {
      path: "/premium",
      element: <PremiumPage />,
    },
    {
      path: "/user-certificate",
      element: <UsersCertificatesPage />,
    },
    {
      path: "/vacancy",
      element: <VacancyPage />,
    },
    {
      path: "/promocode",
      element: <PromocodePage />,
    },
  ];

  return (
    <>
      {isLoading ? null : isAuthenticated ? (
        <MainLayout>
          <DOMRoutes>
            {routes.map((route) => (
              <Route
                path={route.path}
                element={route.element}
                key={route.path}
              />
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
