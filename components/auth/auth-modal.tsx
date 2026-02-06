"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

/** Reusable login/signup modal. Prototype: submit succeeds without validation. */
export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSuccess?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-2xl">
            {mode === "login" ? "Log in" : "Sign up"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Enter your email and password to access your account."
              : "Create an account to list rentals, book, and message others."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="auth-name">Name</Label>
                <Input
                  id="auth-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  className="min-h-[44px]"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="min-h-[44px]"
              />
            </div>
            <div className="space-y-2">
              {mode === "login" && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="auth-password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => onOpenChange(false)}
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
              {mode === "signup" && <Label htmlFor="auth-password">Password</Label>}
              <Input
                id="auth-password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="••••••••"
                className="min-h-[44px]"
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-4 sm:flex-col">
            <Button type="submit" className="w-full min-h-[44px]">
              {mode === "login" ? "Log in" : "Create account"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-foreground hover:underline"
                    onClick={() => setMode("signup")}
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="font-medium text-foreground hover:underline"
                    onClick={() => setMode("login")}
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
