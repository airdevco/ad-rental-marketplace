import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Clock,
  Search,
  CalendarCheck,
  KeyRound,
  Headset,
  TrendingUp,
  Home,
  Star,
  ArrowRight,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ─── How It Works ─── */

const steps = [
  {
    icon: Search,
    title: "Find your place",
    description:
      "Browse hundreds of homes near you. Filter by price, type, and dates to find your perfect match.",
  },
  {
    icon: CalendarCheck,
    title: "Book instantly",
    description:
      "Reserve in seconds with flexible check-in times. No paperwork hassle, just a seamless booking.",
  },
  {
    icon: KeyRound,
    title: "Move in",
    description:
      "Self check-in with the host, or use keyless entry. Settle in with full protection included.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-zinc-50 py-20 md:py-24" aria-labelledby="how-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            How it works
          </span>
          <h2
            id="how-heading"
            className="text-2xl font-bold tracking-tight md:text-3xl"
          >
            Renting a home is easy
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-shadow duration-200 hover:shadow-lg"
            >
              <div className="absolute left-0 right-0 top-0 h-[3px] bg-gradient-to-r from-primary to-blue-400" />
              <div className="mb-5 flex items-center gap-2 text-xs font-bold text-primary">
                <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-extrabold text-primary">
                  {i + 1}
                </span>
                Step {i === 0 ? "one" : i === 1 ? "two" : "three"}
              </div>
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="size-6" strokeWidth={1.75} />
              </div>
              <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Popular Destinations ─── */

const destinations = [
  {
    city: "San Francisco",
    state: "CA",
    count: "320+ homes",
    img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=800&fit=crop",
  },
  {
    city: "Los Angeles",
    state: "CA",
    count: "580+ homes",
    img: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&h=800&fit=crop",
  },
  {
    city: "New York",
    state: "NY",
    count: "410+ homes",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=800&fit=crop",
  },
  {
    city: "Miami",
    state: "FL",
    count: "290+ homes",
    img: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&h=800&fit=crop",
  },
];

export function PopularDestinations() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="dest-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
              Explore
            </span>
            <h2 id="dest-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
              Popular destinations
            </h2>
          </div>
          <Link href="/search" className="hidden text-sm font-semibold underline md:inline">
            View all rentals
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <Link
              key={d.city}
              href={`/search?q=${encodeURIComponent(d.city + ", " + d.state)}`}
              className="group"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100">
                <Image
                  src={d.img}
                  alt={d.city}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-base font-bold text-white">
                    {d.city}, {d.state}
                  </p>
                  <p className="mt-0.5 text-sm text-white/80">{d.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-7 text-center">
          <Link href="/search" className="text-sm font-semibold underline">
            View all rentals
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */

const reviews = [
  {
    name: "Sarah M.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    role: "Stayed in a downtown loft",
    rating: 5,
    body: "Incredibly smooth experience from booking to checkout. The home was spotless, and the host was super responsive. Will definitely book again!",
    gradient: "from-primary to-blue-400",
  },
  {
    name: "James K.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    role: "Stayed in a beach house",
    rating: 5,
    body: "Way better than hotels. Check-in took 2 minutes with the smart lock, no paperwork at all. The pricing was transparent and the place was gorgeous.",
    gradient: "from-zinc-700 to-zinc-500",
  },
  {
    name: "Priya R.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    role: "Stayed in a family home",
    rating: 5,
    body: "Perfect for our family vacation. The host even left welcome snacks and local recommendations. Communication was fantastic throughout our stay.",
    gradient: "from-violet-500 to-purple-400",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="reviews-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            Reviews
          </span>
          <h2
            id="reviews-heading"
            className="text-2xl font-bold tracking-tight md:text-3xl"
          >
            Loved by renters everywhere
          </h2>
          <p className="mx-auto mt-3 max-w-md text-zinc-500">
            Don&apos;t take our word for it. Here&apos;s what real guests say.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <Card key={r.name} className="gap-0 border-zinc-200 p-0 shadow-none transition-shadow duration-200 hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-7">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="leading-relaxed italic text-foreground">
                  &ldquo;{r.body}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <Avatar className="size-10">
                    <AvatarImage src={r.image} alt={r.name} />
                    <AvatarFallback className={`bg-gradient-to-br ${r.gradient} text-xs font-bold text-white`}>
                      {r.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-zinc-500">{r.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Trust & Safety ─── */

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Protection included",
    description:
      "Every booking comes with property damage protection so you can stay worry-free, no extras required.",
  },
  {
    icon: Headset,
    title: "24/7 support",
    description:
      "Our team is always available to help with any issue, day or night, wherever you are.",
  },
  {
    icon: Clock,
    title: "Flexible cancellation",
    description:
      "Plans change. Cancel up to 24 hours before check-in for a full refund, no questions asked.",
  },
  {
    icon: TrendingUp,
    title: "Transparent pricing",
    description:
      "No hidden fees. The price you see is the price you pay, every single time.",
  },
];

export function TrustAndSafety() {
  return (
    <section className="bg-zinc-50 py-20 md:py-24" aria-labelledby="trust-heading" id="contact">
      <div className="container mx-auto max-w-[1400px]">
        <div className="mb-12 text-center">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-primary">
            Trust &amp; safety
          </span>
          <h2
            id="trust-heading"
            className="text-2xl font-bold tracking-tight md:text-3xl"
          >
            Stay with peace of mind
          </h2>
          <p className="mx-auto mt-3 max-w-md text-zinc-500">
            We&apos;ve built protections into every step of the rental journey.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-7 transition-shadow duration-200 hover:shadow-md"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="size-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Host CTA Banner ─── */

export function HostCta() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="host-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-500 to-blue-700 p-10 md:p-16">
          <div className="pointer-events-none absolute -right-16 -top-16 size-72 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 size-52 rounded-full bg-white/[0.03]" />

          <div className="relative z-10 grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-widest text-white/60">
                For property owners
              </span>
              <h2
                id="host-heading"
                className="text-2xl font-extrabold tracking-tight text-white md:text-4xl"
              >
                Turn your property into<br />a money maker
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/80">
                List your home in minutes and start earning. Hosts on Rento
                earn an average of <strong className="text-white">$1,200/month</strong> with
                flexible scheduling that fits around your life.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white font-bold text-primary shadow-lg hover:bg-white/90"
                  asChild
                >
                  <Link href="/dashboard/seller">
                    Start hosting
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="border border-white/30 font-semibold text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
                  asChild
                >
                  <Link href="/search">Learn more</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {[
                { num: "$1,200", desc: "Avg. monthly earnings per host" },
                { num: "500+", desc: "Cities covered worldwide" },
                { num: "2 min", desc: "To list your property" },
                { num: "4.9", desc: "Average platform rating", suffix: <Star className="ml-0.5 inline size-4 fill-white text-white" /> },
              ].map((s) => (
                <div
                  key={s.num}
                  className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <div className="text-2xl font-extrabold tracking-tight text-white">
                    {s.num}{s.suffix}
                  </div>
                  <div className="mt-1 text-xs leading-snug text-white/70">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Floating Map Button ─── */

export function FloatingMapButton() {
  return (
    <div className="fixed bottom-7 left-1/2 z-50 -translate-x-1/2">
      <Button
        size="lg"
        className="rounded-full bg-zinc-900 px-7 font-bold shadow-lg hover:bg-zinc-800"
        asChild
      >
        <Link href="/search">
          <Map className="mr-2 size-4" />
          Show map
        </Link>
      </Button>
    </div>
  );
}
