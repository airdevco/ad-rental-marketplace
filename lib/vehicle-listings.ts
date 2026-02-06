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

export const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=400&h=260&fit=crop",
  "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=260&fit=crop",
];

const listings: VehicleListing[] = [
  // Economy (12)
  { id: "e1", title: "Tesla Model Y 2024", subtitle: "or similar electric SUV", imageUrl: "https://images.turo.com/media/vehicle/images/ewUbL3QrTLCokGPQPCpsbw.1242x745.jpg", seats: 5, luggage: 2, doors: 4, pricePerDay: 32, category: "economy", description: "The Tesla Model Y 2024 is a versatile all-electric SUV that combines impressive range, spacious interior, and advanced technology. With seating for five and ample cargo space, it's ideal for both daily commutes and weekend road trips.\n\nFeatures include Autopilot, a panoramic glass roof, and access to the Tesla Supercharger network for fast charging. The minimalist interior offers a premium feel with a large touchscreen and vegan leather seating. Well-maintained with regular servicing and detailed cleaning before each rental. All rentals include insurance and 24/7 roadside assistance.", location: { address: "123 Market St", city: "San Francisco", state: "CA", lat: 37.7897, lon: -122.3972 }, hostId: "h1", hostName: "Alex", year: 2024, transmission: "Automatic" },
  { id: "e2", title: "Toyota Corolla", subtitle: "or similar compact", imageUrl: PLACEHOLDER_IMAGES[1], seats: 5, luggage: 2, doors: 4, pricePerDay: 28, category: "economy" },
  { id: "e3", title: "Hyundai Elantra", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[2], seats: 5, luggage: 2, doors: 4, pricePerDay: 35, category: "economy" },
  { id: "e4", title: "Nissan Sentra", subtitle: "or similar compact", imageUrl: PLACEHOLDER_IMAGES[3], seats: 5, luggage: 2, doors: 4, pricePerDay: 30, category: "economy" },
  { id: "e5", title: "Mazda 3", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[4], seats: 5, luggage: 2, doors: 4, pricePerDay: 33, category: "economy" },
  { id: "e6", title: "Kia Forte", subtitle: "or similar compact", imageUrl: PLACEHOLDER_IMAGES[5], seats: 5, luggage: 2, doors: 4, pricePerDay: 27, category: "economy" },
  { id: "e7", title: "Volkswagen Jetta", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[6], seats: 5, luggage: 2, doors: 4, pricePerDay: 38, category: "economy" },
  { id: "e8", title: "Chevrolet Malibu", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[7], seats: 5, luggage: 2, doors: 4, pricePerDay: 34, category: "economy" },
  { id: "e9", title: "Subaru Impreza", subtitle: "or similar compact", imageUrl: PLACEHOLDER_IMAGES[8], seats: 5, luggage: 2, doors: 4, pricePerDay: 36, category: "economy" },
  { id: "e10", title: "Ford Focus", subtitle: "or similar compact", imageUrl: PLACEHOLDER_IMAGES[9], seats: 5, luggage: 2, doors: 4, pricePerDay: 29, category: "economy" },
  { id: "e11", title: "Hyundai Accent", subtitle: "or similar compact", imageUrl: PLACEHOLDER_IMAGES[10], seats: 5, luggage: 2, doors: 4, pricePerDay: 24, category: "economy" },
  { id: "e12", title: "Kia Rio", subtitle: "or similar compact", imageUrl: PLACEHOLDER_IMAGES[11], seats: 5, luggage: 2, doors: 4, pricePerDay: 26, category: "economy" },
  // SUVs (12)
  { id: "s1", title: "Mitsubishi Outlander Sport", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[4], seats: 5, luggage: 3, doors: 4, pricePerDay: 45, category: "suvs" },
  { id: "s2", title: "Toyota RAV4", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[5], seats: 5, luggage: 4, doors: 4, pricePerDay: 52, category: "suvs" },
  { id: "s3", title: "Honda CR-V", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[6], seats: 5, luggage: 3, doors: 4, pricePerDay: 48, category: "suvs" },
  { id: "s4", title: "Ford Escape", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[7], seats: 5, luggage: 3, doors: 4, pricePerDay: 50, category: "suvs" },
  { id: "s5", title: "Mazda CX-5", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[0], seats: 5, luggage: 3, doors: 4, pricePerDay: 47, category: "suvs" },
  { id: "s6", title: "Subaru Outback", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[1], seats: 5, luggage: 4, doors: 4, pricePerDay: 55, category: "suvs" },
  { id: "s7", title: "Nissan Rogue", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[2], seats: 5, luggage: 3, doors: 4, pricePerDay: 46, category: "suvs" },
  { id: "s8", title: "Chevrolet Equinox", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[3], seats: 5, luggage: 3, doors: 4, pricePerDay: 44, category: "suvs" },
  { id: "s9", title: "Jeep Compass", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[4], seats: 5, luggage: 3, doors: 4, pricePerDay: 51, category: "suvs" },
  { id: "s10", title: "Hyundai Tucson", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[5], seats: 5, luggage: 3, doors: 4, pricePerDay: 49, category: "suvs" },
  { id: "s11", title: "Kia Sportage", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[6], seats: 5, luggage: 3, doors: 4, pricePerDay: 48, category: "suvs" },
  { id: "s12", title: "Volkswagen Tiguan", subtitle: "or similar SUV", imageUrl: PLACEHOLDER_IMAGES[7], seats: 5, luggage: 3, doors: 4, pricePerDay: 53, category: "suvs" },
  // Passenger vans (12)
  { id: "v1", title: "Chrysler Pacifica", subtitle: "or similar minivan", imageUrl: PLACEHOLDER_IMAGES[8], seats: 7, luggage: 4, doors: 4, pricePerDay: 68, category: "passenger-vans" },
  { id: "v2", title: "Honda Odyssey", subtitle: "or similar minivan", imageUrl: PLACEHOLDER_IMAGES[9], seats: 8, luggage: 4, doors: 4, pricePerDay: 72, category: "passenger-vans" },
  { id: "v3", title: "Toyota Sienna", subtitle: "or similar minivan", imageUrl: PLACEHOLDER_IMAGES[10], seats: 7, luggage: 4, doors: 4, pricePerDay: 75, category: "passenger-vans" },
  { id: "v4", title: "Kia Carnival", subtitle: "or similar van", imageUrl: PLACEHOLDER_IMAGES[11], seats: 7, luggage: 4, doors: 4, pricePerDay: 70, category: "passenger-vans" },
  { id: "v5", title: "Dodge Grand Caravan", subtitle: "or similar minivan", imageUrl: PLACEHOLDER_IMAGES[0], seats: 7, luggage: 4, doors: 4, pricePerDay: 65, category: "passenger-vans" },
  { id: "v6", title: "Ford Transit Passenger", subtitle: "or similar van", imageUrl: PLACEHOLDER_IMAGES[1], seats: 10, luggage: 5, doors: 4, pricePerDay: 95, category: "passenger-vans" },
  { id: "v7", title: "Mercedes-Benz Sprinter", subtitle: "or similar passenger van", imageUrl: PLACEHOLDER_IMAGES[2], seats: 12, luggage: 6, doors: 4, pricePerDay: 120, category: "passenger-vans" },
  { id: "v8", title: "Chevrolet Traverse", subtitle: "or similar 3-row SUV", imageUrl: PLACEHOLDER_IMAGES[3], seats: 7, luggage: 4, doors: 4, pricePerDay: 78, category: "passenger-vans" },
  { id: "v9", title: "GMC Acadia", subtitle: "or similar 3-row SUV", imageUrl: PLACEHOLDER_IMAGES[4], seats: 7, luggage: 4, doors: 4, pricePerDay: 76, category: "passenger-vans" },
  { id: "v10", title: "Nissan Pathfinder", subtitle: "or similar 3-row SUV", imageUrl: PLACEHOLDER_IMAGES[5], seats: 7, luggage: 4, doors: 4, pricePerDay: 74, category: "passenger-vans" },
  { id: "v11", title: "Ford Explorer", subtitle: "or similar 3-row SUV", imageUrl: PLACEHOLDER_IMAGES[6], seats: 7, luggage: 4, doors: 4, pricePerDay: 80, category: "passenger-vans" },
  { id: "v12", title: "Toyota Highlander", subtitle: "or similar 3-row SUV", imageUrl: PLACEHOLDER_IMAGES[7], seats: 7, luggage: 4, doors: 4, pricePerDay: 82, category: "passenger-vans" },
  // Pickup trucks (12)
  { id: "p1", title: "Ford F-150", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[0], seats: 5, luggage: 2, doors: 4, pricePerDay: 85, category: "pickup-truck" },
  { id: "p2", title: "Chevrolet Silverado", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[1], seats: 5, luggage: 2, doors: 4, pricePerDay: 82, category: "pickup-truck" },
  { id: "p3", title: "Ram 1500", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[2], seats: 5, luggage: 2, doors: 4, pricePerDay: 88, category: "pickup-truck" },
  { id: "p4", title: "Toyota Tacoma", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[3], seats: 5, luggage: 2, doors: 4, pricePerDay: 78, category: "pickup-truck" },
  { id: "p5", title: "GMC Sierra 1500", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[4], seats: 5, luggage: 2, doors: 4, pricePerDay: 86, category: "pickup-truck" },
  { id: "p6", title: "Nissan Frontier", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[5], seats: 5, luggage: 2, doors: 4, pricePerDay: 72, category: "pickup-truck" },
  { id: "p7", title: "Honda Ridgeline", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[6], seats: 5, luggage: 2, doors: 4, pricePerDay: 80, category: "pickup-truck" },
  { id: "p8", title: "Chevrolet Colorado", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[7], seats: 5, luggage: 2, doors: 4, pricePerDay: 75, category: "pickup-truck" },
  { id: "p9", title: "GMC Canyon", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[8], seats: 5, luggage: 2, doors: 4, pricePerDay: 76, category: "pickup-truck" },
  { id: "p10", title: "Ford Ranger", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[9], seats: 5, luggage: 2, doors: 4, pricePerDay: 74, category: "pickup-truck" },
  { id: "p11", title: "Toyota Tundra", subtitle: "or similar pickup", imageUrl: PLACEHOLDER_IMAGES[10], seats: 5, luggage: 2, doors: 4, pricePerDay: 92, category: "pickup-truck" },
  { id: "p12", title: "Ram 2500", subtitle: "or similar heavy-duty pickup", imageUrl: PLACEHOLDER_IMAGES[11], seats: 5, luggage: 2, doors: 4, pricePerDay: 105, category: "pickup-truck" },
  // Premium (12)
  { id: "r1", title: "BMW 3 Series", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[4], seats: 5, luggage: 2, doors: 4, pricePerDay: 95, category: "premium" },
  { id: "r2", title: "Audi A4", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[5], seats: 5, luggage: 2, doors: 4, pricePerDay: 98, category: "premium" },
  { id: "r3", title: "Mercedes C-Class", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[6], seats: 5, luggage: 2, doors: 4, pricePerDay: 105, category: "premium" },
  { id: "r4", title: "Lexus ES 350", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[7], seats: 5, luggage: 2, doors: 4, pricePerDay: 92, category: "premium" },
  { id: "r5", title: "Audi A5", subtitle: "or similar coupe", imageUrl: PLACEHOLDER_IMAGES[8], seats: 4, luggage: 2, doors: 2, pricePerDay: 102, category: "premium" },
  { id: "r6", title: "BMW 4 Series", subtitle: "or similar coupe", imageUrl: PLACEHOLDER_IMAGES[9], seats: 4, luggage: 2, doors: 2, pricePerDay: 108, category: "premium" },
  { id: "r7", title: "Cadillac CT5", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[10], seats: 5, luggage: 2, doors: 4, pricePerDay: 88, category: "premium" },
  { id: "r8", title: "Genesis G80", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[11], seats: 5, luggage: 2, doors: 4, pricePerDay: 90, category: "premium" },
  { id: "r9", title: "Volvo S60", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[0], seats: 5, luggage: 2, doors: 4, pricePerDay: 85, category: "premium" },
  { id: "r10", title: "Infiniti Q50", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[1], seats: 5, luggage: 2, doors: 4, pricePerDay: 87, category: "premium" },
  { id: "r11", title: "Acura TLX", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[2], seats: 5, luggage: 2, doors: 4, pricePerDay: 82, category: "premium" },
  { id: "r12", title: "Jaguar XE", subtitle: "or similar sedan", imageUrl: PLACEHOLDER_IMAGES[3], seats: 5, luggage: 2, doors: 4, pricePerDay: 110, category: "premium" },
  // Luxury (12)
  { id: "l1", title: "Mercedes S-Class", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[8], seats: 5, luggage: 2, doors: 4, pricePerDay: 185, category: "luxury" },
  { id: "l2", title: "BMW 7 Series", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[9], seats: 5, luggage: 2, doors: 4, pricePerDay: 175, category: "luxury" },
  { id: "l3", title: "Audi A8", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[10], seats: 5, luggage: 2, doors: 4, pricePerDay: 165, category: "luxury" },
  { id: "l4", title: "Porsche Panamera", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[11], seats: 4, luggage: 2, doors: 4, pricePerDay: 220, category: "luxury" },
  { id: "l5", title: "Lexus LS 500", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[0], seats: 5, luggage: 2, doors: 4, pricePerDay: 155, category: "luxury" },
  { id: "l6", title: "Genesis G90", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[1], seats: 5, luggage: 2, doors: 4, pricePerDay: 140, category: "luxury" },
  { id: "l7", title: "Mercedes E-Class", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[2], seats: 5, luggage: 2, doors: 4, pricePerDay: 135, category: "luxury" },
  { id: "l8", title: "BMW 5 Series", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[3], seats: 5, luggage: 2, doors: 4, pricePerDay: 130, category: "luxury" },
  { id: "l9", title: "Audi A7", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[4], seats: 5, luggage: 2, doors: 4, pricePerDay: 145, category: "luxury" },
  { id: "l10", title: "Cadillac CT6", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[5], seats: 5, luggage: 2, doors: 4, pricePerDay: 125, category: "luxury" },
  { id: "l11", title: "Jaguar XF", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[6], seats: 5, luggage: 2, doors: 4, pricePerDay: 128, category: "luxury" },
  { id: "l12", title: "Maserati Ghibli", subtitle: "or similar luxury sedan", imageUrl: PLACEHOLDER_IMAGES[7], seats: 5, luggage: 2, doors: 4, pricePerDay: 195, category: "luxury" },
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
  description: "Well-maintained vehicle with clean interior. Perfect for your next trip. All rentals include insurance and 24/7 roadside assistance.",
  hostId: "h1",
  hostName: "Alex",
  year: 2023,
  transmission: "Automatic",
};

