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
  title: "Forgot password",
  description: "Reset your Rentals account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col items-center px-4 pt-8 sm:pt-12">
      <Card className="w-full max-w-md pt-6 pb-6">
        <CardHeader className="space-y-1 text-left">
          <CardTitle className="text-2xl">Forgot password?</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <form>
          <CardContent className="space-y-4 pb-0">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="h-11 px-3 py-2.5 text-base md:text-sm"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button type="submit" className="h-11 w-full px-4 py-2.5 text-base md:text-sm">
              Send reset link
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link
                href="/login"
                className="font-medium text-foreground hover:underline focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
              >
                Back to log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
