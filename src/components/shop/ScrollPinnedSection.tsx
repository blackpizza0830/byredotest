"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollPinnedSectionProps {
  children: React.ReactNode;
}

/** 스크롤 진행률 0-1 을 6등분한 단계 0-5 */
function toStage(progress: number): number {
  return Math.min(5, Math.floor(progress * 6));
}

export function ScrollPinnedSection({
  children,
}: ScrollPinnedSectionProps): React.JSX.Element {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const handleScroll = (): void => {
      const track = trackRef.current;
      if (!track) return;

      const { top, height } = track.getBoundingClientRect();
      const scrollable = height - window.innerHeight;

      // top이 0보다 크면 아직 섹션에 도달하지 않은 것 → 0
      // top이 -scrollable 이하이면 섹션 끝 → 1
      const raw = scrollable > 0 ? -top / scrollable : 0;
      const clamped = Math.min(1, Math.max(0, raw));

      const nextStage = toStage(clamped);

      setProgress(clamped);
      setStage(nextStage);

      console.log(
        `[ScrollPin] progress: ${clamped.toFixed(4)}  stage: ${nextStage}`
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // 마운트 시 초기값 세팅
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /**
     * 외부 track — 스크롤 공간을 만들어 주는 긴 박스.
     * sticky 내부가 핀처럼 고정되어 화면이 멈춘 것처럼 보인다.
     */
    <div
      ref={trackRef}
      style={{ minHeight: "6000vh" }}
      className="relative"
      data-scroll-track
    >
      {/* 핀 컨테이너 — 뷰포트에 sticky 고정 */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 진행률 HUD (개발 확인용) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-black/70 text-white text-[11px] tracking-widest uppercase px-4 py-2 rounded-full pointer-events-none select-none">
          <span>progress: {progress.toFixed(3)}</span>
          <span className="opacity-40">|</span>
          <span>stage: {stage} / 5</span>
        </div>

        {/* 실제 콘텐츠 */}
        {children}
      </div>
    </div>
  );
}
