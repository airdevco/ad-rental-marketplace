"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const MAX_PADDING = 24; // 24px / pt-6
const SCROLL_THRESHOLD = 120;

export function HeroWithScrollPadding({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"section">) {
  const [paddingTop, setPaddingTop] = useState(MAX_PADDING);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y >= SCROLL_THRESHOLD) {
        setPaddingTop(0);
      } else {
        setPaddingTop(Math.max(0, MAX_PADDING - (y / SCROLL_THRESHOLD) * MAX_PADDING));
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      {...props}
      className={cn("flex justify-center transition-[padding-top] duration-150 ease-out", className)}
      style={{ paddingTop: `${paddingTop}px` }}
    >
      {children}
    </section>
  );
}
