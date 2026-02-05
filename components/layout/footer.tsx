import Link from "next/link";

const footerLinks = [
  { label: "Search", href: "/search" },
  { label: "Map", href: "/search/map" },
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
  return (
    <footer className="border-t border-[#ECECEC] bg-[#F7F7F7]">
      <div className="container w-full max-w-7xl py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/"
              className="font-semibold text-lg focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-md"
            >
              Rento
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Find and list rentals in one place.
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
        <div className="container flex w-full max-w-7xl flex-col items-center justify-between gap-3 py-0 sm:flex-row">
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
