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
  "Romance",
  "Sci-Fi",
  "Thriller",
]

export default function MovieRecommender() {
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["netflix", "prime-video", "hotstar"])
  const [selectedGenre, setSelectedGenre] = useState<string>("Any")
  const [minYear, setMinYear] = useState<string>("2010")
  const [minRating, setMinRating] = useState<string>("7.0")
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
      minYear: minYear ? Number(minYear) : null,
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
        <fieldset className="grid gap-3">
          <legend className="mb-1 text-sm font-medium">Platforms</legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {providerOptions.map((p) => (
              <label key={p.id} className="flex items-center gap-2 rounded-md border border-border p-3">
                <Checkbox
                  checked={selectedProviders.includes(p.id)}
                  onCheckedChange={(v) => toggleProvider(p.id, v)}
                  aria-label={p.label}
                />
                <span className="text-sm">{p.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="genre">Genre</Label>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger id="genre" className="bg-background">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="minYear">Min year</Label>
            <Input
              id="minYear"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="e.g. 2015"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="minRating">Min rating</Label>
            <Input
              id="minRating"
              inputMode="decimal"
              placeholder="e.g. 7.5"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="bg-background"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="mood">Describe your mood or preferences (optional)</Label>
          <Input
            id="mood"
            placeholder="e.g., feel-good, mind-bending, family night"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isMutating} className="bg-primary text-primary-foreground">
            {isMutating ? "Finding picks…" : "Recommend"}
          </Button>
          {error ? <p className="text-sm text-destructive-foreground">Error: {error.message}</p> : null}
        </div>
      </form>

      <section className="mt-8 grid gap-6">
        {data?.explanation ? (
          <Card className="bg-card text-card-foreground border-border">
            <CardContent className="pt-6">
              <p className="whitespace-pre-line text-sm text-muted-foreground">{data.explanation}</p>
            </CardContent>
          </Card>
        ) : null}

        {data?.items?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((movie) => (
              <Card key={movie.id} className="bg-card text-card-foreground border-border">
                <CardContent className="pt-6">
                  <h3 className="text-base font-semibold">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {movie.year} • {movie.rating.toFixed(1)}/10
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {movie.genres.map((g) => (
                      <Badge key={g} variant="secondary" className="bg-secondary text-secondary-foreground">
                        {g}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{movie.synopsis}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {movie.providers.map((p) => (
                      <Badge key={p} className="bg-primary text-primary-foreground">
                        {p === "prime-video" ? "Prime Video" : p === "hotstar" ? "Hotstar" : "Netflix"}
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
