import { PanelLeftClose, PanelRightClose } from 'lucide-react';

import { Button } from 'components/ui/button';
import ProfileDropdown from 'components/layout/ProfileDropdown';
import { LogoWithName } from 'components/BrandLogo';

interface IProps {
  setSideNavOpen: (state: boolean) => void;
  isSideNavOpen: boolean;
}

const Header = ({ setSideNavOpen, isSideNavOpen }: IProps) => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 justify-self-end w-full">
      <div className="flex h-14 items-center justify-between gap-2 px-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button variant="outline" className="shrink-0 px-2" onClick={() => setSideNavOpen(!isSideNavOpen)}>
            {isSideNavOpen ? (
              <PanelLeftClose className="size-5 stroke-1 text-foreground" />
            ) : (
              <PanelRightClose className="size-5 stroke-1 text-foreground" />
            )}
          </Button>
          {!isSideNavOpen ? (
            <div className="min-w-0 flex-1 md:flex-initial">
              <LogoWithName className="h-7 max-h-7 md:h-8 md:max-h-8" />
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-x-3">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
