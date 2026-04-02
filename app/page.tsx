"use client"

import { useState } from "react"
import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import MovieRecommender from "@/components/movie-recommender"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Film, Sparkles, Globe, Calendar } from "lucide-react"

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
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
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                <CardContent className="pt-6">
                  <Film className="h-8 w-8 text-blue-500 mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Multi-Platform</h3>
                  <p className="text-sm text-muted-foreground">
                    Search across Netflix, Prime Video, and Disney+ Hotstar in one place.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
                <CardContent className="pt-6">
                  <Globe className="h-8 w-8 text-emerald-500 mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">6 Languages</h3>
                  <p className="text-sm text-muted-foreground">
                    Hindi, Telugu, Tamil, Malayalam, Kannada, and English films.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20">
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

          {/* Movie Recommender Section */}
          <section id="recommend">
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
                <Suspense fallback={<p className="text-muted-foreground">Loading recommender...</p>}>
                  <MovieRecommender />
                </Suspense>
              </CardContent>
            </Card>
          </section>

          {/* Language Showcase */}
          <section id="languages" className="mt-8">
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
                <Card key={lang.name} className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer">
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
