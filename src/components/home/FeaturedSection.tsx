"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Figma node 0:872 — Featured / Product section  (1420 × 566 px)
 *
 * Typography row (top=36px → 6.36% of 566px):
 *   "Text" left   87px  tracking-[-4.5px]  (node 0:874)
 *   "Text Link" + 20px square  center       (node 0:875–0:878)
 *   "Text" right  84px  tracking-[-4.5px]  (node 0:880)
 *
 * 4-column product grid (top=122px, h=434px per cell):
 *   Each cell: w=347.5/1420 = 24.47%,  aspect-ratio = 347.5/434 = 0.8:1
 *   node 0:881–0:884
 *
 * Section height: 566/1440 = 39.3vw
 */

interface Product {
  src: string;
  alt: string;
  href: string;
  name: string;
  price: string;
}

const PRODUCTS: Product[] = [
  { src: "/assets/main/main_2_1.png", alt: "Product 1", href: "/shop/product-1", name: "Blanche Hair Perfume", price: "₩230,000" },
  { src: "/assets/main/main_2_2.png", alt: "Product 2", href: "/shop/product-2", name: "Bal d'Afrique Eau de Parfum", price: "₩280,000" },
  { src: "/assets/main/main_3_1.png", alt: "Product 3", href: "/shop/product-3", name: "Gypsy Water Body Lotion", price: "₩195,000" },
  { src: "/assets/main/main_3_2.png", alt: "Product 4", href: "/shop/product-4", name: "Mojave Ghost Hand Cream", price: "₩175,000" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function FeaturedSection(): React.JSX.Element {
  return (
    <section
      className="relative w-full overflow-hidden px-[10px] mt-[120px]"
      style={{ paddingTop: "clamp(24px, 2.5vw, 36px)" }}
    >
      {/* ── Typography row ── */}
      <div className="relative w-full flex items-end justify-between mb-[2.14vw]"
        style={{ height: "clamp(40px, 6.04vw, 87px)" }}>

        {/* "Text" left — node 0:874 */}
        <span
          className="font-medium uppercase text-[#0a0a0a] leading-none select-none"
          style={{
            fontSize: "clamp(32px, 6.04vw, 87px)",
            letterSpacing: "-0.05em",
          }}
        >
          Text
        </span>

        {/* Center indicator — node 0:875-0:878 */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center gap-[5px]">
          <span className="text-[8px] font-normal uppercase text-[#0a0a0a] tracking-[0.2057px] whitespace-nowrap">
            Text Link
          </span>
          <div className="w-[20px] h-[20px] bg-[#231f20] shrink-0" />
        </div>

        {/* "Text" right — node 0:880 */}
        <span
          className="font-medium uppercase text-[#0a0a0a] leading-none select-none text-right"
          style={{
            fontSize: "clamp(30px, 5.83vw, 84px)",
            letterSpacing: "-0.05em",
          }}
        >
          Text
        </span>
      </div>

      {/* ── 4-column product grid — node 0:881-0:884 ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 w-full">
        {PRODUCTS.map((product, i) => (
          <motion.div
            key={product.src}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <Link href={product.href} className="group block relative">
              <div
                className="relative w-full overflow-hidden bg-[#e3e3e3]"
                style={{ aspectRatio: "347.5 / 434" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.src}
                  alt={product.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover overlay — name + price slide up from bottom-left */}
                <div className="absolute bottom-0 left-0 right-0 p-[14px] pointer-events-none">
                  <div className="flex flex-col gap-[4px] opacity-0 translate-y-[10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                    <span className="text-[10px] tracking-[0.15em] uppercase text-black leading-none">
                      {product.name}
                    </span>
                    <span className="text-[10px] tracking-[0.1em] text-black leading-none">
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
