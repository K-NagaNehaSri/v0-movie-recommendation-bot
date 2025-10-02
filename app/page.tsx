import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MovieRecommender from "@/components/movie-recommender"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <section className="px-6 py-10 mx-auto w-full max-w-5xl">
        <header className="mb-8">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight">AI Movie Recommendation Bot</h1>
          <p className="text-pretty mt-2 text-sm text-muted-foreground">
            Get tailored picks across Netflix, Amazon Prime Video, and Disney+ Hotstar.
          </p>
        </header>

        <Card className="bg-card text-card-foreground border-border">
          <CardHeader>
            <CardTitle className="text-balance">Find your next movie</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
              <MovieRecommender />
            </Suspense>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
