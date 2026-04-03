"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star, Calendar } from "lucide-react"

type Movie = {
  id: string
  title: string
  year: number
  rating: number
  genres: string[]
  providers: string[]
  language: string
  synopsis: string
}

const getLangBadgeClass = (lang: string) => {
  const l = lang.toLowerCase()
  if (l === "hindi") return "lang-hindi"
  if (l === "telugu") return "lang-telugu"
  if (l === "tamil") return "lang-tamil"
  if (l === "malayalam") return "lang-malayalam"
  if (l === "kannada") return "lang-kannada"
  return "lang-english"
}

const getPlatformClass = (p: string) => {
  if (p === "netflix") return "platform-netflix"
  if (p === "prime-video") return "platform-prime"
  return "platform-hotstar"
}

const getPlatformLabel = (p: string) => {
  if (p === "prime-video") return "Prime Video"
  if (p === "hotstar") return "Disney+ Hotstar"
  return "Netflix"
}

export function TrendingSection() {
  const [trending, setTrending] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            providers: ["netflix", "prime-video", "hotstar"],
            minYear: 2020,
            minRating: 7.0,
          }),
        })
        const data = await res.json()
        setTrending(data.items || [])
      } catch {
        setTrending([])
      } finally {
        setLoading(false)
      }
    }
    fetchTrending()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange-500/10">
          <TrendingUp className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Trending Now</h2>
          <p className="text-sm text-muted-foreground">Popular recent releases across all platforms</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {trending.map((movie, index) => (
          <Card key={movie.id} className="bg-card border-border hover:shadow-lg transition-shadow relative overflow-hidden">
            {index < 3 && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                #{index + 1}
              </div>
            )}
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-semibold text-foreground leading-tight">{movie.title}</h3>
                <Badge className={getLangBadgeClass(movie.language)}>{movie.language}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {movie.year}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  {movie.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {movie.genres.slice(0, 3).map((g) => (
                  <Badge key={g} variant="secondary" className="text-xs">
                    {g}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{movie.synopsis}</p>
              <div className="flex flex-wrap gap-1.5">
                {movie.providers.map((p) => (
                  <Badge key={p} className={`${getPlatformClass(p)} text-xs`}>
                    {getPlatformLabel(p)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
