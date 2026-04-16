import { Moon, Sun } from "lucide-react"
import { useTheme } from "providers/ThemeProvider"

import { Button } from "components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu"

const ModeToggle = () => {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative shrink-0">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
          <span className="sr-only">Mavzuni almashtirish</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Yorug‘ rejim
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Qorong‘u rejim
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Tizim (avtomatik)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModeToggle