"use client";

import { useState, useRef, useCallback, useLayoutEffect } from "react";
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

function useIndicatorPosition(
  selected: string,
  buttonRefs: React.MutableRefObject<Record<string, HTMLButtonElement | null>>
) {
  const [style, setStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = buttonRefs.current[selected];
    if (!el) return;

    const update = () => {
      setStyle({ left: el.offsetLeft, width: el.offsetWidth });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el.parentElement ?? el);

    return () => ro.disconnect();
  }, [selected, buttonRefs]);

  return style;
}

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
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const indicatorStyle = useIndicatorPosition(selected, buttonRefs);

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
      className="flex min-w-0 w-full items-end overflow-x-auto overflow-y-hidden md:justify-center"
      role="tablist"
      aria-label="Property type"
    >
      <div className="relative flex shrink-0 items-end justify-start md:justify-center min-w-max">
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
                "inline-flex shrink-0 flex-col items-center gap-1.5 px-4 pb-3 pt-1 text-xs font-medium transition-colors duration-150 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-b-2 border-transparent -mb-px",
                isSelected ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-600"
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              {label}
            </button>
          );
        })}
        {/* Sliding indicator on the divider line; lives in scrollable content so it moves with tabs */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-zinc-900 transition-[left,width] duration-200 ease-out"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          aria-hidden
        />
      </div>
    </div>
  );
}
