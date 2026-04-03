"use client"

import { Moon, Sun, Monitor, Palette, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

const colorThemes = [
  { id: "default", label: "Default", lightColor: "#18181b", darkColor: "#fafafa" },
  { id: "ocean", label: "Ocean", lightColor: "#2563eb", darkColor: "#60a5fa" },
  { id: "forest", label: "Forest", lightColor: "#059669", darkColor: "#34d399" },
  { id: "sunset", label: "Sunset", lightColor: "#ea580c", darkColor: "#fb923c" },
  { id: "lavender", label: "Lavender", lightColor: "#9333ea", darkColor: "#c084fc" },
  { id: "ruby", label: "Ruby", lightColor: "#dc2626", darkColor: "#f87171" },
] as const

export function ThemeSwitcher() {
  const { theme, colorTheme, setTheme, setColorTheme, mounted } = useTheme()

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-md border border-border bg-card animate-pulse" />
        <div className="h-9 w-9 rounded-md border border-border bg-card animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Light/Dark Mode Toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9 border-border bg-card hover:bg-accent">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Light
            </div>
            {theme === "light" && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Dark
            </div>
            {theme === "dark" && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              System
            </div>
            {theme === "system" && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Color Theme Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9 border-border bg-card hover:bg-accent">
            <Palette className="h-4 w-4" />
            <span className="sr-only">Select color theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Color Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {colorThemes.map((ct) => (
            <DropdownMenuItem
              key={ct.id}
              onClick={() => setColorTheme(ct.id)}
              className="cursor-pointer justify-between"
            >
              <div className="flex items-center gap-2">
                <span 
                  className="h-4 w-4 rounded-full border border-border/50 shadow-sm"
                  style={{ 
                    background: `linear-gradient(135deg, ${ct.lightColor} 50%, ${ct.darkColor} 50%)`
                  }} 
                />
                {ct.label}
              </div>
              {colorTheme === ct.id && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
