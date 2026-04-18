import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { BrandTextSection } from "@/components/home/BrandTextSection";
import { CollectionSection } from "@/components/home/CollectionSection";
import { JournalSection } from "@/components/home/JournalSection";
import { ByredoSignature } from "@/components/home/ByredoSignature";

export const metadata: Metadata = {
  title: "Byredo — Luxury Perfumes & Accessories",
  description:
    "Discover Byredo's world of luxury perfumes, leather goods and accessories.",
};

export default function HomePage(): React.JSX.Element {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Section 1: Hero split */}
      <HeroSection />

      {/* Section 2: Typography header + 4-product grid */}
      <FeaturedSection />

      {/* Section 3: Brand description text */}
      <BrandTextSection />

      {/* Section 4: Collection divider + 4-col lifestyle grid */}
      <CollectionSection />

      {/* Section 5: Journal editorial */}
      <JournalSection />

      {/* Section 6: Large BYREDO signature */}
      <ByredoSignature />
    </div>
  );
}
