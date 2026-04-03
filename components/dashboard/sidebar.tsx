"use client"

import { Film, Home, Heart, Clock, Settings, TrendingUp, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export type NavView = "home" | "discover" | "trending" | "languages" | "favorites" | "watchlist" | "settings"

const navItems: { icon: typeof Home; label: string; view: NavView }[] = [
  { icon: Home, label: "Home", view: "home" },
  { icon: Film, label: "Discover", view: "discover" },
  { icon: TrendingUp, label: "Trending", view: "trending" },
  { icon: Globe, label: "By Language", view: "languages" },
  { icon: Heart, label: "Favorites", view: "favorites" },
  { icon: Clock, label: "Watch Later", view: "watchlist" },
  { icon: Settings, label: "Settings", view: "settings" },
]

interface SidebarProps {
  activeView: NavView
  onViewChange: (view: NavView) => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r border-border p-4">
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <Film className="h-8 w-8 text-primary" />
        <span className="font-bold text-xl text-foreground">MovieBot</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onViewChange(item.view)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full",
              activeView === item.view
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border">
        <div className="px-3 py-2 rounded-lg bg-accent/50">
          <p className="text-xs text-muted-foreground mb-1">Streaming Platforms</p>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-0.5 rounded platform-netflix">Netflix</span>
            <span className="text-xs px-2 py-0.5 rounded platform-prime">Prime</span>
            <span className="text-xs px-2 py-0.5 rounded platform-hotstar">Hotstar</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

// Mobile sidebar component
interface MobileSidebarProps extends SidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ activeView, onViewChange, open, onClose }: MobileSidebarProps) {
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-card border-r border-border p-4 lg:hidden">
        <div className="flex items-center gap-2 px-2 py-4 mb-6">
          <Film className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl text-foreground">MovieBot</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onViewChange(item.view)
                onClose()
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left w-full",
                activeView === item.view
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="px-3 py-2 rounded-lg bg-accent/50">
            <p className="text-xs text-muted-foreground mb-1">Streaming Platforms</p>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-0.5 rounded platform-netflix">Netflix</span>
              <span className="text-xs px-2 py-0.5 rounded platform-prime">Prime</span>
              <span className="text-xs px-2 py-0.5 rounded platform-hotstar">Hotstar</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
