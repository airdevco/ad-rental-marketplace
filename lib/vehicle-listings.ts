export type VehicleCategory = "all" | "economy" | "suvs" | "passenger-vans" | "pickup-truck" | "premium" | "luxury";

export interface VehicleListing {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  seats: number;
  luggage: number;
  doors: number;
  pricePerDay: number;
  category: VehicleCategory;
  rating?: number;
  description?: string;
  location?: { address: string; city: string; state?: string; lat?: number; lon?: number };
  hostId?: string;
  hostName?: string;
  year?: number;
  transmission?: "Automatic" | "Manual";
}

/** Field aliases for home-rental context */
export function getBedroomCount(l: VehicleListing) { return l.seats; }
export function getBathroomCount(l: VehicleListing) { return l.luggage; }
export function getGuestCount(l: VehicleListing) { return l.doors; }
export function getPricePerNight(l: VehicleListing) { return l.pricePerDay; }

/** Real addresses with coordinates for map display (OpenStreetMap) */
const LOCATION_PRESETS: { address: string; city: string; state: string; lat: number; lon: number }[] = [
  { address: "123 Market St", city: "San Francisco", state: "CA", lat: 37.7897, lon: -122.3972 },
  { address: "456 Mission St", city: "San Francisco", state: "CA", lat: 37.7894, lon: -122.4012 },
  { address: "1 World Way", city: "Los Angeles", state: "CA", lat: 33.9425, lon: -118.4081 },
  { address: "350 5th Ave", city: "New York", state: "NY", lat: 40.7484, lon: -73.9857 },
  { address: "233 S Wacker Dr", city: "Chicago", state: "IL", lat: 41.8789, lon: -87.6359 },
  { address: "400 Broad St", city: "Seattle", state: "WA", lat: 47.6205, lon: -122.3493 },
  { address: "100 Cambridge St", city: "Boston", state: "MA", lat: 42.3601, lon: -71.0589 },
  { address: "101 Congress Ave", city: "Austin", state: "TX", lat: 30.2672, lon: -97.7431 },
  { address: "1200 Ocean Dr", city: "Miami Beach", state: "FL", lat: 25.7817, lon: -80.1300 },
  { address: "888 Brannan St", city: "San Francisco", state: "CA", lat: 37.7699, lon: -122.4094 },
  { address: "55 5th Ave", city: "New York", state: "NY", lat: 40.7406, lon: -73.9899 },
  { address: "300 N State St", city: "Chicago", state: "IL", lat: 41.8884, lon: -87.6274 },
  { address: "1800 S Grand Ave", city: "Los Angeles", state: "CA", lat: 34.0407, lon: -118.2468 },
  { address: "501 Dexter Ave N", city: "Seattle", state: "WA", lat: 47.6242, lon: -122.3567 },
  { address: "200 Stuart St", city: "Boston", state: "MA", lat: 42.3505, lon: -71.0754 },
];

/** Full address strings for pickup location autocomplete */
export const PICKUP_LOCATION_OPTIONS = LOCATION_PRESETS.map(
  (p) => `${p.address}, ${p.city}, ${p.state}`
);

/** Resolve full location with coords for a listing (uses presets for listings without explicit lat/lon) */
export function getListingLocation(listing: VehicleListing): { address: string; city: string; state: string; fullAddress: string; lat: number; lon: number } {
  const loc = listing.location;
  const hash = listing.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const preset = LOCATION_PRESETS[hash % LOCATION_PRESETS.length];
  if (loc?.lat != null && loc?.lon != null) {
    const state = loc.state ?? "CA";
    return {
      address: loc.address,
      city: loc.city,
      state,
      fullAddress: `${loc.address}, ${loc.city}, ${state}`,
      lat: loc.lat,
      lon: loc.lon,
    };
  }
  if (loc?.address && loc?.city) {
    const state = loc.state ?? preset.state;
    return {
      address: loc.address,
      city: loc.city,
      state,
      fullAddress: `${loc.address}, ${loc.city}, ${state}`,
      lat: preset.lat,
      lon: preset.lon,
    };
  }
  return {
    ...preset,
    fullAddress: `${preset.address}, ${preset.city}, ${preset.state}`,
  };
}

