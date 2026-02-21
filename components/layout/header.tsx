"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useListingScroll } from "@/lib/listing-scroll-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HeaderSearchBar } from "@/components/landing/header-search-bar";

const SCROLL_THRESHOLD = 280;

export function Header() {
  const isLoggedIn = false;
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isListingPage = pathname.startsWith("/listing/");
  const { pastGallery } = useListingScroll();
  const [scrolled, setScrolled] = useState(false);
  const isSearchPage = pathname === "/search";
  const isMessagesPage = pathname === "/messages";
  const isFullWidthPage = isSearchPage || isMessagesPage;

  // Hide header when on listing page and scrolled past gallery (tab bar replaces it)
  const hidden = isListingPage && pastGallery;
  const [showHeaderSearch, setShowHeaderSearch] = useState(isSearchPage);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 0);
      setShowHeaderSearch((isHome && y > SCROLL_THRESHOLD) || isSearchPage);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, isSearchPage]);

  const showBorder = showHeaderSearch || (!isHome && !isListingPage);
  const headerBg = scrolled ? "bg-white" : "bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80";
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const hideLogoForSearch = showHeaderSearch && !isDesktop;

  if (hidden) return null;

  return (
    <header
      className={`sticky top-0 z-50 w-full ${headerBg} ${showBorder ? "border-b border-zinc-100" : ""}`}
    >
      <div
        className={cn(
          "relative flex h-16 w-full items-center gap-4",
          !hideLogoForSearch && "justify-between",
          isFullWidthPage ? "max-w-none px-4 sm:px-6" : "container max-w-[1400px] px-4"
        )}
      >
        {!hideLogoForSearch && (
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
        )}
        {showHeaderSearch && (
          <div
            className={cn(
              "animate-in fade-in-0 duration-200 min-w-0",
              hideLogoForSearch
                ? "flex min-w-0 flex-1"
                : "absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4"
            )}
          >
            <HeaderSearchBar fullWidthOnMobile={hideLogoForSearch} />
          </div>
        )}
        <div className="flex shrink-0 items-center gap-2 border-0 shadow-none">
          {isLoggedIn && (
            <Link
              href="/dashboard/buyer"
              className="flex shrink-0 items-center focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
              aria-label="Account"
            >
              <Avatar className="size-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
          )}
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-9 rounded-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-zinc-100",
                  menuOpen && "bg-zinc-100"
                )}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? (
                  <X size={20} weight="bold" aria-hidden />
                ) : (
                  <List size={20} weight="bold" aria-hidden />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 min-w-56 p-2">
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/buyer" onClick={() => setMenuOpen(false)}>My rentals</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/seller" onClick={() => setMenuOpen(false)}>Listings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/messages" onClick={() => setMenuOpen(false)}>Messages</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="-mx-2 my-1 h-px" />
                  <DropdownMenuItem asChild>
                    <Link href="/login" onClick={() => setMenuOpen(false)}>Sign out</Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/search" onClick={() => setMenuOpen(false)}>Browse homes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/seller" onClick={() => setMenuOpen(false)}>List your property</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="-mx-2 my-1 h-px" />
                  <div className="px-0 py-3">
                    <Button asChild size="sm" className="w-full rounded-md bg-[#156EF5] px-4 py-2.5 hover:bg-[#125bd4]">
                      <Link href="/login" onClick={() => setMenuOpen(false)}>Log in or Sign up</Link>
                    </Button>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
