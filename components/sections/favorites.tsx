"use client"

import { Heart, Trash2, Calendar, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"

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

export function FavoritesSection() {
  const { favorites, removeFavorite } = useFavorites()

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-rose-500/10">
          <Heart className="h-6 w-6 text-rose-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Your Favorites</h2>
          <p className="text-sm text-muted-foreground">Movies you&apos;ve loved and saved</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Browse movies and click the heart icon to add them to your favorites for easy access later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((movie) => (
            <Card key={movie.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-semibold text-foreground leading-tight">{movie.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                    onClick={() => removeFavorite(movie.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getLangBadgeClass(movie.language)}>{movie.language}</Badge>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {movie.year}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
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
