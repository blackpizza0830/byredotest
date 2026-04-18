"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getSupabaseClient } from "@/lib/supabase";

interface ProductRow {
  id: string;
  category: string;
  name: string;
  price: number;
  size: string;
  slug: string;
  image_url: string;
  is_active: boolean;
}

interface ShopGridProps {
  activeFilter?: string;
}

export function ShopGrid({ activeFilter = "ALL" }: ShopGridProps): React.JSX.Element {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>("");

  useEffect(() => {
    const supabase = getSupabaseClient();

    const loadProducts = async (): Promise<void> => {
      setLoadError("");
      setIsLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("id,category,name,price,size,slug,image_url,is_active")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        setLoadError(error.message);
        setIsLoading(false);
        return;
      }

      setProducts(toProductRows(data));
      setIsLoading(false);
    };

    void loadProducts();

    const channel = supabase
      .channel("shop-products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          void loadProducts();
        }
      )
      .subscribe();

    return (): void => {
      void supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(
    () =>
      activeFilter === "ALL"
        ? products
        : products.filter((product) =>
            product.category.toLowerCase().includes(activeFilter.toLowerCase())
          ),
    [activeFilter, products]
  );

  if (isLoading) {
    return (
      <p className="py-24 text-center text-[11px] tracking-widest uppercase text-black/40">
        Loading products...
      </p>
    );
  }

  if (loadError) {
    return (
      <p className="py-24 text-center text-[11px] tracking-widest uppercase text-black/40">
        {loadError}
      </p>
    );
  }

  return (
    <>
      {filtered.length === 0 ? (
        <p className="text-center text-[11px] tracking-widest uppercase text-black/40 py-24">
          No results found
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[10px] gap-y-8">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: "easeOut" }}
              className="group flex flex-col"
            >
              {/* Image area — overlay actions above the product link */}
              <div className="relative aspect-square overflow-hidden bg-white">
                <Link
                  href={`/shop/${product.slug}`}
                  className="absolute inset-0 z-0 block overflow-hidden"
                >
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </Link>
                {/* Try first — flush top-left (ref: PROBIEREN SIE ES ZUERST) */}
                <button
                  type="button"
                  className="absolute top-0 left-0 z-20 max-w-[5.75rem] pl-[2px] pt-[2px] text-left text-[9px] leading-[1.2] tracking-[0.14em] uppercase text-black/60 hover:text-black transition-colors duration-200"
                  onClick={(e) => e.preventDefault()}
                >
                  Try first
                </button>
                {/* Shopping bag — top-right (ref Byredo product tile) */}
                <button
                  type="button"
                  aria-label="장바구니에 담기"
                  className="absolute top-[10px] right-[10px] z-20 p-0 opacity-70 hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => e.preventDefault()}
                >
                  <Image
                    src="/images/cart.png"
                    alt=""
                    width={41}
                    height={41}
                    className="object-contain"
                  />
                </button>
              </div>

              {/* Product info — bookmark top-right of this block */}
              <div className="relative pt-3 pr-7 flex flex-col gap-[3px] flex-1">
                <span
                  className="absolute top-0 right-0 z-10 block"
                  aria-hidden="true"
                >
                  <Image
                    src="/images/mark.png"
                    alt=""
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </span>
                <p className="text-[10px] tracking-[0.12em] uppercase text-black/50 leading-none">
                  {product.category}
                </p>
                <Link href={`/shop/${product.slug}`}>
                  <p className="text-[11px] tracking-[0.08em] uppercase text-black font-medium leading-snug mt-[2px]">
                    {product.name}
                  </p>
                </Link>
                <p className="text-[11px] text-black leading-none mt-[2px]">
                  {formatKrw(product.price)}
                </p>
                <p className="text-[10px] text-black/40 leading-none">
                  {product.size}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
}

function toProductRows(value: unknown): ProductRow[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      const id = readString(item, "id");
      const category = readString(item, "category");
      const name = readString(item, "name");
      const price = readNumber(item, "price");
      const size = readString(item, "size");
      const slug = readString(item, "slug");
      const imageUrl = readString(item, "image_url");
      const isActive = readBoolean(item, "is_active");
      if (
        !id ||
        !category ||
        !name ||
        price === null ||
        !size ||
        !slug ||
        !imageUrl ||
        isActive === null
      ) {
        return null;
      }
      return {
        id,
        category,
        name,
        price,
        size,
        slug,
        image_url: imageUrl,
        is_active: isActive,
      };
    })
    .filter((item): item is ProductRow => item !== null);
}

function readString(value: unknown, key: string): string | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = Reflect.get(value, key);
  return typeof candidate === "string" ? candidate : null;
}

function readNumber(value: unknown, key: string): number | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = Reflect.get(value, key);
  if (typeof candidate === "number") {
    return candidate;
  }
  if (typeof candidate === "string" && candidate.trim().length > 0) {
    const parsed = Number(candidate);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readBoolean(value: unknown, key: string): boolean | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const candidate = Reflect.get(value, key);
  return typeof candidate === "boolean" ? candidate : null;
}

function formatKrw(amount: number): string {
  return `₩${Math.round(amount).toLocaleString()}`;
}
