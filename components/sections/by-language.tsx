"use client"

import { useState, useEffect } from "react"
import { Globe, Calendar, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

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

const languages = [
  { id: "hindi", label: "Hindi", class: "lang-hindi" },
  { id: "telugu", label: "Telugu", class: "lang-telugu" },
  { id: "tamil", label: "Tamil", class: "lang-tamil" },
  { id: "malayalam", label: "Malayalam", class: "lang-malayalam" },
  { id: "kannada", label: "Kannada", class: "lang-kannada" },
  { id: "english", label: "English", class: "lang-english" },
]

const getLangBadgeClass = (lang: string) => {
  const l = lang.toLowerCase()
  const found = languages.find((ln) => ln.id === l)
  return found?.class || "lang-english"
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

export function ByLanguageSection() {
  const [selectedLanguage, setSelectedLanguage] = useState("hindi")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true)
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            providers: ["netflix", "prime-video", "hotstar"],
            language: selectedLanguage,
            minRating: 6.0,
          }),
        })
        const data = await res.json()
        setMovies(data.items || [])
      } catch {
        setMovies([])
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [selectedLanguage])

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-500/10">
          <Globe className="h-6 w-6 text-purple-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Browse by Language</h2>
          <p className="text-sm text-muted-foreground">Explore cinema across Indian languages and English</p>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {languages.map((lang) => (
          <Button
            key={lang.id}
            variant={selectedLanguage === lang.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedLanguage(lang.id)}
            className={selectedLanguage === lang.id ? "" : "border-border"}
          >
            {lang.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : movies.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No movies found</h3>
            <p className="text-sm text-muted-foreground text-center">
              No {languages.find((l) => l.id === selectedLanguage)?.label} movies matching your criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {movies.map((movie) => (
            <Card key={movie.id} className="bg-card border-border hover:shadow-lg transition-shadow">
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
      )}
    </section>
  )
}
