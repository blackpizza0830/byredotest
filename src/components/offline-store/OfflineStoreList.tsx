"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Store {
  id: string;
  slug: string;
  image: string;
  title: string;
  description: string;
}

const STORES: Store[] = [
  {
    id: "1",
    slug: "seoul-gangnam",
    image: "/assets/offline/1.png",
    title: "Shop Titel",
    description: "DISCRIPTION DISCRIPTIONDISCRIPTIONDISCRIPTIONDI\nSCRIPTION",
  },
  {
    id: "2",
    slug: "seoul-itaewon",
    image: "/assets/offline/2.png",
    title: "Shop Titel",
    description: "DISCRIPTION DISCRIPTIONDISCRIPTIONDISCRIPTIONDI\nSCRIPTION",
  },
  {
    id: "3",
    slug: "busan",
    image: "/assets/offline/3.jpg",
    title: "Shop Titel",
    description: "DISCRIPTION DISCRIPTIONDISCRIPTIONDISCRIPTIONDI\nSCRIPTION",
  },
  {
    id: "4",
    slug: "jeju",
    image: "/assets/offline/4.png",
    title: "Shop Titel",
    description: "DISCRIPTION DISCRIPTIONDISCRIPTIONDISCRIPTIONDI\nSCRIPTION",
  },
  {
    id: "5",
    slug: "daegu",
    image: "/assets/offline/5.jpg",
    title: "Shop Titel",
    description: "DISCRIPTION DISCRIPTIONDISCRIPTIONDISCRIPTIONDI\nSCRIPTION",
  },
  {
    id: "6",
    slug: "incheon",
    image: "/assets/offline/6.png",
    title: "Shop Titel",
    description: "DISCRIPTION DISCRIPTIONDISCRIPTIONDISCRIPTIONDI\nSCRIPTION",
  },
];

export function OfflineStoreList(): React.JSX.Element {
  const outerRef = useRef<HTMLDivElement>(null);  // 스크롤 공간을 만드는 외부 컨테이너
  const stickyRef = useRef<HTMLDivElement>(null); // sticky 고정 패널
  const trackRef = useRef<HTMLDivElement>(null);  // translateX 로 이동하는 트랙
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    // 트랙 전체 너비 − 뷰포트 너비 = 가로로 이동해야 할 총 거리
    const totalSlide = track.scrollWidth - window.innerWidth;

    // outer div 높이를 "100vh + totalSlide" 로 설정
    // → 세로 스크롤 공간이 totalSlide 만큼 추가 확보됨
    outer.style.height = `calc(100vh + ${totalSlide}px)`;

    const onScroll = (): void => {
      const rect = outer.getBoundingClientRect();
      // outer 상단이 viewport 상단을 얼마나 지나쳤는지 (0 ~ totalSlide)
      const scrolled = Math.max(0, Math.min(-rect.top, totalSlide));
      const progress = totalSlide > 0 ? scrolled / totalSlide : 0;

      // 트랙을 왼쪽으로 이동
      track.style.transform = `translateX(${-scrolled}px)`;

      // 카운터 업데이트
      const idx = Math.round(progress * (STORES.length - 1)) + 1;
      setCurrentIndex(Math.min(Math.max(idx, 1), STORES.length));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // 리사이즈 시 totalSlide 재계산
    const onResize = (): void => {
      const newTotal = track.scrollWidth - window.innerWidth;
      outer.style.height = `calc(100vh + ${newTotal}px)`;
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    /*
     * ┌─ outer (스크롤 공간 확보 — height: 100vh + totalSlide) ──────┐
     * │  ┌─ sticky (position: sticky; top: 0; height: 100vh) ──────┐ │
     * │  │  ┌─ clipper (overflow: hidden) ──────────────────────┐  │ │
     * │  │  │  ┌─ track (translateX) ────────────────────────┐  │  │ │
     * │  │  │  │  card × 6                                   │  │  │ │
     * │  │  │  └────────────────────────────────────────────┘  │  │ │
     * │  │  └───────────────────────────────────────────────────┘  │ │
     * │  │  bottom bar (absolute)                                   │ │
     * │  └──────────────────────────────────────────────────────────┘ │
     * └───────────────────────────────────────────────────────────────┘
     */
    <div ref={outerRef} className="relative w-full">
      {/* sticky 고정 패널 */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* 카드가 담긴 가로 트랙 — will-change로 GPU 합성 레이어 */}
        <div
          className="flex h-full items-center"
          style={{ height: "100vh" }}
        >
          <div
            ref={trackRef}
            className="flex gap-5 will-change-transform shrink-0"
            style={{
              paddingLeft: "40px",
              paddingRight: "120px",
              width: "max-content",
            }}
          >
            {STORES.map((store) => (
              <Link
                key={store.id}
                href={`/offline-store/${store.slug}`}
                className="shrink-0 flex flex-col gap-[21px] group"
                style={{ width: "350px" }}
              >
                {/* 정사각형 썸네일 */}
                <div
                  className="relative overflow-hidden bg-[#e3e3e3]"
                  style={{ width: "350px", height: "350px" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={store.image}
                    alt={store.title}
                    className="absolute inset-0 w-full h-full object-cover
                               transition-transform duration-700 ease-out
                               group-hover:scale-[1.06]"
                  />
                </div>

                {/* 타이틀 */}
                <p className="font-bold text-[18px] text-black tracking-[0.18px] whitespace-nowrap">
                  {store.title}
                </p>

                {/* 태그 뱃지 */}
                <div className="flex gap-2 flex-wrap">
                  {["Flagship", "Consultation", "Events"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-[3px] text-[10px] tracking-[0.1em] uppercase
                                 border border-black/20 text-black/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 설명 */}
                <p className="font-normal text-[12px] text-black tracking-[0.12px] leading-[16.5px]">
                  {store.description.split("\n").map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* 하단 바 */}
        <div className="absolute bottom-10 left-0 right-0 flex items-center justify-between px-10 pointer-events-none">
          <p className="font-bold text-[26px] text-black tracking-[0.26px]">
            (SCROLL)
          </p>
          <p className="font-bold text-[26px] text-black tracking-[0.26px]">
            STORE {String(currentIndex).padStart(2, "0")}
          </p>
        </div>
      </div>
    </div>
  );
}
