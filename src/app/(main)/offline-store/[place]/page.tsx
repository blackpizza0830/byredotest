import type { Metadata } from "next";
import { StoreDetail } from "@/components/offline-store/StoreDetail";

interface PlacePageProps {
  params: {
    place: string;
  };
}

export async function generateMetadata({
  params,
}: PlacePageProps): Promise<Metadata> {
  const placeName = decodeURIComponent(params.place)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${placeName} Store`,
    description: `Visit Byredo ${placeName} store for an immersive brand experience.`,
  };
}

export default function PlacePage({
  params,
}: PlacePageProps): React.JSX.Element {
  const placeName = decodeURIComponent(params.place)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="w-full bg-white pt-[60px]">
      <StoreDetail placeName={placeName} placeSlug={params.place} />
    </div>
  );
}
