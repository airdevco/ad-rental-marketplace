"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
} from "react";
import type { DateRange } from "react-day-picker";
import type { Guests } from "@/components/landing/guest-picker";

export type SearchModalInitialValues = {
  whereValue?: string;
  dateRange?: DateRange;
  guests?: Guests;
};

type SearchModalContextValue = {
  open: boolean;
  openSearchModal: (initialValues?: SearchModalInitialValues) => void;
  closeSearchModal: () => void;
  initialValues: SearchModalInitialValues | null;
};

const SearchModalContext = createContext<SearchModalContextValue | null>(null);

export function SearchModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialValues, setInitialValues] =
    useState<SearchModalInitialValues | null>(null);

  const openSearchModal = useCallback((values?: SearchModalInitialValues) => {
    setInitialValues(values ?? null);
    setOpen(true);
  }, []);

  const closeSearchModal = useCallback(() => {
    setOpen(false);
    setInitialValues(null);
  }, []);

  const value = useMemo(
    () => ({ open, openSearchModal, closeSearchModal, initialValues }),
    [open, openSearchModal, closeSearchModal, initialValues]
  );

  return (
    <SearchModalContext.Provider value={value}>
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const ctx = useContext(SearchModalContext);
  if (!ctx) {
    throw new Error("useSearchModal must be used within SearchModalProvider");
  }
  return ctx;
}