export function getListingById(id: string): VehicleListing | undefined {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return undefined;
  return { ...DUMMY_DETAILS, ...listing };
}

/** Tesla Model Y (e1) gallery images from Turo */
const TESLA_E1_GALLERY = [
  "https://images.turo.com/media/vehicle/images/fenUEuJRRJ2ul9EPO2te7A.1242x745.jpg",
  "https://images.turo.com/media/vehicle/images/DwjsH_X3R1aCEGDKnCRtzg.1242x745.jpg",
  "https://images.turo.com/media/vehicle/images/NF5Sh3L4R9uT4wrtUCPizg.1242x745.jpg",
  "https://images.turo.com/media/vehicle/images/9uxxthS7TBqB1bS38P6Z3Q.1242x745.jpg",
  "https://images.turo.com/media/vehicle/images/oz-yC2eAQUStHBWtO5HYxw.1242x745.jpg",
];

/** Gallery images for listing detail (main + 4 thumbnails, total 19 for "Show all") */
export function getListingGalleryImages(listing: VehicleListing): string[] {
  if (listing.id === "e1") {
    return [listing.imageUrl, ...TESLA_E1_GALLERY];
  }
  const idx = listing.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % PLACEHOLDER_IMAGES.length;
  const out: string[] = [listing.imageUrl];
  for (let i = 1; i < 19; i++) {
    out.push(PLACEHOLDER_IMAGES[(idx + i) % PLACEHOLDER_IMAGES.length]);
  }
  return out;
}

