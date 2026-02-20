"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LOGO_SRC =
  "https://e47b698e59208764aee00d1d8e14313c.cdn.bubble.io/f1770319743776x921681514520088300/rento.png";

const footerLinks = [
  { label: "Search", href: "/search" },
  { label: "How it works", href: "/#value-props" },
  { label: "Contact", href: "/#contact" },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Youtube", href: "https://youtube.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/messages") return null;

  const useMinimalFooter =
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/order/confirmation") ||
    pathname === "/search";
  const isSearchPage = pathname === "/search";

  if (useMinimalFooter) {
    return (
      <footer className="border-t border-[#ECECEC] bg-[#F7F7F7]">
        <div
          className={cn(
            "flex w-full flex-col items-center justify-between gap-3 py-4 sm:flex-row",
            isSearchPage ? "px-4 sm:px-6" : "container max-w-[1400px]"
          )}
        >
          <p className="text-sm leading-none text-muted-foreground">
            © Rento. All rights reserved.
          </p>
          <nav aria-label="Social media" className="flex gap-6">
            {socialLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-[#ECECEC] bg-[#F7F7F7]">
      <div className="container w-full max-w-[1400px] py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/"
              className="flex shrink-0 items-center focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-md"
              aria-label="Rentals home"
            >
              <Image
                src={LOGO_SRC}
                alt="Rentals"
                width={72}
                height={20}
                className="h-5 w-auto object-contain"
              />
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Find your perfect home and rent from local hosts.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex gap-8">
            <div>
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="mt-3 space-y-2">
                {footerLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="mt-3 space-y-2">
                {legalLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <div
        className="border-t border-[#ECECEC] py-4"
        aria-label="Copyright and social links"
      >
        <div className="container flex w-full max-w-[1400px] flex-col items-center justify-between gap-3 py-0 sm:flex-row">
          <p className="text-sm leading-none text-muted-foreground">
            © Rento. All rights reserved.
          </p>
          <nav aria-label="Social media" className="flex gap-6">
            {socialLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
