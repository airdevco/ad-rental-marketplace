import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/landing/hero-search";
import { HeroWithScrollPadding } from "@/components/landing/hero-with-scroll-padding";
import { SelectorAndFeaturedRentals } from "@/components/landing/selector-and-featured-rentals";

const valueProps = [
  {
    title: "Search your way",
    description: "Browse as a list or explore on the map. Same listings, the view that fits you.",
  },
  {
    title: "Book with confidence",
    description: "See availability, reviews, and lister details before you commit.",
  },
  {
    title: "Message directly",
    description: "Chat with listers to ask questions and coordinate your rental.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero - background same width as header content (logo to sign up) */}
      <HeroWithScrollPadding aria-labelledby="hero-heading">
        <div className="container mx-auto w-full max-w-7xl">
          <div
            className="relative w-full overflow-hidden rounded-3xl bg-[#0f2744] bg-cover bg-center bg-no-repeat pb-16 pt-14 md:pb-20 md:pt-18"
            style={{
              backgroundImage: "url(https://e47b698e59208764aee00d1d8e14313c.cdn.bubble.io/f1770316859498x537247407942397900/car.webp)",
            }}
          >
            <div className="absolute inset-0 bg-black/25" aria-hidden />
            <div className="relative text-center">
              <h1
                id="hero-heading"
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
              >
                Skip the rental counter
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                Rent just about any place or thing, just about anywhere.
              </p>
              <div className="mt-8 flex flex-col items-center">
                <HeroSearch />
              </div>
            </div>
          </div>
        </div>
      </HeroWithScrollPadding>

      <div className="container mx-auto w-full max-w-7xl">
        <SelectorAndFeaturedRentals />
      </div>

      {/* Value props */}
      <section id="value-props" className="py-16 md:py-20" aria-labelledby="value-props-heading">
        <div className="container mx-auto max-w-7xl">
          <h2 id="value-props-heading" className="sr-only">
            Why use Rentals
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {valueProps.map(({ title, description }) => (
              <div key={title} className="space-y-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20" id="contact" aria-labelledby="cta-heading">
        <div className="container mx-auto max-w-7xl text-center">
          <h2 id="cta-heading" className="text-2xl font-bold md:text-3xl">
            Ready to find your next rental?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign up to save favorites, message listers, and manage bookings.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
