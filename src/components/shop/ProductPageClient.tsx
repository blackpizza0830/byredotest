"use client";

import { useEffect, useRef, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductViewer3D } from "@/components/shop/ProductViewer3D";
import { Header } from "@/components/layout/Header";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { Toast } from "@/components/ui/Toast";
import { RelatedProductsCarousel } from "@/components/shop/RelatedProductsCarousel";

// ─────────────────────────────────────────────
// 단계별 콘텐츠 (0 = 구매 폼, 1~5 = 텍스트)
// ─────────────────────────────────────────────
interface StageContent {
  title: string;
  desc: string;
}

const STAGE_CONTENTS: StageContent[] = [
  {
    title: "CHAOTIC PASSION",
    desc: "A symphony of saffron and plum opens the composition, creating an intense and chaotic harmony. The vibrant top notes clash beautifully with the deeper undertones, setting the stage for a fragrance that refuses to be defined by convention.",
  },
  {
    title: "DEEP RED INTENSITY",
    desc: "The heart reveals a richness of praline and patchouli, unveiling a dark, sophisticated allure. This deep red intensity speaks of passion and mystery, wrapping the wearer in a luxurious veil that is both bold and intimately personal.",
  },
  {
    title: "UNVEILED ESSENCE",
    desc: "At its core lies a hidden strength of papyrus and oakmoss, grounding the initial chaos in an earthy warmth. This unveiled essence provides a sturdy foundation, balancing the wilder notes with a sense of timeless elegance.",
  },
  {
    title: "PURE CONCENTRATION",
    desc: "Crafted as an Extrait de Parfum, Rouge Chaotique offers a pure concentration of scent that lingers like a second soul. Its potency ensures that even a single drop leaves a lasting trail, evolving uniquely with your body's chemistry.",
  },
  {
    title: "THE FINAL NOTE",
    desc: "The journey concludes with a lasting impression of elegance and rebellion, captured within a single bottle. It is a fragrance for those who embrace their contradictions, leaving a final note that is as unforgettable as it is unpredictable.",
  },
];

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
interface ProductPageClientProps {
  productSlug: string;
  productName: string;
}

