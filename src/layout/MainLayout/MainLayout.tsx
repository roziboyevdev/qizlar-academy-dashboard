import { type ReactNode, useMemo, useState } from 'react';
import Header from '../Header';
import SideNav from '../SideNav';
import { Outlet, useRoutes } from 'react-router-dom';
import createBreadcrumbs from 'components/Breadcrumb';
import { Seo } from 'components/Seo';

interface IProps {
  /** Marshrutlar `Outlet` orqali — yoki (masalan, /courses) aniq sahifa */
  children?: ReactNode;
}

const MainLayout = ({ children }: IProps) => {
  const [isSideNavOpen, setSideNavOpen] = useState(true);
  const breadcrumbRoutes = useMemo(() => createBreadcrumbs(), []);
  const breadcrumbs = useRoutes(breadcrumbRoutes);
  return (
    <div className="flex w-full">
      <Seo
        title="Boshqaruv paneli"
        description="Qizlar Akademiyasi boshqaruv paneli — kurslar, modullar va foydalanuvchilarni boshqarish."
        noindex
      />
      <SideNav isSideNavOpen={isSideNavOpen} />
      <div className="w-full">
        <Header setSideNavOpen={setSideNavOpen} isSideNavOpen={isSideNavOpen} />
        <div className="flex justify-center">
          <div className="max-w-7xl w-full p-5 space-y-4 bg-background animate-in fade-in duration-500">
            {breadcrumbs}
            {children ?? <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
