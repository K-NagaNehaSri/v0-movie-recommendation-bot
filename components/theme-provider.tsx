"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"
type ColorTheme = "default" | "ocean" | "forest" | "sunset" | "lavender" | "ruby"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  storageKey?: string
  colorStorageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  colorTheme: ColorTheme
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  colorTheme: "default",
  setTheme: () => null,
  setColorTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "default",
  storageKey = "movie-bot-theme",
  colorStorageKey = "movie-bot-color-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultColorTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    const storedColorTheme = localStorage.getItem(colorStorageKey) as ColorTheme | null
    if (storedTheme) setTheme(storedTheme)
    if (storedColorTheme) setColorTheme(storedColorTheme)
    setMounted(true)
  }, [storageKey, colorStorageKey])

  useEffect(() => {
    if (!mounted) return
    const root = window.document.documentElement

    // Remove all theme classes
    root.classList.remove("light", "dark")
    root.classList.remove("theme-default", "theme-ocean", "theme-forest", "theme-sunset", "theme-lavender", "theme-ruby")

    // Add color theme class
    root.classList.add(`theme-${colorTheme}`)

    // Determine and add light/dark mode
    let resolvedTheme = theme
    if (theme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    root.classList.add(resolvedTheme)
    
    // Also set data attribute for compatibility
    root.setAttribute("data-theme", colorTheme)
    root.setAttribute("data-mode", resolvedTheme)
  }, [theme, colorTheme, mounted])
  
  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== "system") return
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(e.matches ? "dark" : "light")
      root.setAttribute("data-mode", e.matches ? "dark" : "light")
    }
    
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  const value = {
    theme,
    colorTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    setColorTheme: (colorTheme: ColorTheme) => {
      localStorage.setItem(colorStorageKey, colorTheme)
      setColorTheme(colorTheme)
    },
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
