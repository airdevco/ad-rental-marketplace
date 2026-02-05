import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next";
import "@fontsource/inter";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ListingScrollProvider } from "@/lib/listing-scroll-context";

export const metadata: Metadata = {
  title: {
    default: "Rentals — Find and list rentals",
    template: "%s | Rentals",
  },
  description: "Find and list rentals in one place. Search by list or map.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <NuqsAdapter>
          <ListingScrollProvider>
            <Header />
            <main id="main-content" className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </ListingScrollProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
