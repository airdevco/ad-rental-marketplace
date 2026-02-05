"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const isLoggedIn = false;
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showBorder = scrolled || !isHome;
  const headerBg = scrolled ? "bg-white" : "bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80";

  return (
    <header
      className={`sticky top-0 z-50 w-full ${headerBg} ${showBorder ? "border-b border-zinc-200" : ""}`}
    >
      <div className="container flex h-14 w-full max-w-7xl items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-md"
          aria-label="Rentals home"
        >
          <Image
            src="https://e47b698e59208764aee00d1d8e14313c.cdn.bubble.io/f1770319743776x921681514520088300/rento.png"
            alt="Rentals"
            width={72}
            height={20}
            className="h-5 w-auto object-contain"
            priority
          />
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search">Search</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/search/map">Map</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/messages">Messages</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  aria-label="Open account menu"
                >
                  <Avatar className="size-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buyer">My rentals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/seller">Listings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/messages">Messages</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login">Sign out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
