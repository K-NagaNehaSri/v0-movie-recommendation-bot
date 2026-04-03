"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState, useLayoutEffect } from "react"

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
  mounted: boolean
}

const initialState: ThemeProviderState = {
  theme: "system",
  colorTheme: "default",
  setTheme: () => null,
  setColorTheme: () => null,
  mounted: false,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

function applyTheme(colorTheme: ColorTheme, theme: Theme) {
  if (typeof window === "undefined") return
  
  const root = window.document.documentElement

  // Remove all theme classes
  root.classList.remove("light", "dark")
  root.classList.remove("theme-default", "theme-ocean", "theme-forest", "theme-sunset", "theme-lavender", "theme-ruby")

  // Add color theme class
  root.classList.add(`theme-${colorTheme}`)

  // Determine and add light/dark mode
  let resolvedTheme: "light" | "dark" = theme === "system" 
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme

  root.classList.add(resolvedTheme)
  
  // Also set data attribute for compatibility
  root.setAttribute("data-theme", colorTheme)
  root.setAttribute("data-mode", resolvedTheme)
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "default",
  storageKey = "movie-bot-theme",
  colorStorageKey = "movie-bot-color-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(defaultColorTheme)
  const [mounted, setMounted] = useState(false)

  // Load stored preferences and apply theme immediately on mount
  useIsomorphicLayoutEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null
    const storedColorTheme = localStorage.getItem(colorStorageKey) as ColorTheme | null
    
    const finalTheme = storedTheme || defaultTheme
    const finalColorTheme = storedColorTheme || defaultColorTheme
    
    if (storedTheme) setThemeState(storedTheme)
    if (storedColorTheme) setColorThemeState(storedColorTheme)
    
    // Apply theme immediately
    applyTheme(finalColorTheme, finalTheme)
    setMounted(true)
  }, [storageKey, colorStorageKey, defaultTheme, defaultColorTheme])

  // Re-apply theme when theme or colorTheme changes
  useEffect(() => {
    if (!mounted) return
    applyTheme(colorTheme, theme)
  }, [theme, colorTheme, mounted])
  
  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== "system") return
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      applyTheme(colorTheme, theme)
    }
    
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, colorTheme, mounted])

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
  }

  const setColorTheme = (newColorTheme: ColorTheme) => {
    localStorage.setItem(colorStorageKey, newColorTheme)
    setColorThemeState(newColorTheme)
  }

  const value: ThemeProviderState = {
    theme,
    colorTheme,
    setTheme,
    setColorTheme,
    mounted,
  }

  // Always render the provider, but children may show loading state based on mounted
  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
