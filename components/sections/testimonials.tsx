export default function Testimonials() {
  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Loved by movie fans
          </h2>
          <p className="mt-3 text-muted-foreground">Quick, clean, and on-point picks. Here’s what early users say.</p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <figure className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
            <blockquote className="text-pretty leading-relaxed">
              “I stopped doom-scrolling and started watching. The filters are spot on.”
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">— A. Kapoor</figcaption>
          </figure>

          <figure className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm">
            <blockquote className="text-pretty leading-relaxed">
              “It nails my taste. The explanations help me try movies I’d normally skip.”
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">— R. Mehta</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
