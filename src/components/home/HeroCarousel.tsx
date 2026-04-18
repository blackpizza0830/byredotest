"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  leftBg: string;
  rightBg: string;
  href: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Bal d'Afrique",
    subtitle: "An ode to Africa and a celebration of its influence on modern culture.",
    leftBg: "bg-[#E8E0D4]",
    rightBg: "bg-[#2C2A26]",
    href: "/shop/bal-d-afrique",
  },
  {
    id: 2,
    title: "Bibliothèque",
    subtitle: "The smell of knowledge — rich woods, iris and vanilla.",
    leftBg: "bg-[#D4D0C8]",
    rightBg: "bg-[#1A1814]",
    href: "/shop/bibliotheque",
  },
  {
    id: 3,
    title: "Gypsy Water",
    subtitle: "Pine needles, bergamot and fresh skin.",
    leftBg: "bg-[#C8D4D0]",
    rightBg: "bg-[#1E2826]",
    href: "/shop/gypsy-water",
  },
];

export function HeroCarousel(): React.JSX.Element {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback((): void => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = (): void => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 grid grid-cols-2"
        >
          <div className={cn("flex items-end pb-24 pl-12 md:pl-20", slide.leftBg)}>
            <div className="space-y-6">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-wider leading-tight"
              >
                {slide.title}
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="text-sm text-byredo-gray-600 max-w-xs leading-relaxed"
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Link
                  href={slide.href}
                  className="inline-block text-xs tracking-widest uppercase border-b border-current pb-0.5 hover:tracking-ultra transition-all duration-300"
                >
                  Discover
                </Link>
              </motion.div>
            </div>
          </div>

          <div className={cn("relative", slide.rightBg)} />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-10">
        <button onClick={prev} className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
          Prev
        </button>
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                i === current ? "bg-byredo-black w-6" : "bg-byredo-gray-300"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={next} className="text-xs tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity">
          Next
        </button>
      </div>

      <div className="absolute bottom-8 right-12 hidden md:flex flex-col items-center gap-2 text-byredo-gray-500 animate-bounce">
        <span className="text-[9px] tracking-widest uppercase rotate-90 origin-center">Scroll</span>
        <ChevronDown size={14} />
      </div>
    </section>
  );
}
