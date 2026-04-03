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

// Mood to genre mapping for smarter recommendations
const moodToGenres: Record<string, string[]> = {
  "feel-good": ["Comedy", "Romance", "Family", "Musical"],
  "happy": ["Comedy", "Romance", "Family", "Musical"],
  "uplifting": ["Drama", "Family", "Musical"],
  "intense": ["Thriller", "Action", "Crime", "Drama"],
  "thrilling": ["Thriller", "Action", "Crime", "Horror"],
  "scary": ["Horror", "Thriller"],
  "romantic": ["Romance", "Drama", "Musical"],
  "love": ["Romance", "Drama"],
  "action": ["Action", "Adventure", "Thriller"],
  "adventure": ["Adventure", "Action", "Fantasy", "Sci-Fi"],
  "family": ["Family", "Animation", "Comedy"],
  "kids": ["Animation", "Family", "Comedy"],
  "classic": ["Drama", "Musical"],
  "emotional": ["Drama", "Romance"],
  "thought-provoking": ["Drama", "Sci-Fi", "Thriller"],
  "funny": ["Comedy"],
  "suspense": ["Thriller", "Crime", "Mystery"],
  "fantasy": ["Fantasy", "Sci-Fi", "Adventure"],
  "epic": ["Action", "Drama", "Adventure", "Fantasy"],
}

function getMoodGenres(mood: string): string[] {
  const lowerMood = mood.toLowerCase()
  const matchedGenres: string[] = []
  
  for (const [keyword, genres] of Object.entries(moodToGenres)) {
    if (lowerMood.includes(keyword)) {
      matchedGenres.push(...genres)
    }
  }
  
  return [...new Set(matchedGenres)]
}

function scoreMovie(
  movie: Movie,
  providers: string[],
  genre: string | null,
  language: string | null,
  minYear: number,
  moodGenres: string[]
): number {
  let score = 0
  
  // Base score from rating (0-10 points)
  score += movie.rating
  
  // Language match (high priority, +15 points)
  if (language && movie.language.toLowerCase() === language.toLowerCase()) {
    score += 15
  }
  
  // Provider match (+5 points per matching provider)
  if (providers.length > 0) {
    const matchingProviders = movie.providers.filter(p => providers.includes(p)).length
    score += matchingProviders * 5
  }
  
  // Exact genre match (+10 points)
  if (genre && movie.genres.includes(genre)) {
    score += 10
  }
  
  // Mood-based genre matches (+3 points per matching mood genre)
  if (moodGenres.length > 0) {
    const moodMatches = movie.genres.filter(g => moodGenres.includes(g)).length
    score += moodMatches * 3
  }
  
  // Recency bonus (newer films get slight boost for trending)
  if (movie.year >= 2020) {
    score += 2
  } else if (movie.year >= 2010) {
    score += 1
  }
  
  // Classic cinema bonus (films before 1990 with high ratings)
  if (movie.year < 1990 && movie.rating >= 8.0) {
    score += 3
  }
  
  return score
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Body

  const providers = Array.isArray(body.providers) ? body.providers : []
  const genre = body.genre && body.genre !== "Any" ? body.genre : null
  const language = body.language && body.language !== "any" ? body.language : null
  const minYear = typeof body.minYear === "number" ? body.minYear : 0
  const minRating = typeof body.minRating === "number" ? body.minRating : 0
  const mood = body.mood?.trim() || ""
  
  const moodGenres = mood ? getMoodGenres(mood) : []

  // Filter and score movies
  let items = (catalog as Movie[])
    .filter((m) => (providers.length ? m.providers.some((p) => providers.includes(p)) : true))
    .filter((m) => (genre ? m.genres.includes(genre) : true))
    .filter((m) => (language ? m.language.toLowerCase() === language.toLowerCase() : true))
    .filter((m) => m.year >= minYear)
    .filter((m) => m.rating >= minRating)
    .map((m) => ({
      movie: m,
      score: scoreMovie(m, providers, genre, language, minYear, moodGenres),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(({ movie }) => movie)

  // If nothing found with all filters, try relaxing constraints
  if (items.length === 0 && language) {
    // Try just language filter
    items = (catalog as Movie[])
      .filter((m) => m.language.toLowerCase() === language.toLowerCase())
      .map((m) => ({
        movie: m,
        score: scoreMovie(m, providers, genre, language, minYear, moodGenres),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map(({ movie }) => movie)
  }

  // If still nothing, try providers only
  if (items.length === 0 && providers.length) {
    items = (catalog as Movie[])
      .filter((m) => m.providers.some((p) => providers.includes(p)))
      .map((m) => ({
        movie: m,
        score: scoreMovie(m, providers, genre, language, minYear, moodGenres),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 9)
      .map(({ movie }) => movie)
  }

  // Final fallback to top-rated catalog if still empty
  if (items.length === 0) {
    items = (catalog as Movie[])
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 9)
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
  const moodNote = mood ? ` Based on your mood "${mood}", we've prioritized ${moodGenres.length > 0 ? moodGenres.slice(0, 3).join(", ") : "matching"} films.` : ""

  const defaultExplanation = `Here are top-rated ${langLabel} ${genreLabel !== "all genres" ? genreLabel.toLowerCase() : ""} films ${decadeLabel}, available on ${providerNames}.${moodNote} These selections span classic to contemporary cinema, balancing critical acclaim with entertainment. Refine your filters to discover more hidden gems!`

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
