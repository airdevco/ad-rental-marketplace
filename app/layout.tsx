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
    default: "Rento — Find your perfect home",
    template: "%s | Rento",
  },
  description: "Find and rent homes from local hosts. Browse by list or map across 500+ cities.",
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
        className="antialiased min-h-screen flex flex-col font-sans overflow-x-hidden"
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <NuqsAdapter>
          <ListingScrollProvider>
            <SearchModalProvider>
              <Header />
              <main id="main-content" className="flex-1 w-full pt-16">
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
