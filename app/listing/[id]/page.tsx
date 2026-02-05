import { notFound } from "next/navigation";
import { getListingById } from "@/lib/vehicle-listings";
import { ListingDetail } from "@/components/listing/listing-detail";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: "Listing not found" };
  return {
    title: listing.title,
    description: listing.description ?? `Rent ${listing.title} - $${listing.pricePerDay}/day`,
  };
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  return <ListingDetail listing={listing} id={id} />;
}
