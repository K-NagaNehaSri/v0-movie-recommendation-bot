import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Unified search",
    description: "Browse movies from Netflix, Amazon Prime Video, and Hotstar in one place.",
    imgAlt: "Unified catalog",
    imgUrl: "/unified-catalog-icon.jpg",
  },
  {
    title: "Smart filters",
    description: "Dial in by genre, year, rating, or mood — quickly narrow to what fits now.",
    imgAlt: "Smart filters",
    imgUrl: "/smart-filters-icon.jpg",
  },
  {
    title: "Clear explanations",
    description: "Understand why a movie matches your preferences with concise reasoning.",
    imgAlt: "Explanations",
    imgUrl: "/explanations-icon.jpg",
  },
]

export default function Features() {
  return (
    <section id="how-it-works" className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Find the right movie, fast
          </h2>
          <p className="mt-3 text-muted-foreground">
            Powerful filtering, unified catalog, and clear explanations help you decide in seconds.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-border shadow-sm bg-card text-card-foreground">
              <CardHeader className="flex flex-row items-center gap-3">
                <img src={f.imgUrl || "/placeholder.svg"} width={48} height={48} alt={f.imgAlt} className="h-12 w-12" />
                <CardTitle className="font-sans text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
