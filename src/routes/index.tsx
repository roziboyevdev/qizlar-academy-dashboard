import React, { Suspense, lazy, useContext } from 'react';
import { Routes as DOMRoutes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import MainLayout from 'layout/MainLayout';
import AuthLayout from 'layout/AuthLayout';
import { Toaster } from 'components/ui/toaster';
import Loader from 'components/Loader';
import { useRefreshToken } from 'modules/auth/hooks/useRefreshToken';
import { AuthContext } from 'providers/auth';
import { UserContext } from 'providers/UserProvider';
import { UserRole } from 'modules/auth/types';

const AuthPage = lazy(() => import('pages/Auth'));
const LandingPage = lazy(() => import('pages/Landing'));
const HomePage = lazy(() => import('pages/Home'));
const CoursesPage = lazy(() => import('pages/Courses'));
const ModulesPage = lazy(() => import('pages/Modules'));
const LessonsPage = lazy(() => import('pages/Lessons'));
const PuzzlesPage = lazy(() => import('pages/Puzzles'));
const NotificationsPage = lazy(() => import('pages/Notifications'));
const LastExam = lazy(() => import('pages/LastExam'));
const BannerPage = lazy(() => import('pages/Banner/Page'));
const CategoryPage = lazy(() => import('pages/Category/Page'));
const ProductPage = lazy(() => import('pages/Product/Page'));
const UsersCertificatesPage = lazy(() => import('pages/UsersCertificates/Page'));
const VacancyPage = lazy(() => import('pages/Vacancy'));
const TeachersPage = lazy(() => import('pages/Teachers/Page'));
const NewQuizPage = lazy(() => import('pages/NewQuiz'));
const PromocodePage = lazy(() => import('pages/Promocode'));
const OrdersPage = lazy(() => import('pages/Orders/Page'));
const CourseInfluencerPage = lazy(() => import('pages/CourseInfluencer/Page'));
const MarketPromocodePage = lazy(() => import('pages/MarketPromocode/Page'));
const StoryV2Page = lazy(() => import('pages/StoryV2/Page'));
const BattleQuestionPage = lazy(() => import('pages/BattleQuestion'));
const MarketTasksPage = lazy(() => import('pages/MarketTasks/Page'));
const UsersHalfComplitedCoursesPage = lazy(
  () => import('pages/StatisticsHalfCompleteCourse/Page')
);
const CourseComments = lazy(() => import('pages/courses-comments'));
const SkillsPage = lazy(() => import('pages/Skills'));

const routePermissions: { [key: string]: UserRole[] } = {
  '/dashboard': [UserRole.SUPER_ADMIN, UserRole.STATISTICS_ADMIN, UserRole.CALL_CENTER],
  '/teachers': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/courses': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN, UserRole.TOP_30_ADMIN],
  '/courses/:courseId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/exam/:lessonId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/battle-question/:lessonId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/courses/:courseId/:moduleId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/courses/:courseId/influencer': [UserRole.SUPER_ADMIN, UserRole.TOP_30_ADMIN],
  '/courses/:courseId/:moduleId/:lessonId': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/puzzles': [UserRole.SUPER_ADMIN],
  '/notifications': [UserRole.SUPER_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/story': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/banner': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/category': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/category/:categoryId': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/user-certificate': [UserRole.SUPER_ADMIN],
  '/promocode': [UserRole.SUPER_ADMIN],
  '/market-promocode': [UserRole.SUPER_ADMIN],
  '/market-tasks': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/orders': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/vacancy': [UserRole.SUPER_ADMIN],
  '/skills': [UserRole.SUPER_ADMIN],
};

const routes = [
  { path: '/dashboard', element: <HomePage /> },
  { path: '/teachers', element: <TeachersPage /> },
  { path: '/courses', element: <CoursesPage /> },
  { path: '/courses/:courseId', element: <ModulesPage /> },
  { path: '/exam/:lessonId', element: <LastExam /> },
  { path: '/battle-question/:lessonId', element: <BattleQuestionPage /> },
  { path: '/courses/:courseId/:moduleId', element: <LessonsPage /> },
  { path: '/courses/:courseId/comments', element: <CourseComments /> },
  { path: '/courses/:courseId/influencer', element: <CourseInfluencerPage /> },
  { path: '/courses/:courseId/:moduleId/:lessonId', element: <NewQuizPage /> },
  { path: '/puzzles', element: <PuzzlesPage /> },
  { path: '/notifications', element: <NotificationsPage /> },
  { path: '/story', element: <StoryV2Page /> },
  { path: '/banner', element: <BannerPage /> },
  { path: '/category', element: <CategoryPage /> },
  { path: '/category/:categoryId', element: <ProductPage /> },
  { path: '/user-certificate', element: <UsersCertificatesPage /> },
  { path: '/promocode', element: <PromocodePage /> },
  { path: '/market-promocode', element: <MarketPromocodePage /> },
  { path: '/market-tasks', element: <MarketTasksPage /> },
  { path: '/orders', element: <OrdersPage /> },
  { path: '/vacancy', element: <VacancyPage /> },
  { path: '/half-completed-course-users', element: <UsersHalfComplitedCoursesPage /> },
  { path: '/skills', element: <SkillsPage /> },
];

function RequireAuth() {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

function LoginRoute() {
  const { isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <AuthLayout>
      <AuthPage />
    </AuthLayout>
  );
}

function CoursesPublicOrAdmin() {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <LandingPage />;
  }
  return (
    <MainLayout>
      <CoursesPage />
    </MainLayout>
  );
}

function CourseDeepLinkOrAdmin() {
  const { isAuthenticated } = useContext(AuthContext);
  const { userData } = useContext(UserContext);
  const { courseId } = useParams();

  // Marketing deep-linklar (UUID) har doim landingni ochishi kerak.
  const isUuidCourseLink = !!courseId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(courseId);
  if (isUuidCourseLink) {
    return <LandingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = userData?.role;
  const canAccessCourseModules = !!role && routePermissions['/courses/:courseId']?.includes(role);
  if (!canAccessCourseModules) {
    return <NotFoundRoute />;
  }

  return (
    <MainLayout>
      <ModulesPage />
    </MainLayout>
  );
}

function NotFoundRoute() {
  const { isAuthenticated } = useContext(AuthContext);
  const { userData } = useContext(UserContext);
  if (!isAuthenticated) {
    return <LandingPage />;
  }
  const role = userData?.role;
  if (role === UserRole.NOTIFICATION_ADMIN) {
    return <Navigate to="/notifications" replace />;
  }
  if (role === UserRole.COURSE_ADMIN || role === UserRole.TOP_30_ADMIN) {
    return <Navigate to="/courses" replace />;
  }
  if (role === UserRole.SHOP_ADMIN) {
    return <Navigate to="/orders" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

export const Routes = () => {
  const { isLoading } = useRefreshToken();
  const { isAuthenticated } = useContext(AuthContext);
  const { userData } = useContext(UserContext);

  const getFilteredRoutes = () => {
    if (!userData?.role) return [];
    if (userData.role === UserRole.SUPER_ADMIN) return routes;
    return routes.filter((route) => routePermissions[route.path]?.includes(userData.role));
  };

  const adminRoutesToRender = (isAuthenticated ? getFilteredRoutes() : routes).filter(
    (route) => route.path !== '/courses' && route.path !== '/courses/:courseId'
  );

  return (
    <>
      <Suspense fallback={<Loader />}>
        {isLoading ? null : isAuthenticated && !userData?.role ? (
          <Loader />
        ) : (
          <DOMRoutes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<LandingPage />} />
            <Route path="/courses" element={<CoursesPublicOrAdmin />} />
            <Route path="/courses/:courseId" element={<CourseDeepLinkOrAdmin />} />
            <Route path="/advantages" element={<LandingPage />} />
            <Route path="/testimonials" element={<LandingPage />} />
            <Route path="/register" element={<LandingPage />} />
            <Route path="/login" element={<LoginRoute />} />

            <Route element={<RequireAuth />}>
              <Route element={<MainLayout />}>
                {adminRoutesToRender.map((route) => (
                  <Route path={route.path} element={route.element} key={route.path} />
                ))}
              </Route>
            </Route>

            <Route path="*" element={<NotFoundRoute />} />
          </DOMRoutes>
        )}
      </Suspense>
      <Toaster />
    </>
  );
};