export function ProductPageClient({
  productSlug,
  productName: _productName,
}: ProductPageClientProps): React.JSX.Element {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 3D 카메라용 ref — 리렌더 없이 매 스크롤마다 업데이트
  const progressRef = useRef<number>(0);

  const [isFixed, setIsFixed] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [currentViewIndex, setCurrentViewIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isWishlisted = useWishlistStore((s) =>
    s.items.some((i) => i.slug === productSlug)
  );

  useEffect(() => {
    const handleScroll = (): void => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      const nextIsFixed = rect.top <= 0 && rect.bottom >= viewportHeight;
      const nextIsEnd = rect.bottom < viewportHeight;

      setIsFixed(nextIsFixed);
      setIsEnd(nextIsEnd);

      // 진행률: scrollRange = sectionHeight - viewportHeight, scrolled = -rect.top
      const scrollRange = sectionHeight - viewportHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollRange));

      // 3D 카메라용 ref 직접 업데이트
      progressRef.current = progress;

      setCurrentViewIndex(Math.min(5, Math.floor(progress * 6)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // ── Fixed 처리: top <= 0 이면 fixed, 섹션 끝나면 absolute bottom
  const contentPositionClass = isFixed
    ? "fixed top-0 left-0 right-0 z-[5] h-screen"
    : isEnd
    ? "absolute bottom-0 left-0 right-0 h-screen"
    : "absolute top-0 left-0 right-0 h-screen";

  return (
    <>
      {/* isPurchaseMode 헤더 — currentViewIndex > 0 일 때 z-[60]으로 기본 헤더 덮음 */}
      {currentViewIndex > 0 && (
        <Header isPurchaseMode onPurchase={handlePurchase} />
      )}

      {/* 600vh 스크롤 트랙 */}
      <div ref={sectionRef} style={{ minHeight: "600vh" }} className="relative">
        {/* 핀 컨테이너 */}
        <div className={contentPositionClass}>
          <div className="h-full grid grid-cols-1 lg:grid-cols-2">

            {/* ── 좌측: 3D 모델 */}
            <div className="h-full bg-[#ececec]">
              <ProductViewer3D
                productSlug={productSlug}
                progressRef={progressRef}
              />
            </div>

            {/* ── 우측: 텍스트 콘텐츠 */}
            <div className="relative bg-white h-full overflow-hidden">

              {/* 0단계 — 구매 폼 */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center px-[24%] ease-out",
                  currentViewIndex === 0
                    ? "opacity-100 translate-y-0 duration-300 delay-150 transition-all"
                    : "opacity-0 -translate-y-3 duration-150 delay-0 transition-all pointer-events-none"
                )}
              >
                <div className="w-full">
                  <h1 className="font-bold text-[26px] leading-[1.5] uppercase text-black mb-4">
                    ROUGE CHAOTIQUE
                  </h1>
                  <p className="font-normal text-[18px] leading-[1.8] uppercase text-black mb-8">
                    A chaotic and passionate fragrance, deep red and intense.
                    Saffron, Plum, Praline and Patchouli weave together in a dark,
                    sophisticated symphony.
                  </p>
                  {/* 가격 + 찜하기 */}
                  <div className="flex items-center justify-between mb-10">
                    <span className="font-bold text-[18px] uppercase text-black">
                      $280
                    </span>
                    <button
                      type="button"
                      onClick={handleWishlist}
                      aria-label={
                        isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                      }
                      className="flex items-center justify-center size-6 hover:opacity-60 transition-opacity"
                    >
                      <Heart
                        size={24}
                        strokeWidth={1.5}
                        className={cn(
                          "transition-all",
                          isWishlisted
                            ? "fill-black stroke-black"
                            : "stroke-black fill-none"
                        )}
                      />
                    </button>
                  </div>
                  {/* PURCHASE 버튼 */}
                  <button
                    type="button"
                    onClick={handlePurchase}
                    className="w-full h-[48px] bg-black text-white font-sans font-medium text-[11px] tracking-[2.2px] uppercase hover:bg-byredo-gray-700 transition-colors duration-300"
                  >
                    PURCHASE
                  </button>
                  <p className="text-[14px] text-gray-400 mt-3 tracking-wider">
                    Ref. BYR50ML
                  </p>
                </div>
              </div>

              {/* 1~5단계 — 타이틀 + 디스크립션만 (absolute로 겹쳐 배치) */}
              {STAGE_CONTENTS.map((content, idx) => {
                const stageIdx = idx + 1;
                const isActive = currentViewIndex === stageIdx;
                return (
                  <div
                    key={stageIdx}
                    className={cn(
                      "absolute inset-0 flex items-center px-[24%] ease-out",
                      isActive
                        ? "opacity-100 translate-y-0 duration-300 delay-150 transition-all"
                        : "opacity-0 translate-y-3 duration-150 delay-0 transition-all pointer-events-none"
                    )}
                  >
                    <div className="w-full">
                      <h2 className="font-bold text-[26px] leading-[1.5] uppercase text-black mb-8">
                        {content.title}
                      </h2>
                      <p className="font-normal text-[18px] leading-[1.8] uppercase text-black">
                        {content.desc}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* 인디케이터 — right-6 top-1/2, 현재 단계 bg-black scale-125 */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-2 rounded-full transition-all duration-300",
                      i === currentViewIndex
                        ? "bg-black scale-125"
                        : "bg-gray-300 scale-100"
                    )}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── 핀 구간이 끝난 뒤 자연스럽게 이어지는 하단 콘텐츠 */}
      <div className="border-t border-black/[0.06]">
        <RelatedProductsCarousel />
      </div>

      {toast !== null && <Toast message={toast} />}
    </>
  );
}
