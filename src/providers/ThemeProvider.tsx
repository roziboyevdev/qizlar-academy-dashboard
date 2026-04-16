import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: "light" | "dark"
  setTheme: (theme: Theme) => void
}

function readStoredTheme(storageKey: string, defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme
  try {
    const raw = localStorage.getItem(storageKey)
    if (raw === "light" || raw === "dark" || raw === "system") return raw
  } catch {
    /* ignore */
  }
  return defaultTheme
}

function computeResolved(theme: Theme): "light" | "dark" {
  if (theme === "dark") return "dark"
  if (theme === "light") return "light"
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const initialState: ThemeProviderState = {
  theme: "light",
  resolvedTheme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => readStoredTheme(storageKey, defaultTheme))
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    computeResolved(readStoredTheme(storageKey, defaultTheme))
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    const resolved = computeResolved(theme)
    root.classList.add(resolved)
    setResolvedTheme(resolved)
  }, [theme])

  useEffect(() => {
    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      const resolved = mq.matches ? "dark" : "light"
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(resolved)
      setResolvedTheme(resolved)
    }
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  const setThemeAndStore = useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(storageKey, next)
      } catch {
        /* ignore */
      }
      setTheme(next)
    },
    [storageKey]
  )

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme: setThemeAndStore,
    }),
    [theme, resolvedTheme, setThemeAndStore]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
