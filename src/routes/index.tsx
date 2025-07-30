import React, { useContext } from 'react';
import { Routes as DOMRoutes, Route, Navigate } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import AuthLayout from 'layout/AuthLayout';
import { Toaster } from 'components/ui/toaster';
import { useRefreshToken } from 'modules/auth/hooks/useRefreshToken';
import { AuthContext } from 'providers/auth';
import AuthPage from 'pages/Auth';
import HomePage from 'pages/Home';
import CoursesPage from 'pages/Courses';
import ModulesPage from 'pages/Modules';
import LessonsPage from 'pages/Lessons';
import NewsPage from 'pages/News';
import PuzzlesPage from 'pages/Puzzles';
import Info from 'pages/Info';
import NotificationsPage from 'pages/Notifications';
import Certificate from 'pages/Certificate/Page';
import LastExam from 'pages/LastExam';
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
import StoryV2Page from 'pages/StoryV2/Page';
import BattleQuestionPage from 'pages/BattleQuestion';
import { UserContext } from 'providers/UserProvider';
import { UserRole } from 'modules/auth/types';
import FortunaProductPage from 'pages/FortunaProduct/Page';
import FortunaPromocodePage from 'pages/FortunaPromocode/Page';

const routePermissions: { [key: string]: UserRole[] } = {
  '/': [UserRole.SUPER_ADMIN, UserRole.STATISTICS_ADMIN],
  '/teachers': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/courses': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/course-assistants': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/courses/:courseId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/exam/:lessonId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/battle-question/:lessonId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/courses/:courseId/:moduleId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/courses/:courseId/:moduleId/:lessonId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/news': [UserRole.SUPER_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/puzzles': [UserRole.SUPER_ADMIN],
  '/notifications': [UserRole.SUPER_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/info': [UserRole.SUPER_ADMIN],
  '/certificate': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/story': [UserRole.SUPER_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/banner': [UserRole.SUPER_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/category': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/category/:categoryId': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/donation': [UserRole.SUPER_ADMIN],
  '/premium-plan': [UserRole.SUPER_ADMIN],
  '/premium': [UserRole.SUPER_ADMIN],
  '/user-certificate': [UserRole.SUPER_ADMIN],
  '/promocode': [UserRole.SUPER_ADMIN],
  '/market-promocode': [UserRole.SUPER_ADMIN],
  '/orders': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/vacancy': [UserRole.SUPER_ADMIN],
  '/meeting': [UserRole.SUPER_ADMIN],
  '/fortuna-product': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/fortuna-promocode': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
};

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/teachers', element: <TeachersPage /> },
  { path: '/courses', element: <CoursesPage /> },
  { path: '/course-assistants', element: <CourseAssistantPage /> },
  { path: '/courses/:courseId', element: <ModulesPage /> },
  { path: '/exam/:lessonId', element: <LastExam /> },
  { path: '/battle-question/:lessonId', element: <BattleQuestionPage /> },
  { path: '/courses/:courseId/:moduleId', element: <LessonsPage /> },
  { path: '/courses/:courseId/:moduleId/:lessonId', element: <NewQuizPage /> },
  { path: '/news', element: <NewsPage /> },
  { path: '/puzzles', element: <PuzzlesPage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/info', element: <Info /> },
  { path: '/certificate', element: <Certificate /> },
  { path: '/story', element: <StoryV2Page /> },
  { path: '/banner', element: <BannerPage /> },
  { path: '/category', element: <CategoryPage /> },
  { path: '/category/:categoryId', element: <ProductPage /> },
  { path: '/donation', element: <DonationPage /> },
  { path: '/premium-plan', element: <PremiumPlanPage /> },
  { path: '/premium', element: <PremiumPage /> },
  { path: '/user-certificate', element: <UsersCertificatesPage /> },
  { path: '/promocode', element: <PromocodePage /> },
  { path: '/market-promocode', element: <MarketPromocodePage /> },
  { path: '/orders', element: <OrdersPage /> },
  { path: '/vacancy', element: <VacancyPage /> },
  { path: '/meeting', element: <MeetingPage /> },
  { path: '/fortuna-product', element: <FortunaProductPage /> },
  { path: '/fortuna-promocode', element: <FortunaPromocodePage /> },
];

export const Routes = () => {
  const { isLoading } = useRefreshToken();
  const { isAuthenticated } = useContext(AuthContext);
  const { userData } = useContext(UserContext);

  // Foydalanuvchi roliga asoslangan sahifalarni filtrlash
  const getFilteredRoutes = () => {
    if (!userData?.role) return [];
    if (userData.role === UserRole.SUPER_ADMIN) return routes;
    return routes.filter((route) => routePermissions[route.path]?.includes(userData.role));
  };

  return (
    <>
      {isLoading ? null : isAuthenticated ? (
        <MainLayout>
          <DOMRoutes>
            {getFilteredRoutes().map((route) => (
              <Route path={route.path} element={route.element} key={route.path} />
            ))}
            {/* Agar foydalanuvchi ruxsat berilmagan sahifaga kirmoqchi bo'lsa, bosh sahifaga yo'naltirish */}
            <Route path="*" element={<Navigate to="/" replace />} />
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

// import React, { useContext } from 'react';

// import MainLayout from 'layout/MainLayout';
// import AuthLayout from 'layout/AuthLayout';
// import { Routes as DOMRoutes, Route } from 'react-router-dom';
// import { Toaster } from 'components/ui/toaster';
// import { useRefreshToken } from 'modules/auth/hooks/useRefreshToken';
// import AuthPage from 'pages/Auth';
// import HomePage from 'pages/Home';
// import CoursesPage from 'pages/Courses';
// import ModulesPage from 'pages/Modules';
// import LessonsPage from 'pages/Lessons';
// import NewsPage from 'pages/News';
// import PuzzlesPage from 'pages/Puzzles';
// import Info from 'pages/Info';
// import NotificationsPage from 'pages/Notifications';
// import { AuthContext } from 'providers/auth';
// import Certificate from 'pages/Certificate/Page';
// import LastExam from 'pages/LastExam';
// // import StoryPage from 'pages/Story/Page';
// import BannerPage from 'pages/Banner/Page';
// import CategoryPage from 'pages/Category/Page';
// import ProductPage from 'pages/Product/Page';
// import DonationPage from 'pages/Donation/Page';
// import PremiumPlanPage from 'pages/PremiumPlans/Page';
// import PremiumPage from 'pages/Premium/Page';
// import UsersCertificatesPage from 'pages/UsersCertificates/Page';
// import VacancyPage from 'pages/Vacancy';
// import TeachersPage from 'pages/Teachers/Page';
// import NewQuizPage from 'pages/NewQuiz';
// import PromocodePage from 'pages/Promocode';
// import OrdersPage from 'pages/Orders/Page';
// import MeetingPage from 'pages/Meeting';
// import CourseAssistantPage from 'pages/CourseAssistant/Page';
// import MarketPromocodePage from 'pages/MarketPromocode/Page';
// import StoryV2Page from 'pages/StoryV2/Page';
// import BattleQuestionPage from 'pages/BattleQuestion';

// export const Routes = () => {
//   const { isLoading } = useRefreshToken();
//   const { isAuthenticated } = useContext(AuthContext);
//   const routes = [
//     {
//       path: '/',
//       element: <HomePage />,
//     },
//     {
//       path: '/teachers',
//       element: <TeachersPage />,
//     },
//     {
//       path: '/courses',
//       element: <CoursesPage />,
//     },
//     {
//       path: '/course-assistants',
//       element: <CourseAssistantPage />,
//     },
//     {
//       path: '/courses/:courseId',
//       element: <ModulesPage />,
//     },
//     {
//       path: '/exam/:lessonId',
//       element: <LastExam />,
//     },
//     {
//       path: '/battle-question/:lessonId',
//       element: <BattleQuestionPage />,
//     },
//     {
//       path: '/courses/:courseId/:moduleId',
//       element: <LessonsPage />,
//     },
//     {
//       path: '/courses/:courseId/:moduleId/:lessonId',
//       element: <NewQuizPage />,
//       // element: <QuizzesPage />,
//     },

//     {
//       path: '/news',
//       element: <NewsPage />,
//     },

//     {
//       path: '/puzzles',
//       element: <PuzzlesPage />,
//     },
//     {
//       path: '/notifications',
//       element: <NotificationsPage />,
//     },
//     {
//       path: '/info',
//       element: <Info />,
//     },
//     {
//       path: '/certificate',
//       element: <Certificate />,
//     },
//     {
//       path: '/story',
//       element: <StoryV2Page />,
//     },
//     {
//       path: '/banner',
//       element: <BannerPage />,
//     },
//     {
//       path: '/category',
//       element: <CategoryPage />,
//     },
//     {
//       path: '/category/:categoryId',
//       element: <ProductPage />,
//     },
//     {
//       path: '/donation',
//       element: <DonationPage />,
//     },
//     {
//       path: '/premium-plan',
//       element: <PremiumPlanPage />,
//     },
//     {
//       path: '/premium',
//       element: <PremiumPage />,
//     },
//     {
//       path: '/user-certificate',
//       element: <UsersCertificatesPage />,
//     },
//     {
//       path: '/promocode',
//       element: <PromocodePage />,
//     },
//     {
//       path: '/market-promocode',
//       element: <MarketPromocodePage />,
//     },
//     {
//       path: '/orders',
//       element: <OrdersPage />,
//     },
//     {
//       path: '/vacancy',
//       element: <VacancyPage />,
//     },
//     {
//       path: '/meeting',
//       element: <MeetingPage />,
//     },
//   ];

//   return (
//     <>
//       {isLoading ? null : isAuthenticated ? (
//         <MainLayout>
//           <DOMRoutes>
//             {routes.map((route) => (
//               <Route path={route.path} element={route.element} key={route.path} />
//             ))}
//           </DOMRoutes>
//         </MainLayout>
//       ) : (
//         <AuthLayout>
//           <DOMRoutes>
//             <Route path="/" element={<AuthPage />} />
//             <Route path="*" element={<AuthPage />} />
//           </DOMRoutes>
//         </AuthLayout>
//       )}
//       <Toaster />
//     </>
//   );
// };
