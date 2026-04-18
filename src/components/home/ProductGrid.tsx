"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: string;
  slug: string;
  bg: string;
}

const FEATURED_PRODUCTS: Product[] = [
  { id: "1", name: "Bal d'Afrique", price: "₩280,000", slug: "bal-d-afrique", bg: "bg-[#E8E0D4]" },
  { id: "2", name: "Bibliothèque", price: "₩285,000", slug: "bibliotheque", bg: "bg-[#D4D0C8]" },
  { id: "3", name: "Gypsy Water", price: "₩270,000", slug: "gypsy-water", bg: "bg-[#C8D4D0]" },
  { id: "4", name: "Mojave Ghost", price: "₩290,000", slug: "mojave-ghost", bg: "bg-[#E0DCD4]" },
  { id: "5", name: "Sellier", price: "₩275,000", slug: "sellier", bg: "bg-[#D8D4C8]" },
  { id: "6", name: "Eleventh Hour", price: "₩295,000", slug: "eleventh-hour", bg: "bg-[#2C2A26]" },
  { id: "7", name: "Unnamed", price: "₩300,000", slug: "unnamed", bg: "bg-[#1A1814]" },
  { id: "8", name: "Black Saffron", price: "₩285,000", slug: "black-saffron", bg: "bg-[#1E2826]" },
];

export function ProductGrid(): React.JSX.Element {
  return (
    <section className="px-6 py-24 md:px-12">
      <div className="flex items-baseline justify-between mb-12">
        <h2 className="font-serif text-3xl md:text-4xl tracking-wider uppercase">
          Featured
        </h2>
        <Link
          href="/shop"
          className="text-xs tracking-widest uppercase border-b border-current pb-0.5 hover:tracking-ultra transition-all duration-300"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {FEATURED_PRODUCTS.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
          >
            <Link href={`/shop/${product.slug}`} className="group block">
              <div
                className={cn(
                  "relative aspect-[3/4] overflow-hidden",
                  product.bg
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-byredo-black/10">
                  <span className="text-[10px] tracking-widest uppercase text-byredo-white">
                    View
                  </span>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-xs tracking-wider uppercase truncate">{product.name}</p>
                <p className="text-xs text-byredo-gray-500">{product.price}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
