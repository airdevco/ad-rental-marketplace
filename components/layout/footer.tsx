"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InstagramLogo, YoutubeLogo, LinkedinLogo } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramLogo },
  { label: "YouTube", href: "https://youtube.com", Icon: YoutubeLogo },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedinLogo },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/messages" || pathname === "/search" || pathname?.startsWith("/become-a-host") || pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) return null;

  const isSearchPage = pathname === "/search";

  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div
        className={cn(
          "flex w-full flex-row items-center justify-between gap-4 py-4",
          isSearchPage ? "px-4 sm:px-6" : "container max-w-[1400px]"
        )}
      >
        {/* Left: copyright + legal */}
        <div className="flex flex-wrap items-center gap-x-1 text-sm text-zinc-500">
          <span>© 2026 Rento, Inc.</span>
          <span className="text-zinc-300" aria-hidden>
            ·
          </span>
          <Link
            href="/privacy"
            className="hover:text-zinc-900 focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Privacy
          </Link>
          <span className="text-zinc-300" aria-hidden>
            ·
          </span>
          <Link
            href="/terms"
            className="hover:text-zinc-900 focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
          >
            Terms
          </Link>
        </div>

        {/* Right: social icons — hidden on mobile to keep single-line layout */}
        <nav aria-label="Social media" className="hidden sm:flex items-center gap-4">
          {socialLinks.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-zinc-900 focus-visible:rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={label}
            >
              <Icon className="size-5" weight="regular" />
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
