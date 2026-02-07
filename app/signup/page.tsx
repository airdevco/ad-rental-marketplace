import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Sign up",
  description: "Create a Rentals account",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center px-4 pt-8 sm:pt-12">
      <Card className="w-full max-w-md pt-6 pb-6">
        <CardHeader className="space-y-1 text-left">
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Create an account to list rentals, book, and message others.
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-4 pb-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signup-first-name">First name</Label>
                <Input
                  id="signup-first-name"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                  className="h-11 px-3 py-2.5 text-base md:text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-last-name">Last name</Label>
                <Input
                  id="signup-last-name"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                  className="h-11 px-3 py-2.5 text-base md:text-sm"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 px-3 py-2.5 text-base md:text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-11 px-3 py-2.5 text-base md:text-sm"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button type="submit" className="h-11 w-full px-4 py-2.5 text-base md:text-sm">
              Create account
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
