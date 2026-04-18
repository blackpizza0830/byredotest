"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { Toast } from "@/components/ui/Toast";

interface ProductActionsProps {
  productSlug: string;
}

const PRODUCT_PRICES: Record<string, string> = {
  "rouge-chaotique": "$280",
  "bal-d-afrique": "$280",
  bibliotheque: "$285",
  "gypsy-water": "$280",
  "mojave-ghost": "$280",
  default: "$280",
};

export function ProductActions({
  productSlug,
}: ProductActionsProps): React.JSX.Element {
  const [toast, setToast] = useState<string | null>(null);

  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) =>
    s.items.some((i) => i.slug === productSlug)
  );

  const price = PRODUCT_PRICES[productSlug] ?? PRODUCT_PRICES.default;

  const handlePurchase = (): void => {
    addToCart({ slug: productSlug, quantity: 1 });
    setToast("Added to cart");
    setTimeout(() => setToast(null), 3000);
  };

  const handleWishlist = (): void => {
    toggleWishlist({ slug: productSlug });
    setToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      {/* Price + Heart icon row */}
      <div className="flex items-center justify-between w-full mb-[40px]">
        <span className="font-bold text-[18px] uppercase leading-[1.8] text-black">
          {price}
        </span>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="flex items-center justify-center size-6 transition-opacity hover:opacity-60"
        >
          <Heart
            size={24}
            strokeWidth={1.5}
            className={cn(
              "transition-all",
              isWishlisted ? "fill-black stroke-black" : "stroke-black fill-none"
            )}
          />
        </button>
      </div>

      {/* Purchase button — black 48px, Inter Medium 11px, tracking 2.2px */}
      <button
        type="button"
        onClick={handlePurchase}
        className="w-full h-[48px] bg-black text-white font-sans font-medium text-[11px] tracking-[2.2px] uppercase hover:bg-byredo-gray-700 transition-colors duration-300"
      >
        PURCHASE
      </button>

      {toast !== null && <Toast message={toast} />}
    </>
  );
}