/** OpenStreetMap embed URL (free, no API key) */
export function getMapEmbedUrl(listing: VehicleListing): string {
  const { lat, lon } = getListingLocation(listing);
  const delta = 0.015;
  const bbox = [lon - delta, lat - delta, lon + delta, lat + delta].join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`;
}

/** OpenStreetMap embed URL for multiple listings - bbox fits all locations */
export function getMapEmbedUrlForListings(listings: VehicleListing[]): string {
  if (listings.length === 0) {
    const bbox = "-122.42,37.77,-122.39,37.80"; // SF default
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
  }
  const locs = listings.map((l) => getListingLocation(l));
  const minLat = Math.min(...locs.map((p) => p.lat));
  const maxLat = Math.max(...locs.map((p) => p.lat));
  const minLon = Math.min(...locs.map((p) => p.lon));
  const maxLon = Math.max(...locs.map((p) => p.lon));
  const pad = 0.05;
  const bbox = [minLon - pad, minLat - pad, maxLon + pad, maxLat + pad].join(
    "%2C"
  );
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;
}

export const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&h=260&fit=crop",
];

const listings: VehicleListing[] = [
  // Apartments (economy)
  { id: "e1", title: "Modern Downtown Loft", subtitle: "Entire apartment", imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=390&fit=crop", seats: 1, luggage: 1, doors: 2, pricePerDay: 89, category: "economy", description: "A beautifully designed downtown loft with floor-to-ceiling windows, modern furnishings, and stunning city views. The open-plan layout features a fully equipped kitchen, comfortable workspace, and a luxurious queen bed.\n\nPerfect for solo travelers or couples looking for a stylish urban retreat. Walking distance to restaurants, shops, and public transit. Includes high-speed WiFi, smart TV, and in-unit washer/dryer. Self check-in with keypad entry.", location: { address: "123 Market St", city: "San Francisco", state: "CA", lat: 37.7897, lon: -122.3972 }, hostId: "h1", hostName: "Alex" },
  { id: "e2", title: "Sunny Studio Near Park", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[3], seats: 1, luggage: 1, doors: 2, pricePerDay: 72, category: "economy" },
  { id: "e3", title: "Cozy Midtown Flat", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[0], seats: 1, luggage: 1, doors: 3, pricePerDay: 95, category: "economy" },
  { id: "e4", title: "Artist Loft in SoHo", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[4], seats: 2, luggage: 1, doors: 4, pricePerDay: 130, category: "economy" },
  { id: "e5", title: "Bright Garden Apartment", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[8], seats: 1, luggage: 1, doors: 2, pricePerDay: 68, category: "economy" },
  { id: "e6", title: "Urban Retreat with Balcony", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[7], seats: 2, luggage: 1, doors: 4, pricePerDay: 110, category: "economy" },
  { id: "e7", title: "Minimalist City Studio", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[6], seats: 1, luggage: 1, doors: 2, pricePerDay: 65, category: "economy" },
  { id: "e8", title: "Penthouse with Skyline View", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[5], seats: 2, luggage: 2, doors: 4, pricePerDay: 185, category: "economy" },
  { id: "e9", title: "Renovated Brownstone Flat", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[2], seats: 2, luggage: 1, doors: 4, pricePerDay: 125, category: "economy" },
  { id: "e10", title: "Charming Walk-Up Studio", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[9], seats: 1, luggage: 1, doors: 2, pricePerDay: 58, category: "economy" },
  { id: "e11", title: "Modern 2BR Apartment", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[1], seats: 2, luggage: 1, doors: 4, pricePerDay: 145, category: "economy" },
  { id: "e12", title: "Rooftop Terrace Flat", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[10], seats: 1, luggage: 1, doors: 3, pricePerDay: 98, category: "economy" },
  // Houses (suvs)
  { id: "s1", title: "Spacious Family Home", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[1], seats: 4, luggage: 3, doors: 8, pricePerDay: 195, category: "suvs" },
  { id: "s2", title: "Charming Victorian House", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[9], seats: 3, luggage: 2, doors: 6, pricePerDay: 175, category: "suvs" },
  { id: "s3", title: "Modern Suburban Retreat", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[2], seats: 3, luggage: 2, doors: 6, pricePerDay: 155, category: "suvs" },
  { id: "s4", title: "Craftsman Bungalow", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[7], seats: 2, luggage: 1, doors: 4, pricePerDay: 120, category: "suvs" },
  { id: "s5", title: "Hilltop Home with Views", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[5], seats: 4, luggage: 3, doors: 8, pricePerDay: 225, category: "suvs" },
  { id: "s6", title: "Renovated Ranch House", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[0], seats: 3, luggage: 2, doors: 6, pricePerDay: 145, category: "suvs" },
  { id: "s7", title: "Cozy Cottage with Garden", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[11], seats: 2, luggage: 1, doors: 4, pricePerDay: 110, category: "suvs" },
  { id: "s8", title: "Mid-Century Modern Home", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[3], seats: 3, luggage: 2, doors: 5, pricePerDay: 165, category: "suvs" },
  { id: "s9", title: "Farmhouse with Acreage", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[6], seats: 4, luggage: 2, doors: 8, pricePerDay: 180, category: "suvs" },
  { id: "s10", title: "Townhouse Near Downtown", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[4], seats: 3, luggage: 2, doors: 6, pricePerDay: 160, category: "suvs" },
  { id: "s11", title: "Colonial Home with Pool", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[8], seats: 5, luggage: 3, doors: 10, pricePerDay: 275, category: "suvs" },
  { id: "s12", title: "A-Frame Family House", subtitle: "Entire house", imageUrl: PLACEHOLDER_IMAGES[10], seats: 3, luggage: 2, doors: 6, pricePerDay: 140, category: "suvs" },
  // Condos (passenger-vans)
  { id: "v1", title: "Oceanview Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[10], seats: 2, luggage: 2, doors: 4, pricePerDay: 165, category: "passenger-vans" },
  { id: "v2", title: "Downtown High-Rise Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[0], seats: 2, luggage: 2, doors: 4, pricePerDay: 155, category: "passenger-vans" },
  { id: "v3", title: "Lakefront Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[4], seats: 2, luggage: 1, doors: 4, pricePerDay: 135, category: "passenger-vans" },
  { id: "v4", title: "Resort-Style Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[8], seats: 3, luggage: 2, doors: 6, pricePerDay: 185, category: "passenger-vans" },
  { id: "v5", title: "Golf Course Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[1], seats: 2, luggage: 2, doors: 4, pricePerDay: 125, category: "passenger-vans" },
  { id: "v6", title: "Skyline View Penthouse", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[5], seats: 3, luggage: 2, doors: 6, pricePerDay: 250, category: "passenger-vans" },
  { id: "v7", title: "Marina District Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[3], seats: 2, luggage: 1, doors: 3, pricePerDay: 145, category: "passenger-vans" },
  { id: "v8", title: "Mountain View Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[6], seats: 2, luggage: 2, doors: 4, pricePerDay: 130, category: "passenger-vans" },
  { id: "v9", title: "Beachside Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[10], seats: 2, luggage: 1, doors: 4, pricePerDay: 170, category: "passenger-vans" },
  { id: "v10", title: "Luxury Tower Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[7], seats: 2, luggage: 2, doors: 4, pricePerDay: 195, category: "passenger-vans" },
  { id: "v11", title: "Garden Terrace Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[2], seats: 2, luggage: 1, doors: 3, pricePerDay: 115, category: "passenger-vans" },
  { id: "v12", title: "Waterfront Condo", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[9], seats: 3, luggage: 2, doors: 5, pricePerDay: 180, category: "passenger-vans" },
  // Cabins (pickup-truck)
  { id: "p1", title: "Rustic Mountain Cabin", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[11], seats: 2, luggage: 1, doors: 4, pricePerDay: 135, category: "pickup-truck" },
  { id: "p2", title: "Lakeside Log Cabin", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[6], seats: 3, luggage: 2, doors: 6, pricePerDay: 175, category: "pickup-truck" },
  { id: "p3", title: "Treehouse Retreat", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[11], seats: 1, luggage: 1, doors: 2, pricePerDay: 110, category: "pickup-truck" },
  { id: "p4", title: "Secluded Forest Cabin", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[6], seats: 2, luggage: 1, doors: 4, pricePerDay: 125, category: "pickup-truck" },
  { id: "p5", title: "A-Frame in the Woods", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[11], seats: 2, luggage: 1, doors: 4, pricePerDay: 145, category: "pickup-truck" },
  { id: "p6", title: "Cozy Ski Cabin", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[6], seats: 3, luggage: 2, doors: 6, pricePerDay: 195, category: "pickup-truck" },
  { id: "p7", title: "Riverside Cabin", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[11], seats: 2, luggage: 1, doors: 4, pricePerDay: 115, category: "pickup-truck" },
  { id: "p8", title: "Hilltop Tiny Cabin", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[6], seats: 1, luggage: 1, doors: 2, pricePerDay: 85, category: "pickup-truck" },
  { id: "p9", title: "Woodland Chalet", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[11], seats: 3, luggage: 2, doors: 6, pricePerDay: 165, category: "pickup-truck" },
  { id: "p10", title: "Remote Wilderness Cabin", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[6], seats: 2, luggage: 1, doors: 3, pricePerDay: 105, category: "pickup-truck" },
  { id: "p11", title: "Luxury Mountain Lodge", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[11], seats: 4, luggage: 3, doors: 8, pricePerDay: 285, category: "pickup-truck" },
  { id: "p12", title: "Creekside Cabin", subtitle: "Entire cabin", imageUrl: PLACEHOLDER_IMAGES[6], seats: 2, luggage: 1, doors: 4, pricePerDay: 120, category: "pickup-truck" },
  // Beachfront (premium)
  { id: "r1", title: "Malibu Beach House", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 3, luggage: 2, doors: 6, pricePerDay: 295, category: "premium" },
  { id: "r2", title: "Oceanfront Bungalow", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 2, luggage: 1, doors: 4, pricePerDay: 185, category: "premium" },
  { id: "r3", title: "Tropical Beach Villa", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 4, luggage: 3, doors: 8, pricePerDay: 350, category: "premium" },
  { id: "r4", title: "Seaside Cottage", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 2, luggage: 1, doors: 4, pricePerDay: 155, category: "premium" },
  { id: "r5", title: "Coastal Retreat", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 3, luggage: 2, doors: 6, pricePerDay: 225, category: "premium" },
  { id: "r6", title: "Surf Shack on the Sand", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 1, luggage: 1, doors: 2, pricePerDay: 125, category: "premium" },
  { id: "r7", title: "Cliffside Ocean Home", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 3, luggage: 2, doors: 6, pricePerDay: 275, category: "premium" },
  { id: "r8", title: "Beachfront Penthouse", subtitle: "Entire condo", imageUrl: PLACEHOLDER_IMAGES[10], seats: 2, luggage: 2, doors: 4, pricePerDay: 320, category: "premium" },
  { id: "r9", title: "Sandy Shores Hideaway", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 2, luggage: 1, doors: 4, pricePerDay: 165, category: "premium" },
  { id: "r10", title: "Island Beach House", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 4, luggage: 3, doors: 8, pricePerDay: 380, category: "premium" },
  { id: "r11", title: "Pacific Coast Cabin", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[10], seats: 2, luggage: 1, doors: 4, pricePerDay: 145, category: "premium" },
  { id: "r12", title: "Bayfront Studio", subtitle: "Entire apartment", imageUrl: PLACEHOLDER_IMAGES[10], seats: 1, luggage: 1, doors: 2, pricePerDay: 110, category: "premium" },
  // Luxury (luxury)
  { id: "l1", title: "Luxury Hillside Villa", subtitle: "Entire villa", imageUrl: PLACEHOLDER_IMAGES[5], seats: 5, luggage: 4, doors: 10, pricePerDay: 450, category: "luxury" },
  { id: "l2", title: "Designer Penthouse Suite", subtitle: "Entire penthouse", imageUrl: PLACEHOLDER_IMAGES[7], seats: 3, luggage: 3, doors: 6, pricePerDay: 395, category: "luxury" },
  { id: "l3", title: "Estate with Private Pool", subtitle: "Entire estate", imageUrl: PLACEHOLDER_IMAGES[5], seats: 6, luggage: 5, doors: 12, pricePerDay: 580, category: "luxury" },
  { id: "l4", title: "Modern Glass Mansion", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[7], seats: 5, luggage: 4, doors: 10, pricePerDay: 650, category: "luxury" },
  { id: "l5", title: "Waterfront Luxury Home", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[5], seats: 4, luggage: 3, doors: 8, pricePerDay: 425, category: "luxury" },
  { id: "l6", title: "Private Island Retreat", subtitle: "Entire property", imageUrl: PLACEHOLDER_IMAGES[7], seats: 3, luggage: 2, doors: 6, pricePerDay: 750, category: "luxury" },
  { id: "l7", title: "Château in Wine Country", subtitle: "Entire estate", imageUrl: PLACEHOLDER_IMAGES[5], seats: 5, luggage: 4, doors: 10, pricePerDay: 520, category: "luxury" },
  { id: "l8", title: "Contemporary Smart Home", subtitle: "Entire home", imageUrl: PLACEHOLDER_IMAGES[7], seats: 4, luggage: 3, doors: 8, pricePerDay: 375, category: "luxury" },
  { id: "l9", title: "Infinity Pool Villa", subtitle: "Entire villa", imageUrl: PLACEHOLDER_IMAGES[5], seats: 4, luggage: 3, doors: 8, pricePerDay: 490, category: "luxury" },
  { id: "l10", title: "Luxury Loft Warehouse", subtitle: "Entire loft", imageUrl: PLACEHOLDER_IMAGES[7], seats: 2, luggage: 2, doors: 4, pricePerDay: 310, category: "luxury" },
  { id: "l11", title: "Grand Manor House", subtitle: "Entire estate", imageUrl: PLACEHOLDER_IMAGES[5], seats: 6, luggage: 5, doors: 12, pricePerDay: 620, category: "luxury" },
  { id: "l12", title: "Penthouse with Rooftop", subtitle: "Entire penthouse", imageUrl: PLACEHOLDER_IMAGES[7], seats: 3, luggage: 2, doors: 6, pricePerDay: 420, category: "luxury" },
];

export function getListingsByCategory(category: VehicleCategory): VehicleListing[] {
  if (category === "all") return listings;
  return listings.filter((l) => l.category === category);
}

/** Deterministic dummy rating (4.20–4.95) from listing id for display */
export function getDummyRating(listingId: string): number {
  const n = listingId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.round((4.2 + (n % 76) / 100) * 100) / 100;
}

const DUMMY_DETAILS: Partial<VehicleListing> = {
  description: "Thoughtfully furnished home with modern amenities. Perfect for your next stay. All bookings include host support and property protection.",
  hostId: "h1",
  hostName: "Alex",
};

export function getListingById(id: string): VehicleListing | undefined {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return undefined;
  return { ...DUMMY_DETAILS, ...listing };
}

/** Modern Downtown Loft (e1) gallery images */
const LOFT_E1_GALLERY = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=390&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=390&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=390&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=390&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=390&fit=crop",
];

/** Gallery images for listing detail (main + 4 thumbnails, total 19 for "Show all") */
export function getListingGalleryImages(listing: VehicleListing): string[] {
  if (listing.id === "e1") {
    return [listing.imageUrl, ...LOFT_E1_GALLERY];
  }
  const idx = listing.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % PLACEHOLDER_IMAGES.length;
  const out: string[] = [listing.imageUrl];
  for (let i = 1; i < 19; i++) {
    out.push(PLACEHOLDER_IMAGES[(idx + i) % PLACEHOLDER_IMAGES.length]);
  }
  return out;
}

/** Home features with icons (like "This place has") */
export const CAR_FEATURES = [
  { icon: "wifi", label: "High-speed WiFi" },
  { icon: "kitchen", label: "Full kitchen" },
  { icon: "ac", label: "Air conditioning" },
  { icon: "washer", label: "Washer/Dryer" },
  { icon: "parking", label: "Free parking" },
] as const;

/** Detailed amenities by category (What this place offers) */
export const CAR_AMENITIES: Record<string, string[]> = {
  "Essentials": ["WiFi", "Kitchen", "Washer", "Dryer", "Air conditioning"],
  "Comfort": ["Heating", "TV", "Coffee maker", "Workspace", "Iron"],
  "Outdoor": ["Patio", "BBQ grill", "Garden", "Pool access"],
};

/** Review shape for display */
export type ListingReview = {
  author: string;
  location: string;
  rating: number;
  date: string;
  stayDuration: string;
  text: string;
  avatarUrl: string;
};

/** Dummy reviews */
export function getListingReviews(listingId: string): ListingReview[] {
  return [
    {
      author: "Juno",
      location: "Los Angeles, California",
      rating: 5,
      date: "1 week ago",
      stayDuration: "Stayed a few nights",
      text: "The place was wonderful! It's in such a convenient location and there are so many great places to explore nearby. The home was spotless and well maintained, which was perfect for our vacation. Would definitely book again!",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    },
    {
      author: "Daniel",
      location: "Kansas City, Missouri",
      rating: 5,
      date: "November 2025",
      stayDuration: "Stayed one night",
      text: "Best rental experience I've ever had! Super responsive host, clean home, and smooth check-in process. I've been fortunate to stay in many rentals over the years and this was top notch. Everything was exactly as described.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    },
    {
      author: "Emma",
      location: "Toronto, Canada",
      rating: 5,
      date: "2 weeks ago",
      stayDuration: "Stayed a few nights",
      text: "We loved staying here! The host was always responsive, very friendly, and was there to answer any questions. They even gave us some great recommendations for the area. The space was perfect for our family.",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    },
    {
      author: "CeCe",
      location: "Boston, Massachusetts",
      rating: 5,
      date: "January 2026",
      stayDuration: "Stayed a few nights",
      text: "Super responsive and reliable host! The home was clean, modern, and exactly as described. Check-in was seamless and checkout was hassle-free. We enjoyed our stay and would definitely book again.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face",
    },
  ];
}

/** Dummy review count from listing id */
export function getListingReviewCount(listingId: string): number {
  const n = listingId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 40 + (n % 30);
}
