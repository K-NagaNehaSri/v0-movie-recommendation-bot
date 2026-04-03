"use client"

import { useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import MovieRecommender from "@/components/movie-recommender"
import { Sidebar, MobileSidebar, type NavView } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { TrendingSection } from "@/components/sections/trending"
import { FavoritesSection } from "@/components/sections/favorites"
import { WatchlistSection } from "@/components/sections/watchlist"
import { SettingsSection } from "@/components/sections/settings"
import { ByLanguageSection } from "@/components/sections/by-language"
import { Film, Sparkles, Globe, Calendar } from "lucide-react"

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<NavView>("home")

  const renderContent = () => {
    switch (activeView) {
      case "trending":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TrendingSection />
          </Suspense>
        )
      case "languages":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <ByLanguageSection />
          </Suspense>
        )
      case "favorites":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <FavoritesSection />
          </Suspense>
        )
      case "watchlist":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <WatchlistSection />
          </Suspense>
        )
      case "settings":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsSection />
          </Suspense>
        )
      case "discover":
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Film className="h-5 w-5 text-primary" />
                Find Your Next Movie
              </CardTitle>
              <CardDescription>
                Select your preferences to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <MovieRecommender />
              </Suspense>
            </CardContent>
          </Card>
        )
      case "home":
      default:
        return (
          <>
            {/* Welcome Section */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome to MovieBot</h1>
                  <p className="text-muted-foreground">Discover your next favorite film across streaming platforms</p>
                </div>
              </div>
            </section>

            {/* Stats Cards */}
            <section className="mb-8">
              <StatsCards />
            </section>

            {/* Features Grid */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Why MovieBot?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("discover")}>
                  <CardContent className="pt-6">
                    <Film className="h-8 w-8 text-blue-500 mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">Multi-Platform</h3>
                    <p className="text-sm text-muted-foreground">
                      Search across Netflix, Prime Video, and Disney+ Hotstar in one place.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("languages")}>
                  <CardContent className="pt-6">
                    <Globe className="h-8 w-8 text-emerald-500 mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">6 Languages</h3>
                    <p className="text-sm text-muted-foreground">
                      Hindi, Telugu, Tamil, Malayalam, Kannada, and English films.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("trending")}>
                  <CardContent className="pt-6">
                    <Calendar className="h-8 w-8 text-orange-500 mb-3" />
                    <h3 className="font-semibold text-foreground mb-1">75+ Years</h3>
                    <p className="text-sm text-muted-foreground">
                      From 1950s classics to 2024 releases, spanning cinema history.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Quick Discover Section */}
            <section className="mb-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Film className="h-5 w-5 text-primary" />
                    Find Your Next Movie
                  </CardTitle>
                  <CardDescription>
                    Select your preferences to get personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<LoadingSpinner />}>
                    <MovieRecommender />
                  </Suspense>
                </CardContent>
              </Card>
            </section>

            {/* Language Showcase */}
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Explore by Language</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { name: "Hindi", class: "lang-hindi", count: "23 films" },
                  { name: "Telugu", class: "lang-telugu", count: "15 films" },
                  { name: "Tamil", class: "lang-tamil", count: "18 films" },
                  { name: "Malayalam", class: "lang-malayalam", count: "17 films" },
                  { name: "Kannada", class: "lang-kannada", count: "12 films" },
                  { name: "English", class: "lang-english", count: "27 films" },
                ].map((lang) => (
                  <Card 
                    key={lang.name} 
                    className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setActiveView("languages")}
                  >
                    <CardContent className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${lang.class}`}>
                        {lang.name}
                      </span>
                      <p className="text-xs text-muted-foreground mt-2">{lang.count}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Mobile sidebar */}
      <MobileSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {renderContent()}

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>MovieBot - Powered by AI for personalized recommendations</p>
            <p className="mt-1">Netflix, Prime Video, Disney+ Hotstar</p>
          </footer>
        </main>
      </div>
    </div>
  )
}
