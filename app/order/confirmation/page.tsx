import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Booking confirmed",
  description: "Your rental booking has been confirmed",
};

export default function OrderConfirmationPage() {
  return (
    <div className="container mx-auto w-full max-w-xl py-12">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-2xl font-bold" aria-hidden>✓</span>
          </div>
          <CardTitle className="text-2xl">Booking confirmed</CardTitle>
          <CardDescription>
            Your rental has been reserved. You&apos;ll receive a confirmation email shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">Order reference</p>
            <p className="font-mono font-medium tabular-nums">ORD-00001</p>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild className="min-h-[44px]">
              <Link href="/dashboard/buyer">View my rentals</Link>
            </Button>
            <Button variant="outline" asChild className="min-h-[44px]">
              <Link href="/messages">Message host</Link>
            </Button>
            <Button variant="ghost" asChild className="min-h-[44px]">
              <Link href="/search">Search more rentals</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
