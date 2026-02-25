import { notFound } from "next/navigation";
import { PublicProfile } from "@/components/profile/public-profile";
import type { SellerProfile, BuyerProfile } from "@/components/profile/public-profile";
import { getListingsByCategory, getListingReviews } from "@/lib/vehicle-listings";

/* -------------------------------------------------------------------------- */
/*  Mock profile data                                                          */
/* -------------------------------------------------------------------------- */

const HOST_PHOTO =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face";
const BUYER_PHOTO =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face";

// Reviews that hosts write about buyers
const BUYER_REVIEWS = [
  {
    author: "Jamie Rivera",
    location: "San Francisco, CA",
    rating: 5,
    date: "January 2026",
    stayDuration: "3 nights",
    text: "Alex was a wonderful guest — very communicative, left the place spotless, and respected all house rules. Would welcome them back any time!",
    avatarUrl: HOST_PHOTO,
  },
  {
    author: "Mia Patel",
    location: "Berkeley, CA",
    rating: 5,
    date: "December 2025",
    stayDuration: "2 nights",
    text: "Great guest! Alex checked in and out smoothly, kept the home tidy, and was a pleasure to host. Highly recommend.",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face",
  },
  {
    author: "Jordan Park",
    location: "Malibu, CA",
    rating: 5,
    date: "November 2025",
    stayDuration: "4 nights",
    text: "Alex was respectful of the space and very easy to communicate with. Would absolutely host again.",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
  },
];

function getProfile(id: string): SellerProfile | BuyerProfile | null {
  if (id === "seller-1" || id === "host-1") {
    const allListings = getListingsByCategory("economy").slice(0, 4);
    const reviews = getListingReviews("e1");
    return {
      type: "seller",
      id,
      name: "Jamie Rivera",
      photo: HOST_PHOTO,
      bio: "San Francisco local who loves sharing my home with travelers from around the world. I'm a designer by day and a home chef on weekends.\n\nI take pride in keeping my spaces clean, well-stocked, and exactly as described. I'm always available if you have any questions, and I love giving local recommendations.",
      location: "San Francisco, CA",
      memberSince: "2023",
      yearsHosting: 6,
      listings: allListings,
      reviews,
      reviewCount: 52,
      rating: 4.91,
    } satisfies SellerProfile;
  }

  if (id === "buyer-1" || id === "guest-1") {
    return {
      type: "buyer",
      id,
      firstName: "Alex",
      lastName: "Chen",
      photo: BUYER_PHOTO,
      location: "San Francisco, CA",
      languages: ["English", "Mandarin"],
      about:
        "Travel enthusiast who loves discovering new places and meeting new people. Avid hiker and foodie always looking for hidden gems.\n\nI treat every rental like my own home — always leaving things as I found them.",
      memberSince: "2024",
      reviews: BUYER_REVIEWS,
      reviewCount: 3,
      rating: 5.0,
    } satisfies BuyerProfile;
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) return { title: "Profile not found" };
  const name =
    profile.type === "seller"
      ? profile.name
      : `${profile.firstName} ${profile.lastName}`;
  return {
    title: `${name} · Rento`,
    description:
      profile.type === "seller"
        ? `View ${name}'s host profile, listings, and reviews on Rento.`
        : `View ${name}'s guest profile on Rento.`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) notFound();

  return <PublicProfile profile={profile} />;
}
