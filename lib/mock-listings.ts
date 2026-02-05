export type Listing = {
  id: string;
  title: string;
  description: string;
  pricePerNight: number;
  location: { address: string; city: string; lat: number; lng: number };
  imageUrl: string;
  listerId: string;
  listerName: string;
  badge?: "New" | "Popular" | "Featured";
  rating?: number;
  reviewCount?: number;
};

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Downtown loft",
    description: "Spacious loft with city views. Walking distance to restaurants and transit.",
    pricePerNight: 120,
    location: { address: "123 Main St", city: "San Francisco", lat: 37.7749, lng: -122.4194 },
    imageUrl: "/next.svg",
    listerId: "u1",
    listerName: "Alex",
    badge: "Popular",
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "2",
    title: "Cozy cabin",
    description: "Lake view cabin. Perfect for a quiet getaway.",
    pricePerNight: 95,
    location: { address: "456 Lake Rd", city: "Tahoe", lat: 39.0968, lng: -120.0324 },
    imageUrl: "/vercel.svg",
    listerId: "u2",
    listerName: "Jordan",
    badge: "New",
    rating: 4.9,
    reviewCount: 12,
  },
  {
    id: "3",
    title: "City studio",
    description: "Central location. Ideal for solo travelers.",
    pricePerNight: 85,
    location: { address: "789 Oak Ave", city: "Oakland", lat: 37.8044, lng: -122.2712 },
    imageUrl: "/next.svg",
    listerId: "u1",
    listerName: "Alex",
    rating: 4.5,
    reviewCount: 8,
  },
  {
    id: "4",
    title: "Beach house",
    description: "Steps from the sand. Family-friendly with a full kitchen.",
    pricePerNight: 220,
    location: { address: "100 Shore Dr", city: "Santa Cruz", lat: 36.9741, lng: -122.0308 },
    imageUrl: "/vercel.svg",
    listerId: "u3",
    listerName: "Sam",
    badge: "Featured",
    rating: 4.95,
    reviewCount: 31,
  },
  {
    id: "5",
    title: "Garden cottage",
    description: "Private cottage with a garden. Quiet neighborhood.",
    pricePerNight: 78,
    location: { address: "200 Elm St", city: "Berkeley", lat: 37.8715, lng: -122.273 },
    imageUrl: "/next.svg",
    listerId: "u2",
    listerName: "Jordan",
    rating: 4.7,
    reviewCount: 15,
  },
];
