"use client";

import { Minus, Plus } from "@phosphor-icons/react";

const GUEST_TYPES = [
  { id: "adults" as const, label: "Adults", desc: "Ages 13 or above" },
  { id: "children" as const, label: "Children", desc: "Ages 2 – 12" },
  { id: "infants" as const, label: "Infants", desc: "Under 2" },
  { id: "pets" as const, label: "Pets", desc: "Bringing a service animal?" },
];

export type GuestKey = "adults" | "children" | "infants" | "pets";
export type Guests = Record<GuestKey, number>;
export const DEFAULT_GUESTS: Guests = { adults: 0, children: 0, infants: 0, pets: 0 };

export function guestSummary(g: Guests): string {
  const total = g.adults + g.children;
  const parts: string[] = [];
  if (total > 0) parts.push(`${total} guest${total !== 1 ? "s" : ""}`);
  if (g.infants > 0) parts.push(`${g.infants} infant${g.infants !== 1 ? "s" : ""}`);
  if (g.pets > 0) parts.push(`${g.pets} pet${g.pets !== 1 ? "s" : ""}`);
  return parts.join(", ");
}

export function GuestPicker({
  value,
  onChange,
}: {
  value: Guests;
  onChange: (guests: Guests) => void;
}) {
  function update(key: GuestKey, delta: number) {
    onChange({ ...value, [key]: Math.max(0, (value[key] ?? 0) + delta) });
  }

  return (
    <div className="divide-y divide-zinc-100">
      {GUEST_TYPES.map(({ id, label, desc }) => (
        <div key={id} className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900">{label}</p>
            <p className="mt-0.5 text-xs text-zinc-400">{desc}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => update(id, -1)}
              disabled={value[id] === 0}
              className="flex size-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={`Decrease ${label}`}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-4 text-center text-sm tabular-nums text-zinc-900">
              {value[id]}
            </span>
            <button
              type="button"
              onClick={() => update(id, 1)}
              className="flex size-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-900"
              aria-label={`Increase ${label}`}
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
