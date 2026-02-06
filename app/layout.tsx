import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next";
import "@fontsource/inter";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/900.css";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchModal } from "@/components/landing/search-modal";
import { ListingScrollProvider } from "@/lib/listing-scroll-context";
import { SearchModalProvider } from "@/lib/search-modal-context";

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
            <SearchModalProvider>
              <Header />
              <main id="main-content" className="flex-1 w-full">
                {children}
              </main>
              <Footer />
              <SearchModal />
            </SearchModalProvider>
          </ListingScrollProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
