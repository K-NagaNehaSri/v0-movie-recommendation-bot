"use client"

import Link from "next/link"
import { Film, Home, Heart, Clock, Settings, TrendingUp, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "#", active: true },
  { icon: Film, label: "Discover", href: "#recommend" },
  { icon: TrendingUp, label: "Trending", href: "#trending" },
  { icon: Globe, label: "By Language", href: "#languages" },
  { icon: Heart, label: "Favorites", href: "#favorites" },
  { icon: Clock, label: "Watch Later", href: "#watchlist" },
  { icon: Settings, label: "Settings", href: "#settings" },
]

export function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r border-border p-4">
      <div className="flex items-center gap-2 px-2 py-4 mb-6">
        <Film className="h-8 w-8 text-primary" />
        <span className="font-bold text-xl text-foreground">MovieBot</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
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
