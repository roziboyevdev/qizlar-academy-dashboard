import { Outlet, useLocation, useResolvedPath, Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export default function createBreadcrumbs() {
  return [
    {
      path: '/',
      element: <Breadcrumbs text="Bosh sahifa" />,
      children: [
        {
          path: 'dashboard',
          element: <Breadcrumbs text="Statistika" />,
        },
        {
          path: 'kurslar',
          element: <Breadcrumbs text="Kurslar" />,
          children: [
            {
              path: ':courseId',
              element: <Breadcrumbs text="Bo'limlar" />,
              children: [
                {
                  path: ':moduleId',
                  element: <Breadcrumbs text="Darslar" />,
                  children: [
                    {
                      path: ':lessonId',
                      element: <Breadcrumbs text="Quizlar" />,
                    },
                  ],
                },
              ],
            },
            {
              path: ':courseId/comments',
              element: <Breadcrumbs text="Izohlar" />,
            },
             {
              path: ':courseId/influencer',
              element: <Breadcrumbs text="Influencer" />,
            },
          ],
        },
        {
          path: 'grandmasters',
          element: <Breadcrumbs text="Grandmasterlar" />,
        },
        {
          path: 'afisha',
          element: <Breadcrumbs text="Afisha" />,
        },
        {
          path: 'review-games',
          element: <Breadcrumbs text="Tahlillar" />,
        },
        {
          path: 'live-streams',
          element: <Breadcrumbs text="Jonli efir" />,
        },
        {
          path: 'puzzles',
          element: <Breadcrumbs text="Boshqotirmalar" />,
        },
        {
          path: 'notifications',
          element: <Breadcrumbs text="Bildirishnomalar" />,
        },
        {
          path: 'story',
          element: <Breadcrumbs text="Istoriyalar" />,
        },
        {
          path: 'teachers',
          element: <Breadcrumbs text="Ustozlar" />,
        },
        {
          path: 'banner',
          element: <Breadcrumbs text="Bannerlar" />,
        },
        {
          path: 'category',
          element: <Breadcrumbs text="Kategoriyalar" />,
          children: [
            {
              path: ':categoryId',
              element: <Breadcrumbs text="Mahsulotlar" />,
            },
          ],
        },
        {
          path: 'user-certificate',
          element: <Breadcrumbs text="Talabalar sertifikati" />,
        },
        {
          path: 'market-tasks',
          element: <Breadcrumbs text="Market vazifalari" />,
        },
        {
          path: 'market-promocode',
          element: <Breadcrumbs text="Market promocode" />,
        },
        {
          path: 'orders',
          element: <Breadcrumbs text="Buyurtmalar" />,
        },
        {
          path: 'vacancy',
          element: <Breadcrumbs text="Vakansiyalar" />,
        },
        {
          path: 'promocode',
          element: <Breadcrumbs text="Promocode" />,
        },
        {
          path: 'exam/:lessonId',
          element: <Breadcrumbs text="Imtihon" />,
        },
        {
          path: 'battle-question/:lessonId',
          element: <Breadcrumbs text="Jang savollari" />,
        },
        {
          path: 'half-completed-course-users',
          element: <Breadcrumbs text="Yarim yakunlangan kurslar" />,
        },
      ],
    },
  ];
}

function Breadcrumbs({ text }: { text: string }) {
  const location = useLocation();
  const resolvedLocation = useResolvedPath('');
  const isActive = location.pathname === resolvedLocation.pathname;

  return (
    <div className="flex gap-1">
      <Breadcrumb>
        <BreadcrumbList>
          {isActive ? (
            <BreadcrumbItem>
              <BreadcrumbPage>{text}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={resolvedLocation.pathname}>{text}</Link>
              </BreadcrumbLink>
              <BreadcrumbSeparator />
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <Outlet />
    </div>
  );
}