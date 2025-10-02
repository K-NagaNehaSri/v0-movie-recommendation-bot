import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MovieRecommender from "@/components/movie-recommender"
import Hero from "@/components/sections/hero"
import Features from "@/components/sections/features"
import Testimonials from "@/components/sections/testimonials"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Movie Recommender Section */}
      <section id="recommend" className="px-6 py-10 mx-auto w-full max-w-5xl">
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

      {/* Testimonials Section */}
      <Testimonials />
    </main>
  )
}
