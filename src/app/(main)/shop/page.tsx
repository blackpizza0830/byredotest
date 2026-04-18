import type { Metadata } from "next";
import { ShopContent } from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the complete Byredo collection.",
};

export default function ShopPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="pt-[60px] px-[10px] border-b border-black/10">
        <div className="flex items-end justify-between py-8">
          <h1 className="text-[11px] tracking-[0.2em] uppercase text-black leading-none">
            Shop
          </h1>
          <p className="text-[10px] tracking-[0.1em] uppercase text-black/40 leading-none">
            8 products
          </p>
        </div>
      </div>

      {/* Shop grid section */}
      <section className="px-[10px] pt-8 pb-24">
        <ShopContent />
      </section>
    </div>
  );
}
