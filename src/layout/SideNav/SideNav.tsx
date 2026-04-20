import { Link, NavLink } from 'react-router-dom';
import {
  BookAudio,
  Bell,
  ShieldCheck,
  CircleFadingPlus,
  NotebookPen,
  ShoppingBag,
  Handshake,
  TicketPercent,
  BarChart,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Button } from 'components/ui/button';
import { cn } from 'utils/styleUtils';
import { useContext, useState } from 'react';
import { UserContext } from 'providers/UserProvider';
import { UserRole } from 'modules/auth/types';
import { LogoMark, LogoWithName } from 'components/BrandLogo';

interface IProps {
  isSideNavOpen: boolean;
}

const routePermissions: { [key: string]: UserRole[] } = {
  '/dashboard': [UserRole.SUPER_ADMIN, UserRole.STATISTICS_ADMIN, UserRole.CALL_CENTER],
  '/teachers': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN],
  '/kurslar': [UserRole.SUPER_ADMIN, UserRole.COURSE_ADMIN, UserRole.TOP_30_ADMIN],
  '/puzzles': [UserRole.SUPER_ADMIN],
  '/notifications': [UserRole.SUPER_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/story': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/banner': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN, UserRole.NOTIFICATION_ADMIN],
  '/category': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/user-certificate': [UserRole.SUPER_ADMIN],
  '/promocode': [UserRole.SUPER_ADMIN],
  '/market-promocode': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/market-tasks': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/orders': [UserRole.SUPER_ADMIN, UserRole.SHOP_ADMIN],
  '/vacancy': [UserRole.SUPER_ADMIN],
  '/influencer': [UserRole.SUPER_ADMIN, UserRole.TOP_30_ADMIN],
  '/skills': [UserRole.SUPER_ADMIN],
};

const SideNav = ({ isSideNavOpen }: IProps) => {
  const { userData } = useContext(UserContext);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const menuItems = [
    {
      title: 'Statistika',
      icon: BarChart,
      link: '/dashboard',
    },
    {
      groupId: 'courses',
      title: 'Kurslar',
      icon: BookAudio,
      items: [
        { title: 'Ustozlar', link: '/teachers' },
        { title: 'Kurslar', link: '/kurslar' },
      ],
    },
    {
      title: 'Bildirishnomalar',
      icon: Bell,
      link: '/notifications',
    },
    {
      title: 'Talabalar sertifikati',
      icon: ShieldCheck,
      link: '/user-certificate',
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
      groupId: 'shop',
      title: "Do'kon",
      icon: ShoppingBag,
      items: [
        { title: 'Kategoriyalar', link: '/category' },
        { title: 'Buyurtmalar', link: '/orders' },
      ],
    },
    {
      groupId: 'promocodes',
      title: 'Promocodlar',
      icon: TicketPercent,
      items: [
        { title: 'Promocode', link: '/promocode' },
      ],
    },
    {
      title: 'Skillar',
      icon: Sparkles,
      link: '/skills',
    },
    {
      title: 'Vakansiyalar',
      icon: Handshake,
      link: '/vacancy',
    },
  ];

  const hasPermission = (item: any): boolean => {
    if (!userData?.role) return false;

    if (userData.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    if (item.link) {
      return routePermissions[item.link]?.includes(userData.role) ?? false;
    }

    if (item.items) {
      return item.items.some((subItem: any) => routePermissions[subItem.link]?.includes(userData.role));
    }

    return false;
  };

  const filteredMenuItems = menuItems.filter(hasPermission);

  return (
    <aside
      className={cn(
        'sticky top-0 flex flex-col border-r border-border bg-background h-screen text-muted-foreground transition-all duration-300 ease-in-out',
        isSideNavOpen ? 'w-72' : 'w-20'
      )}
    >
      <header className="z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 p-2 overflow-hidden">
        <Link
          to="/dashboard"
          className={`flex h-11 items-center gap-2 px-3 text-foreground transition-all duration-300 ${isSideNavOpen ? 'justify-start' : 'justify-center'}`}
        >
          <div className="flex items-center gap-2 shrink-0">
            {isSideNavOpen ? (
              <LogoWithName className="h-9 max-h-9 transition-all duration-300" />
            ) : (
              <LogoMark className="h-10 w-10 shrink-0 transition-all duration-300" />
            )}
          </div>
        </Link>
      </header>
      <div className="flex flex-col gap-1 p-2 overflow-y-auto">
        {filteredMenuItems.map((item, index) => (
          <div key={index}>
            {item.items ? (
              <div>
                <Button
                  variant="ghost"
                  onClick={() => toggleGroup(item.groupId)}
                  className={`w-full ${isSideNavOpen ? 'justify-between' : 'justify-center'} text-muted-foreground hover:text-foreground hover:bg-muted/70 dark:hover:bg-white/5 rounded-xl mb-1`}
                >
                  <div className="flex items-center">
                    <item.icon className="size-5 stroke-[1.5px]" />
                    {isSideNavOpen && <span className="ml-3 font-normal">{item.title}</span>}
                  </div>
                  {isSideNavOpen && (
                    <ChevronDown
                      className={`size-4 transition-transform ${expandedGroups[item.groupId] ? 'rotate-180' : ''}`}
                    />
                  )}
                </Button>
                <div className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  expandedGroups[item.groupId] && isSideNavOpen ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                )}>
                  <div className="overflow-hidden">
                    <div className="ml-[25px] border-l border-border/70 flex flex-col gap-1 py-1">
                      {item.items.map((subItem: any, subIndex: number) => (
                        <NavLink
                          to={subItem.link}
                          key={subIndex}
                          className={({ isActive }) =>
                            cn(
                              { 'text-foreground font-medium': isActive, 'text-muted-foreground hover:text-foreground': !isActive },
                              'block relative transition-all duration-200'
                            )
                          }
                        >
                          <Button variant="ghost" className="w-full justify-start py-0 h-9 bg-transparent hover:bg-transparent relative text-inherit">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 border-t border-border/70" />
                            <span className="pl-6 font-normal tracking-wide">{subItem.title}</span>
                          </Button>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  cn(
                    {
                      'bg-muted/90 border-border text-foreground shadow-sm ring-1 ring-primary/10 dark:bg-[#1c222b] dark:border-white/[0.08] dark:shadow-[0_4px_20px_-10px_rgba(232,48,125,0.2)] dark:ring-0':
                        isActive,
                      'border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground dark:hover:bg-white/5':
                        !isActive,
                    }, 
                    'rounded-xl block relative border transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) mb-1.5 active:scale-[0.97] group'
                  )
                }
              >
                {({ isActive }) => (
                  <Button variant="ghost" className={`w-full bg-transparent hover:bg-transparent ${isSideNavOpen ? 'justify-start' : 'justify-center'} text-inherit transition-colors duration-500`}>
                    <item.icon className={cn(
                      "size-5 stroke-[1.5px] transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)", 
                      isActive ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(232,48,125,0.4)]" : "group-hover:scale-110"
                    )} />
                    {isSideNavOpen && (
                      <span className={cn(
                        "ml-3 font-normal overflow-hidden whitespace-nowrap transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)",
                        isActive ? "translate-x-0 opacity-100" : "opacity-80 group-hover:opacity-100"
                      )}>
                        {item.title}
                      </span>
                    )}
                    {/* Subtle glow indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full shadow-[0_0_12px_rgba(232,48,125,0.8)] animate-in fade-in zoom-in duration-500" />
                    )}
                  </Button>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideNav;
