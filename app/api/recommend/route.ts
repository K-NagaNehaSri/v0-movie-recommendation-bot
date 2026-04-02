import type { NextRequest } from "next/server"
import catalog from "@/data/movies.json"

export const maxDuration = 30

type Body = {
  providers?: string[]
  genre?: string | null
  language?: string | null
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

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Body

  const providers = Array.isArray(body.providers) ? body.providers : []
  const genre = body.genre && body.genre !== "Any" ? body.genre : null
  const language = body.language && body.language !== "any" ? body.language : null
  const minYear = typeof body.minYear === "number" ? body.minYear : 0
  const minRating = typeof body.minRating === "number" ? body.minRating : 0
  const mood = body.mood?.trim() || ""

  // Basic filtering over local catalog
  let items = (catalog as Movie[])
    .filter((m) => (providers.length ? m.providers.some((p) => providers.includes(p)) : true))
    .filter((m) => (genre ? m.genres.includes(genre) : true))
    .filter((m) => (language ? m.language.toLowerCase() === language.toLowerCase() : true))
    .filter((m) => m.year >= minYear)
    .filter((m) => m.rating >= minRating)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12)

  // If nothing found, soften filters
  if (items.length === 0 && language) {
    items = (catalog as Movie[])
      .filter((m) => m.language.toLowerCase() === language.toLowerCase())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 9)
  }

  // If still nothing, try providers only
  if (items.length === 0 && providers.length) {
    items = (catalog as Movie[])
      .filter((m) => m.providers.some((p) => providers.includes(p)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 9)
  }

  // Final fallback to top-rated catalog if still empty
  if (items.length === 0) {
    items = (catalog as Movie[]).sort((a, b) => b.rating - a.rating).slice(0, 9)
  }

  // Build explanation
  const languageNames: Record<string, string> = {
    hindi: "Hindi",
    telugu: "Telugu",
    tamil: "Tamil",
    malayalam: "Malayalam",
    kannada: "Kannada",
    english: "English",
  }

  const providerNames =
    providers.length === 0
      ? "all platforms"
      : providers
          .map((p) =>
            p === "prime-video" ? "Amazon Prime Video" : p === "hotstar" ? "Disney+ Hotstar" : "Netflix"
          )
          .join(", ")

  const langLabel = language ? languageNames[language] || language : "all languages"
  const genreLabel = genre || "all genres"
  const decadeLabel = minYear > 0 ? `from ${minYear}s onwards` : "across all decades"

  const defaultExplanation = `Here are top-rated ${langLabel} ${genreLabel !== "all genres" ? genreLabel.toLowerCase() : ""} films ${decadeLabel}, available on ${providerNames}. These selections span classic to contemporary cinema, balancing critical acclaim with entertainment. Refine your filters to discover more hidden gems!`

  let explanation = defaultExplanation

  // Only call the AI SDK when explicitly enabled
  if (process.env.ENABLE_AI_EXPLANATION === "1") {
    try {
      const listForPrompt = items
        .map((m) => `- ${m.title} (${m.year}, ${m.language}) [${m.genres.join(", ")}] ${m.rating}/10`)
        .join("\n")

      const { generateText } = await import("ai")
      const { text } = await generateText({
        model: "openai/gpt-5-mini",
        maxOutputTokens: 300,
        temperature: 0.5,
        prompt: [
          "You are a helpful movie concierge.",
          "Explain these recommendations concisely in 3-6 sentences:",
          `User mood/preferences: "${mood || "not specified"}"`,
          `Language preference: ${langLabel}`,
          `Preferred genre: ${genreLabel}`,
          `Era: ${decadeLabel}`,
          `Platforms: ${providerNames}`,
          "Recommended list:",
          listForPrompt,
          "",
          "Guidelines:",
          "- Summarize themes and vibes that match the inputs.",
          "- Highlight any standout classics or award-winners.",
          "- Be friendly and confident, no overpromises.",
        ].join("\n"),
      })
      explanation = text
    } catch {
      explanation = defaultExplanation
    }
  }

  return Response.json({ items, explanation })
}
