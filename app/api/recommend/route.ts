import type { NextRequest } from "next/server"
import catalog from "@/data/movies.json"

export const maxDuration = 30

type Body = {
  providers?: string[]
  genre?: string | null
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

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Body

  const providers = Array.isArray(body.providers) ? body.providers : []
  const genre = body.genre && body.genre !== "Any" ? body.genre : null
  const minYear = typeof body.minYear === "number" ? body.minYear : 0
  const minRating = typeof body.minRating === "number" ? body.minRating : 0
  const mood = body.mood?.trim() || ""

  // Basic filtering over local catalog
  let items = (catalog as Movie[])
    .filter((m) => (providers.length ? m.providers.some((p) => providers.includes(p)) : true))
    .filter((m) => (genre ? m.genres.includes(genre) : true))
    .filter((m) => m.year >= minYear)
    .filter((m) => m.rating >= minRating)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 9)

  // If nothing found, soften the filters and try again with providers only
  if (items.length === 0 && providers.length) {
    items = (catalog as Movie[])
      .filter((m) => m.providers.some((p) => providers.includes(p)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }

  // Final fallback to top-rated catalog if still empty
  if (items.length === 0) {
    items = (catalog as Movie[]).sort((a, b) => b.rating - a.rating).slice(0, 6)
  }

  const defaultExplanation =
    "Here are strong picks based on your filters. We selected well-rated titles and balanced different tones and subgenres. If you refine the platforms, genre, year, or rating, we’ll tailor the list even more."
  let explanation = defaultExplanation

  // Only call the AI SDK when explicitly enabled to avoid 403s in preview without billing
  if (process.env.ENABLE_AI_EXPLANATION === "1") {
    try {
      const providerNames =
        providers.length === 0
          ? "any platform"
          : providers
              .map((p) =>
                p === "prime-video" ? "Amazon Prime Video" : p === "hotstar" ? "Disney+ Hotstar" : "Netflix",
              )
              .join(", ")

      const listForPrompt = items
        .map((m) => `- ${m.title} (${m.year}) [${m.genres.join(", ")}] ${m.rating}/10`)
        .join("\n")

      const { generateText } = await import("ai") // lazy import to only load when needed
      const { text } = await generateText({
        model: "openai/gpt-5-mini",
        maxOutputTokens: 300,
        temperature: 0.5,
        prompt: [
          "You are a helpful movie concierge.",
          "Explain these recommendations concisely in 3-6 sentences:",
          `User mood/preferences: "${mood || "not specified"}"`,
          `Preferred genre: ${genre || "Any"}`,
          `Platforms: ${providerNames}`,
          "Recommended list:",
          listForPrompt,
          "",
          "Guidelines:",
          "- Summarize themes and vibes that match the inputs.",
          "- Mention availability across the specified platforms in aggregate (do not list every title per platform).",
          "- Be friendly and confident, no overpromises.",
        ].join("\n"),
      })
      explanation = text
    } catch (err) {
      explanation = defaultExplanation
    }
  }

  return Response.json({ items, explanation })
}
