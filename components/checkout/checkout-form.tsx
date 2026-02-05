"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CheckoutFormProps = { rentalId: string | null };

export function CheckoutForm({ rentalId }: CheckoutFormProps) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/order/confirmation?rentalId=" + (rentalId ?? ""));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Guest information</CardTitle>
          <CardDescription>
            We&apos;ll use this to confirm your booking and send updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkout-name">Full name</Label>
            <Input
              id="checkout-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className="min-h-[44px] text-base md:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-email">Email</Label>
            <Input
              id="checkout-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="min-h-[44px] text-base md:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-phone">Phone</Label>
            <Input
              id="checkout-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 000-0000"
              className="min-h-[44px] text-base md:text-sm"
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Dates</CardTitle>
          <CardDescription>Check-in and check-out</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkout-checkin">Check-in</Label>
            <Input
              id="checkout-checkin"
              name="checkIn"
              type="date"
              className="min-h-[44px] text-base md:text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-checkout">Check-out</Label>
            <Input
              id="checkout-checkout"
              name="checkOut"
              type="date"
              className="min-h-[44px] text-base md:text-sm"
              required
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
          <CardDescription>
            Payment is processed securely. This is a placeholder for Stripe integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkout-card">Card number</Label>
            <Input
              id="checkout-card"
              name="card"
              type="text"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              className="min-h-[44px] text-base md:text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-exp">Expiry</Label>
              <Input
                id="checkout-exp"
                name="exp"
                type="text"
                autoComplete="cc-exp"
                placeholder="MM / YY"
                className="min-h-[44px] text-base md:text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-cvc">CVC</Label>
              <Input
                id="checkout-cvc"
                name="cvc"
                type="text"
                autoComplete="cc-csc"
                placeholder="123"
                className="min-h-[44px] text-base md:text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" className="min-h-[44px]">
          Confirm booking
        </Button>
        <Button type="button" variant="outline" size="lg" asChild className="min-h-[44px]">
          <Link href={rentalId ? `/rental/${rentalId}` : "/search"}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
