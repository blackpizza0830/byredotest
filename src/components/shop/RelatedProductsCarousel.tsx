"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelatedProduct {
  id: string;
  category: string;
  name: string;
  price: string;
  size: string;
  slug: string;
  image: string;
}

const RELATED_PRODUCTS: RelatedProduct[] = [
  {
    id: "1",
    category: "HAIR PERFUME",
    name: "Blanche Hair Perfume",
    price: "₩85,000",
    size: "75 ml",
    slug: "blanche-hair-perfume",
    image: "/images/shop_1.png",
  },
  {
    id: "2",
    category: "BODY",
    name: "Blanche Hand Cream",
    price: "₩65,000",
    size: "30 ml",
    slug: "blanche-hand-cream",
    image: "/images/shop_2.png",
  },
  {
    id: "3",
    category: "BODY",
    name: "Blanche Hand Cleanser",
    price: "₩55,000",
    size: "30 ml",
    slug: "blanche-hand-cleanser",
    image: "/images/shop_3.png",
  },
  {
    id: "4",
    category: "BODY",
    name: "Blanche Body Cream",
    price: "₩120,000",
    size: "200 ml",
    slug: "blanche-body-cream",
    image: "/images/shop_4.png",
  },
  {
    id: "5",
    category: "CANDLE",
    name: "Coin Laundry Candle",
    price: "₩180,000",
    size: "240 g",
    slug: "coin-laundry-candle",
    image: "/images/shop_5.png",
  },
  {
    id: "6",
    category: "READY-TO-WEAR",
    name: "BYR Sleep Set",
    price: "₩450,000",
    size: "S / M / L",
    slug: "byr-sleep-set",
    image: "/images/shop_6.png",
  },
  {
    id: "7",
    category: "GIFT SET",
    name: "Blanche Travel Set",
    price: "₩230,000",
    size: "50 ml + Travel Case",
    slug: "blanche-travel-set",
    image: "/images/shop_7.png",
  },
  {
    id: "8",
    category: "BODY",
    name: "Blanche Body Mist",
    price: "₩95,000",
    size: "150 ml",
    slug: "blanche-body-mist",
    image: "/images/shop_8.png",
  },
];

const VISIBLE = 3;
const TOTAL = RELATED_PRODUCTS.length;
const MAX_INDEX = TOTAL - VISIBLE;

export function RelatedProductsCarousel(): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 섹션 진입 시 아래→위 fade-in
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const prev = (): void => setIndex((i) => Math.max(0, i - 1));
  const next = (): void => setIndex((i) => Math.min(MAX_INDEX, i + 1));

  // translateX 계산:
  // 트랙 전체 width = TOTAL/VISIBLE * 100% of container
  // 1칸 이동 = container_width / VISIBLE = (100/VISIBLE)% of container
  // 트랙 기준 % = (1/TOTAL) * 100%
  // translateX(-index * (100/TOTAL)%) — 트랙 자신의 width 기준
  const translatePct = index * (100 / TOTAL);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "py-20 px-10 transition-all duration-700 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}
    >
      {/* 헤더 */}
      <div className="flex items-end justify-between mb-10">
        <h2 className="text-[11px] tracking-[2.2px] uppercase text-black font-medium">
          Related Products
        </h2>

        {/* 화살표 */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label="이전"
            className={cn(
              "w-9 h-9 border flex items-center justify-center transition-all duration-200",
              index === 0
                ? "border-black/20 text-black/20 cursor-not-allowed"
                : "border-black text-black hover:bg-black hover:text-white"
            )}
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index >= MAX_INDEX}
            aria-label="다음"
            className={cn(
              "w-9 h-9 border flex items-center justify-center transition-all duration-200",
              index >= MAX_INDEX
                ? "border-black/20 text-black/20 cursor-not-allowed"
                : "border-black text-black hover:bg-black hover:text-white"
            )}
          >
            <ChevronRight size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* 캐러셀 */}
      <div className="overflow-hidden">
        <div
          className="grid transition-transform duration-500 ease-out"
          style={{
            // 트랙 너비 = TOTAL/VISIBLE 배
            gridTemplateColumns: `repeat(${TOTAL}, calc(100% / ${VISIBLE}))`,
            transform: `translateX(-${translatePct}%)`,
          }}
        >
          {RELATED_PRODUCTS.map((product) => (
            <div key={product.id} className="px-[10px]">
              <div className="group flex flex-col">
                {/* 이미지 */}
                <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
                  <Link
                    href={`/shop/${product.slug}`}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="33vw"
                    />
                  </Link>
                </div>

                {/* 텍스트 정보 */}
                <div className="pt-3 flex flex-col gap-[3px]">
                  <p className="text-[10px] tracking-[0.12em] uppercase text-black/50 leading-none">
                    {product.category}
                  </p>
                  <Link href={`/shop/${product.slug}`}>
                    <p className="text-[11px] tracking-[0.08em] uppercase text-black font-medium leading-snug mt-[2px] hover:opacity-60 transition-opacity">
                      {product.name}
                    </p>
                  </Link>
                  <p className="text-[11px] text-black leading-none mt-[2px]">
                    {product.price}
                  </p>
                  <p className="text-[10px] text-black/40 leading-none">
                    {product.size}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 페이지 인디케이터 */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: MAX_INDEX + 1 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${i + 1}번째 슬라이드`}
            className={cn(
              "h-[2px] transition-all duration-300",
              i === index ? "w-6 bg-black" : "w-3 bg-black/25"
            )}
          />
        ))}
      </div>
    </section>
  );
}
