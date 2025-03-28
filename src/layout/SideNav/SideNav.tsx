import { Link, NavLink } from 'react-router-dom';
import {
  BookAudio,
  Newspaper,
  Bell,
  BadgeInfo,
  ShieldCheck,
  BrainCircuit,
  CircleFadingPlus,
  NotebookPen,
  ShoppingBag,
  HandCoins,
  Plane,
  BadgeCheck,
  GraduationCap,
  Handshake,
  User,
  TicketPercent,
  MailQuestion,
  CalendarClock,
  BarChart,
} from 'lucide-react';
import { Button } from 'components/ui/button';
import { cn } from 'utils/styleUtils';

interface IProps {
  isSideNavOpen: boolean;
}

const SideNav = ({ isSideNavOpen }: IProps) => {
  const menuItems = [
    {
      title: 'Statistika',
      icon: BarChart,
      link: '/',
    },
    {
      title: 'Ustozlar',
      icon: User,
      link: '/teachers',
    },
    {
      title: 'Kurslar',
      icon: BookAudio,
      link: '/courses',
    },
    {
      title: 'Yangiliklar',
      icon: Newspaper,
      link: '/news',
    },
    {
      title: 'Bildirishnomalar',
      icon: Bell,
      link: '/notifications',
    },
    {
      title: 'Malumotlar',
      icon: BadgeInfo,
      link: '/info',
    },
    {
      title: 'Sertifikatlar',
      icon: ShieldCheck,
      link: '/certificate',
    },
    {
      title: 'Istoriyalar',
      icon: CircleFadingPlus,
      link: '/story',
    },
    {
      title: 'Bannerlar',
      icon: NotebookPen,
      link: '/banner',
    },
    {
      title: "Do'kon",
      icon: ShoppingBag,
      link: '/category',
    },
    {
      title: 'Donation',
      icon: HandCoins,
      link: '/donation',
    },
    {
      title: 'PremiumPlan',
      icon: Plane,
      link: '/premium-plan',
    },
    {
      title: 'Premium',
      icon: BadgeCheck,
      link: '/premium',
    },
    {
      title: 'Talabalar Sertifikatlari',
      icon: GraduationCap,
      link: '/user-certificate',
    },
    {
      title: 'Promocode',
      icon: TicketPercent,
      link: '/promocode',
    },
    {
      title: 'Buyurtmalar',
      icon: MailQuestion,
      link: '/orders',
    },
    {
      title: 'Vakansiyalar',
      icon: Handshake,
      link: '/vacancy',
    },
    {
      title: 'Uchrashuvlar',
      icon: CalendarClock,
      link: '/meeting',
    },
  ];

  return (
    <aside className={cn({ 'w-full': isSideNavOpen }, 'sticky top-0 max-w-72 flex flex-col border-solid border-r-2 h-screen')}>
      <header className="z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-2">
        <Link to="/" className={`flex h-10 items-center gap-2 px-4 dark:text-white ${isSideNavOpen ? 'justify-start' : 'justify-center'}`}>
          {isSideNavOpen && <h1 className="font-semibold">UstozAI</h1>}
          {/* <Dices /> */}
          <BrainCircuit />
        </Link>
      </header>
      <div className="flex flex-col gap-1 p-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <NavLink to={item.link} key={index} className={({ isActive }) => cn({ 'bg-secondary': isActive }, 'dark:text-white rounded block')}>
            <Button variant="ghost" className={`w-full ${isSideNavOpen ? 'justify-start' : 'justify-center'}`}>
              <item.icon className="size-5 stroke-[1.3px]" />
              {isSideNavOpen && <span className="ml-3">{item.title}</span>}
            </Button>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default SideNav;
