"use client";

import { useEffect, useRef, useState } from "react";
import type { VehicleListing } from "@/lib/vehicle-listings";
import { getListingLocation } from "@/lib/vehicle-listings";
import "leaflet/dist/leaflet.css";

type SearchMapLeafletProps = {
  listings: VehicleListing[];
  selectedId: string | null;
  onSelectListing: (id: string) => void;
  className?: string;
};

export function SearchMapLeaflet({
  listings,
  selectedId,
  onSelectListing,
  className = "",
}: SearchMapLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ remove: () => void } | null>(null);
  const markersRef = useRef<{ remove: () => void }[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    let cancelled = false;

    void (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;

      const defaultCenter: [number, number] = [37.7847, -122.3972];
      const defaultZoom = 10;

      const map = L.map(mapRef.current).setView(defaultCenter, defaultZoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersRef.current = [];
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapInstanceRef.current;
    if (!map || typeof window === "undefined") return;

    // Location markers hidden for now - fit bounds to listing area when we have listings
    const L = require("leaflet");
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (listings.length > 0) {
      const bounds: [number, number][] = listings.map((listing) => {
        const { lat, lon } = getListingLocation(listing);
        return [lat, lon];
      });
      map.fitBounds(bounds, {
        padding: [24, 24],
        maxZoom: 14,
      });
    }
  }, [listings, mapReady]);

  return <div ref={mapRef} className={`h-full w-full ${className}`} />;
}
