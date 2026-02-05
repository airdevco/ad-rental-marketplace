import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const howItWorks = [
  { step: 1, title: "Search", body: "Find rentals by keyword or browse the map." },
  { step: 2, title: "View details", body: "Check price, availability, and reviews." },
  { step: 3, title: "Book & pay", body: "Confirm your dates and complete checkout." },
];

const featuredListings = [
  { id: "1", title: "Downtown loft", description: "Spacious loft, 2 guests", price: "$120", badge: "Popular" },
  { id: "2", title: "Cozy cabin", description: "Lake view, 4 guests", price: "$95", badge: "New" },
  { id: "3", title: "City studio", description: "Central location, 2 guests", price: "$85", badge: null },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-muted/50 to-background py-20 md:py-28">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find the right rental
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Search by list or map. Compare prices, read reviews, and book in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="min-h-11 min-w-[44px]">
              <Link href="/search">Search rentals</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="min-h-11 min-w-[44px]">
              <Link href="/search/map">View map</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b py-16 md:py-20" aria-labelledby="value-props-heading">
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

      {/* How it works */}
      <section className="border-b py-16 md:py-20" id="how-it-works" aria-labelledby="how-heading">
        <div className="container mx-auto max-w-7xl">
          <h2 id="how-heading" className="text-2xl font-bold md:text-3xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {howItWorks.map(({ step, title, body }) => (
              <li key={step} className="flex gap-4">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                  aria-hidden
                >
                  {step}
                </span>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Featured listings strip */}
      <section className="border-b py-16 md:py-20" aria-labelledby="featured-heading">
        <div className="container mx-auto max-w-7xl">
          <h2 id="featured-heading" className="text-2xl font-bold md:text-3xl">
            Featured rentals
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredListings.map(({ id, title, description, price, badge }) => (
              <Card key={id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      <Link
                        href={`/rental/${id}`}
                        className="focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md hover:underline"
                      >
                        {title}
                      </Link>
                    </CardTitle>
                    {badge && (
                      <Badge variant={badge === "New" ? "secondary" : "default"}>{badge}</Badge>
                    )}
                  </div>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-lg font-semibold tabular-nums">{price}</p>
                  <p className="text-xs text-muted-foreground">per night</p>
                </CardContent>
                <CardFooter>
                  <Button asChild size="sm" className="w-full min-h-[44px]">
                    <Link href={`/rental/${id}`}>View details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/search">View all rentals</Link>
            </Button>
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
