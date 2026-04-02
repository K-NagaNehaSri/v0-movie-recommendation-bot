"use client"

import type React from "react"
import { useState } from "react"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type RecommendRequest = {
  providers: string[]
  genre: string | null
  language: string | null
  minYear?: number | null
  minRating?: number | null
  mood?: string | null
}

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

type RecommendResponse = {
  items: Movie[]
  explanation: string
}

const fetcher = async (_: string, { arg }: { arg: RecommendRequest }) => {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(text || "Failed to fetch recommendations")
  }
  return (await res.json()) as RecommendResponse
}

const providerOptions = [
  { id: "netflix", label: "Netflix" },
  { id: "prime-video", label: "Amazon Prime Video" },
  { id: "hotstar", label: "Disney+ Hotstar" },
]

const languages = [
  { id: "any", label: "All Languages" },
  { id: "hindi", label: "Hindi" },
  { id: "telugu", label: "Telugu" },
  { id: "tamil", label: "Tamil" },
  { id: "malayalam", label: "Malayalam" },
  { id: "kannada", label: "Kannada" },
  { id: "english", label: "English" },
]

const genres = [
  "Any",
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Horror",
  "Musical",
  "Romance",
  "Sci-Fi",
  "Thriller",
]

const decades = [
  { value: "any", label: "All Years" },
  { value: "2020", label: "2020s" },
  { value: "2010", label: "2010s" },
  { value: "2000", label: "2000s" },
  { value: "1990", label: "1990s" },
  { value: "1980", label: "1980s" },
  { value: "1970", label: "1970s" },
  { value: "1960", label: "1960s" },
  { value: "1950", label: "1950s" },
]

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

export default function MovieRecommender() {
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["netflix", "prime-video", "hotstar"])
  const [selectedGenre, setSelectedGenre] = useState<string>("Any")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("any")
  const [selectedDecade, setSelectedDecade] = useState<string>("any")
  const [minRating, setMinRating] = useState<string>("6.0")
  const [mood, setMood] = useState<string>("")

  const { data, error, trigger, isMutating } = useSWRMutation<RecommendResponse, Error, string, RecommendRequest>(
    "recommend",
    fetcher,
  )

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await trigger({
      providers: selectedProviders,
      genre: selectedGenre === "Any" ? null : selectedGenre,
      language: selectedLanguage === "any" ? null : selectedLanguage,
      minYear: selectedDecade === "any" ? null : Number(selectedDecade),
      minRating: minRating ? Number(minRating) : null,
      mood: mood || null,
    })
  }

  const toggleProvider = (id: string, checked: boolean | string) => {
    setSelectedProviders((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((p) => p !== id)))
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="grid gap-6">
        {/* Platforms */}
        <fieldset className="grid gap-3">
          <legend className="mb-1 text-sm font-medium text-foreground">Platforms</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {providerOptions.map((p) => (
              <label key={p.id} className="flex items-center gap-2 rounded-lg border border-border p-3 bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                <Checkbox
                  checked={selectedProviders.includes(p.id)}
                  onCheckedChange={(v) => toggleProvider(p.id, v)}
                  aria-label={p.label}
                />
                <span className="text-sm font-medium">{p.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Language and Genre Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="language" className="text-foreground">Language</Label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger id="language" className="bg-background border-border">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {languages.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="genre" className="text-foreground">Genre</Label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger id="genre" className="bg-background border-border">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Decade and Rating Row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="decade" className="text-foreground">Era / Decade</Label>
            <Select value={selectedDecade} onValueChange={setSelectedDecade}>
              <SelectTrigger id="decade" className="bg-background border-border">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {decades.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="minRating" className="text-foreground">Min Rating</Label>
            <Input
              id="minRating"
              inputMode="decimal"
              placeholder="e.g. 7.5"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="bg-background border-border"
            />
          </div>
        </div>

        {/* Mood */}
        <div className="grid gap-2">
          <Label htmlFor="mood" className="text-foreground">Describe your mood or preferences (optional)</Label>
          <Input
            id="mood"
            placeholder="e.g., feel-good, intense drama, family night, classic cinema"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="bg-background border-border"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isMutating} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {isMutating ? "Finding picks..." : "Get Recommendations"}
          </Button>
          {error ? <p className="text-sm text-destructive">Error: {error.message}</p> : null}
        </div>
      </form>

      {/* Results */}
      <section className="mt-8 grid gap-6">
        {data?.explanation ? (
          <Card className="bg-accent/30 border-border">
            <CardContent className="pt-6">
              <p className="whitespace-pre-line text-sm text-foreground">{data.explanation}</p>
            </CardContent>
          </Card>
        ) : null}

        {data?.items?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((movie) => (
              <Card key={movie.id} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-semibold text-foreground leading-tight">{movie.title}</h3>
                    <Badge className={getLangBadgeClass(movie.language)}>
                      {movie.language}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {movie.year} &bull; {movie.rating.toFixed(1)}/10
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {movie.genres.map((g) => (
                      <Badge key={g} variant="secondary" className="bg-secondary text-secondary-foreground text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{movie.synopsis}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
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
        ) : null}
      </section>
    </div>
  )
}
