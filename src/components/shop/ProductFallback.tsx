import { cn } from "@/lib/utils";

interface ProductFallbackProps {
  productSlug: string;
}

const PRODUCT_BG_MAP: Record<string, string> = {
  "bal-d-afrique": "bg-[#E8E0D4]",
  bibliotheque: "bg-[#D4D0C8]",
  "gypsy-water": "bg-[#C8D4D0]",
  "mojave-ghost": "bg-[#E0DCD4]",
};

export function ProductFallback({
  productSlug,
}: ProductFallbackProps): React.JSX.Element {
  const bg = PRODUCT_BG_MAP[productSlug] ?? "bg-byredo-cream";

  return (
    <div
      className={cn(
        "h-full flex items-center justify-center",
        bg
      )}
    >
      <p className="text-[10px] tracking-widest uppercase text-byredo-gray-500">
        Image unavailable
      </p>
    </div>
  );
}