/** Car features with icons (like "This car has") */
export const CAR_FEATURES = [
  { icon: "bluetooth", label: "Bluetooth" },
  { icon: "usb", label: "USB charging" },
  { icon: "ac", label: "A/C" },
  { icon: "backup", label: "Backup camera" },
  { icon: "cruise", label: "Cruise control" },
] as const;

/** Detailed amenities by category (What this car offers) */
export const CAR_AMENITIES: Record<string, string[]> = {
  "Tech & Entertainment": ["Apple CarPlay", "Android Auto", "Bluetooth", "USB ports", "Rear camera"],
  "Comfort": ["A/C", "Heated seats", "Leather seats", "Sunroof"],
  "Safety": ["ABS", "Airbags", "Blind spot monitoring", "Lane assist"],
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

/** Dummy reviews - styled like Airbnb reviews */
export function getListingReviews(listingId: string): ListingReview[] {
  return [
    {
      author: "Juno",
      location: "Los Angeles, California",
      rating: 5,
      date: "1 week ago",
      stayDuration: "Stayed a few nights",
      text: "The car was wonderful! It's in such a convenient location and there are so many great places to explore nearby. The vehicle was clean and well maintained, which was perfect for our road trip. Would definitely rent again!",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    },
    {
      author: "Daniel",
      location: "Kansas City, Missouri",
      rating: 5,
      date: "November 2025",
      stayDuration: "Stayed one night",
      text: "Best rental experience I've ever had! Super responsive host, clean car, and smooth pickup process. I've been fortunate to rent quite a bit over the years and this was top notch. I always appreciate when everything works as expected.",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    },
    {
      author: "Emma",
      location: "Toronto, Canada",
      rating: 5,
      date: "2 weeks ago",
      stayDuration: "Stayed a few nights",
      text: "We loved renting this car! The host was always responsive, very friendly, and was there to answer any questions. They even gave us some great recommendations for the area. The car ran perfectly throughout our trip.",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    },
    {
      author: "CeCe",
      location: "Boston, Massachusetts",
      rating: 5,
      date: "January 2026",
      stayDuration: "Stayed a few nights",
      text: "Super responsive and reliable host! The car was clean, modern, and exactly as described. Pickup was smooth and the return process was hassle-free. We enjoyed our trip and would definitely rent again.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face",
    },
  ];
}

/** Dummy review count from listing id */
export function getListingReviewCount(listingId: string): number {
  const n = listingId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 40 + (n % 30);
}
