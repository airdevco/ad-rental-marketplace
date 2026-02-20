"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  LayoutGrid,
  Building2,
  Home,
  Building,
  TreePine,
  Waves,
  Crown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "economy", label: "Apartments", icon: Building2 },
  { id: "suvs", label: "Houses", icon: Home },
  { id: "passenger-vans", label: "Condos", icon: Building },
  { id: "pickup-truck", label: "Cabins", icon: TreePine },
  { id: "premium", label: "Beachfront", icon: Waves },
  { id: "luxury", label: "Luxury", icon: Crown },
];

export const VEHICLE_TITLE_MAP: Record<string, string> = {
  all: "All homes",
  economy: "Apartments",
  suvs: "Houses",
  "passenger-vans": "Condos",
  "pickup-truck": "Cabins",
  premium: "Beachfront homes",
  luxury: "Luxury homes",
};

export function VehicleTypeSelector({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (id: string) => void;
} = {}) {
  const [internalSelected, setInternalSelected] = useState("all");
  const selected = value ?? internalSelected;
  const setSelected = onChange ?? setInternalSelected;
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  function measurePill() {
    const btn = selected ? buttonRefs.current[selected] : null;
    const container = containerRef.current;
    if (!btn || !container) return;
    const cr = container.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setPillStyle({ left: br.left - cr.left, width: br.width });
  }

  useEffect(() => {
    const t = requestAnimationFrame(measurePill);
    return () => cancelAnimationFrame(t);
  }, [selected]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => measurePill());
    ro.observe(container);
    return () => ro.disconnect();
  }, [selected]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentId: string) => {
      const idx = OPTIONS.findIndex((o) => o.id === currentId);
      if (idx < 0) return;
      let nextIdx = idx;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        nextIdx = Math.min(idx + 1, OPTIONS.length - 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        nextIdx = Math.max(idx - 1, 0);
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIdx = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIdx = OPTIONS.length - 1;
      } else {
        return;
      }
      const nextId = OPTIONS[nextIdx].id;
      setSelected(nextId);
      buttonRefs.current[nextId]?.focus();
    },
    [setSelected]
  );

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-2 overflow-x-auto overflow-y-hidden py-1 md:flex-wrap md:justify-center md:overflow-visible md:py-0 -mx-1 px-1 md:mx-0 md:px-0"
      role="tablist"
      aria-label="Property type"
    >
      {/* Sliding pill - desktop only; mobile uses direct bg on button */}
      <div
        className="pointer-events-none absolute top-0 hidden h-9 rounded-md bg-zinc-900 transition-all duration-300 ease-out md:block"
        style={{ left: pillStyle.left, width: pillStyle.width }}
        aria-hidden
      />
      {OPTIONS.map(({ id, label, icon: Icon }) => {
        const isSelected = selected === id;
        return (
          <button
            key={id}
            ref={(el) => {
              buttonRefs.current[id] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => setSelected(id)}
            onKeyDown={(e) => handleKeyDown(e, id)}
            className={cn(
              "relative z-10 inline-flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 has-[>svg]:px-2.5",
              isSelected
                ? "bg-zinc-900 text-white md:bg-transparent"
                : "text-zinc-900 hover:bg-zinc-100"
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                (id === "suvs" || id === "passenger-vans") && "scale-110"
              )}
              aria-hidden
            />
            {label}
          </button>
        );
      })}
    </div>
  );
}
