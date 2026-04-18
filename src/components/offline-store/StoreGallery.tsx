import { cn } from "@/lib/utils";

interface StoreGalleryProps {
  placeSlug: string;
}

const BG_MAP: Record<string, string[]> = {
  "seoul-cheongdam": ["bg-[#E8E0D4]", "bg-[#D4D0C8]", "bg-[#2C2A26]"],
  "seoul-lotte-world-tower": ["bg-[#C8D4D0]", "bg-[#E0DCD4]", "bg-[#1A1814]"],
  default: ["bg-[#D8D4C8]", "bg-[#E4D0C8]", "bg-[#1E2826]"],
};

export function StoreGallery({
  placeSlug,
}: StoreGalleryProps): React.JSX.Element {
  const bgs = BG_MAP[placeSlug] ?? BG_MAP.default;

  return (
    <div className="grid grid-cols-3 h-[50vh]">
      {bgs.map((bg, i) => (
        <div key={i} className={cn("relative overflow-hidden", bg)} />
      ))}
    </div>
  );
}
