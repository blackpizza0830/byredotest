"use client";

/**
 * Figma node 0:857 — Hero section (1440 × 900 px)
 *
 * Left  panel: images slide upward   (current → exit top,  next → enter bottom)
 * Right panel: images slide downward (current → exit bottom, next → enter top)
 *
 * Image sets (index 0 = main1/main_1, 1 = main_2, 2 = main_3):
 *   Left:  main1_1.png  · main_2_1.png · main_3_1.png
 *   Right: main_1_2.png · main_2_2.png · main_3_2.png
 */

import { useEffect, useRef, useState } from "react";

const LEFT_IMAGES = [
  { src: "/assets/main/main1_1.png", alt: "La Collection 1" },
  { src: "/assets/main/main_2_1.png", alt: "La Collection 2" },
  { src: "/assets/main/main_3_1.png", alt: "La Collection 3" },
];

const RIGHT_IMAGES = [
  { src: "/assets/main/main_1_2.png", alt: "La Maison 1" },
  { src: "/assets/main/main_2_2.png", alt: "La Maison 2" },
  { src: "/assets/main/main_3_2.png", alt: "La Maison 3" },
];

const SLIDE_INTERVAL_MS = 3000;
const TRANSITION_MS = 800;

type SlideState = "idle" | "exiting" | "entering";

function useCarousel(total: number): {
  current: number;
  next: number;
  state: SlideState;
} {
  const [current, setCurrent] = useState<number>(0);
  const [next, setNext] = useState<number>(1);
  const [state, setState] = useState<SlideState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const advance = (): void => {
      const nextIdx = (current + 1) % total;
      setNext(nextIdx);
      setState("exiting");

      timer.current = setTimeout(() => {
        setCurrent(nextIdx);
        setState("idle");
      }, TRANSITION_MS);
    };

    const interval = setInterval(advance, SLIDE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [current, total]);

  return { current, next, state };
}

interface PanelSlide {
  src: string;
  alt: string;
}

interface SlidePanelProps {
  images: PanelSlide[];
  current: number;
  next: number;
  state: SlideState;
  /** "up" → current exits top / next enters bottom; "down" → opposite */
  direction: "up" | "down";
  label: string;
  labelSide: "left" | "right";
}

function SlidePanel({
  images,
  current,
  next,
  state,
  direction,
  label,
  labelSide,
}: SlidePanelProps): React.JSX.Element {
  const exitTranslate = direction === "up" ? "-100%" : "100%";
  const enterStart = direction === "up" ? "100%" : "-100%";

  const currentTranslate =
    state === "exiting" ? exitTranslate : "0%";
  const nextTranslate = state === "exiting" ? "0%" : enterStart;

  const transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`;

  return (
    <div className="relative w-1/2 h-full overflow-hidden">
      {/* Current image */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${currentTranslate})`,
          transition: state === "exiting" ? transition : "none",
          willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[current].src}
          alt={images[current].alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Next image (pre-positioned, slides in during exiting) */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translateY(${nextTranslate})`,
          transition: state === "exiting" ? transition : "none",
          willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[next].src}
          alt={images[next].alt}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Label */}
      <span
        className="absolute text-white text-[16px] font-normal z-10 select-none"
        style={
          labelSide === "left"
            ? { left: "9px", top: "50%" }
            : { right: "19px", top: "50%" }
        }
      >
        {label}
      </span>
    </div>
  );
}

export function HeroSection(): React.JSX.Element {
  const { current, next, state } = useCarousel(LEFT_IMAGES.length);

  return (
    <section
      className="relative w-full flex overflow-hidden"
      style={{ height: "100svh", minHeight: "600px" }}
    >
      {/* Left half — slides upward */}
      <SlidePanel
        images={LEFT_IMAGES}
        current={current}
        next={next}
        state={state}
        direction="up"
        label="LA COLLECTION"
        labelSide="left"
      />

      {/* Right half — slides downward */}
      <SlidePanel
        images={RIGHT_IMAGES}
        current={current}
        next={next}
        state={state}
        direction="down"
        label="LA MASION"
        labelSide="right"
      />

      {/* Center overlay — node 0:862-864 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <p
          className="text-white leading-none select-none drop-shadow-sm"
          style={{ fontSize: "clamp(18px, 1.8vw, 26px)" }}
        >
          <span className="font-bold">BYREDO </span>
          <span className="font-normal">PARFUMS</span>
        </p>
      </div>
    </section>
  );
}
