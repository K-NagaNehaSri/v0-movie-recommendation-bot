import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-sans text-3xl font-semibold text-balance tracking-tight text-foreground md:text-5xl">
            Smarter movie picks, tailored to your taste
          </h1>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Instantly discover what to watch across Netflix, Prime Video, and Hotstar. Filter by mood, genre, and rating
            — then get an explanation for each pick.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild className="bg-primary text-primary-foreground">
              <Link href="#recommend">Get recommendations</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="#how-it-works">How it works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
