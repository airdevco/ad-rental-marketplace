"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ListingScrollContextValue = {
  pastGallery: boolean;
  setPastGallery: (v: boolean) => void;
};

const ListingScrollContext = createContext<ListingScrollContextValue | null>(null);

export function ListingScrollProvider({ children }: { children: ReactNode }) {
  const [pastGallery, setPastGallery] = useState(false);
  return (
    <ListingScrollContext.Provider value={{ pastGallery, setPastGallery }}>
      {children}
    </ListingScrollContext.Provider>
  );
}

export function useListingScroll() {
  const ctx = useContext(ListingScrollContext);
  return ctx ?? { pastGallery: false, setPastGallery: () => {} };
}
