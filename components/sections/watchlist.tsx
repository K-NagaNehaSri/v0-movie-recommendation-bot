"use client"

import { Clock, Trash2, Calendar, Star, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWatchlist } from "@/hooks/use-watchlist"
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

export function WatchlistSection() {
  const { watchlist, removeFromWatchlist, markAsWatched } = useWatchlist()
  const { addFavorite } = useFavorites()

  const handleMarkWatched = (movie: typeof watchlist[0]) => {
    markAsWatched(movie.id)
    addFavorite(movie)
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Clock className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Watch Later</h2>
          <p className="text-sm text-muted-foreground">Movies saved for your next movie night</p>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Your watchlist is empty</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Discover movies and add them to your watchlist to keep track of what you want to watch next.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {watchlist.map((movie) => (
            <Card key={movie.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-semibold text-foreground leading-tight">{movie.title}</h3>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10"
                      onClick={() => handleMarkWatched(movie)}
                      title="Mark as watched"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromWatchlist(movie.id)}
                      title="Remove from watchlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
