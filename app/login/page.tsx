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
  title: "Log in",
  description: "Log in to your Rentals account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center px-4 pt-8 sm:pt-12">
      <Card className="w-full max-w-md pt-6 pb-6">
        <CardHeader className="space-y-1 text-left">
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-4 pb-0">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 px-3 py-2.5 text-base md:text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="h-11 px-3 py-2.5 text-base md:text-sm"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button type="submit" className="h-11 w-full px-4 py-2.5 text-base md:text-sm">
              Log in
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-foreground hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
