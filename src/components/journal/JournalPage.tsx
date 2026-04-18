'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GalleryImage {
  src: string;
  title: string;
  subtitle: string;
}

interface Position {
  top: number;
  left: number;
  width: number;
}

type HoveredItem = { title: string; subtitle: string } | null;

// ─── Data ─────────────────────────────────────────────────────────────────────

const galleryImages: GalleryImage[] = [
  { src: '/images/shop_1.png', title: 'Oud Immortel',    subtitle: 'Fragrance Story'  },
  { src: '/images/shop_2.png', title: 'Rose Noir',       subtitle: 'Inspiration'      },
  { src: '/images/shop_3.png', title: "Bal d'Afrique",   subtitle: 'Behind the Scent' },
  { src: '/images/shop_4.png', title: 'Blanche',         subtitle: 'Collection'       },
  { src: '/images/shop_5.png', title: 'Sundazed',        subtitle: 'Summer Edit'      },
  { src: '/images/shop_6.png', title: 'De Los Santos',   subtitle: 'Craft & Detail'   },
  { src: '/images/shop_7.png', title: 'Super Cedar',     subtitle: 'Dry Woods'        },
  { src: '/images/shop_8.png', title: 'Mojave Ghost',    subtitle: 'Desert Notes'     },
  { src: '/images/shop_1.png', title: 'Bibliothèque',    subtitle: 'Literary Muse'    },
  { src: '/images/shop_2.png', title: 'M/Mink',          subtitle: 'Mineral Accord'   },
  { src: '/images/shop_3.png', title: 'Slow Dance',      subtitle: 'Evening Ritual'   },
  { src: '/images/shop_4.png', title: 'Mixed Emotions',  subtitle: 'The Process'      },
  { src: '/images/shop_5.png', title: 'Oud Immortel',    subtitle: 'Fragrance Story'  },
  { src: '/images/shop_6.png', title: 'Rose Noir',       subtitle: 'Inspiration'      },
  { src: '/images/shop_7.png', title: "Bal d'Afrique",   subtitle: 'Behind the Scent' },
  { src: '/images/shop_8.png', title: 'Blanche',         subtitle: 'Collection'       },
  { src: '/images/shop_1.png', title: 'Sundazed',        subtitle: 'Summer Edit'      },
  { src: '/images/shop_2.png', title: 'De Los Santos',   subtitle: 'Craft & Detail'   },
  { src: '/images/shop_3.png', title: 'Super Cedar',     subtitle: 'Dry Woods'        },
  { src: '/images/shop_4.png', title: 'Mojave Ghost',    subtitle: 'Desert Notes'     },
  { src: '/images/shop_5.png', title: 'Bibliothèque',    subtitle: 'Literary Muse'    },
  { src: '/images/shop_6.png', title: 'M/Mink',          subtitle: 'Mineral Accord'   },
  { src: '/images/shop_7.png', title: 'Slow Dance',      subtitle: 'Evening Ritual'   },
  { src: '/images/shop_8.png', title: 'Mixed Emotions',  subtitle: 'The Process'      },
];

const positions: Position[] = [
  // Row 1 — upper area
  { top: 120, left: 80,   width: 280 },
  { top: 55,  left: 460,  width: 220 },
  { top: 175, left: 840,  width: 300 },
  { top: 75,  left: 1240, width: 250 },
  { top: 155, left: 1610, width: 270 },
  { top: 65,  left: 1990, width: 230 },
  { top: 185, left: 2310, width: 290 },
  { top: 95,  left: 2570, width: 200 },
  // Row 2 — middle area
  { top: 545, left: 55,   width: 260 },
  { top: 490, left: 410,  width: 240 },
  { top: 580, left: 790,  width: 310 },
  { top: 510, left: 1165, width: 280 },
  { top: 565, left: 1550, width: 250 },
  { top: 495, left: 1895, width: 270 },
  { top: 555, left: 2255, width: 220 },
  { top: 585, left: 2530, width: 300 },
  // Row 3 — lower area
  { top: 985,  left: 145,  width: 270 },
  { top: 1025, left: 505,  width: 250 },
  { top: 975,  left: 885,  width: 290 },
  { top: 1015, left: 1275, width: 240 },
  { top: 985,  left: 1645, width: 280 },
  { top: 1055, left: 2010, width: 260 },
  { top: 975,  left: 2310, width: 230 },
  { top: 1015, left: 2590, width: 280 },
];

const rotations = [
  -6, 3, -4, 5, -3, 4, -5, 2, -4, 3, -2, 6,
  -5, 3, -4, 5, -3, 4, -5, 2, -4, 3, -2, 6,
];

// ─── Component ────────────────────────────────────────────────────────────────

export function JournalPage(): React.JSX.Element {
  const [hoveredItem, setHoveredItem] = useState<HoveredItem>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);

  const mousePos   = useRef({ x: 0.5, y: 0.5 });
  const currentPos = useRef({ x: 0.5, y: 0.5 });
  const rafRef     = useRef<number>(0);

  useEffect(() => {
    const track     = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    // ── GSAP opening animation ───────────────────────────────────────────────
    const ctx = gsap.context(() => {
      const galleryItems = track.querySelectorAll<HTMLElement>('.gallery-item');
      const trackCenterX = track.offsetWidth  / 2;
      const trackCenterY = track.offsetHeight / 2;

      galleryItems.forEach((el, index) => {
        const rect        = el.getBoundingClientRect();
        const itemCenterX = el.offsetLeft + rect.width  / 2;
        const itemCenterY = el.offsetTop  + rect.height / 2;

        gsap.set(el, {
          x:        trackCenterX - itemCenterX,
          y:        trackCenterY - itemCenterY,
          scale:    0.3,
          rotation: rotations[index % rotations.length],
          opacity:  1,
        });
      });

      gsap.to(galleryItems, {
        x:        0,
        y:        0,
        scale:    1,
        rotation: 0,
        duration: 1.0,
        ease:     'power2.out',
        delay:    0.15,
      });

      const fadeElements = container.querySelectorAll('.fade-in');
      gsap.fromTo(
        fadeElements,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.6 }
      );
    }, container);

    // ── Mouse move handler ───────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent): void => {
      mousePos.current.x = e.clientX / window.innerWidth;
      mousePos.current.y = e.clientY / window.innerHeight;
    };

    // ── RAF lerp loop ────────────────────────────────────────────────────────
    const animate = (): void => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.06;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.06;

      const trackWidth  = track.scrollWidth  - window.innerWidth;
      const trackHeight = track.scrollHeight - window.innerHeight;
      const translateX  = -currentPos.current.x * trackWidth;
      const translateY  = -currentPos.current.y * trackHeight;

      track.style.transform = `translate(${translateX}px, ${translateY}px)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return (): void => {
      ctx.revert();
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen overflow-hidden bg-[#f8f7f5]"
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header
        className="fade-in fixed top-0 z-50 w-full flex items-center justify-between px-8 py-6"
        style={{ opacity: 0 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#231f20] hover:opacity-50 transition-opacity duration-200"
        >
          <span className="text-base leading-none">←</span>
          <span>Back</span>
        </Link>

        <span className="text-[11px] tracking-[0.15em] uppercase text-[#231f20]">
          Collection
        </span>

        <span className="text-[11px] tracking-[0.15em] uppercase text-[#231f20]/40">
          12 Items
        </span>
      </header>

      {/* ── Center text ──────────────────────────────────────────────────── */}
      <div
        className="fade-in fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 text-center"
        style={{ opacity: 0 }}
      >
        <p
          className="font-medium leading-none tracking-[-0.04em] transition-colors duration-300"
          style={{
            fontSize: '86px',
            color: hoveredItem ? '#231f20' : 'rgba(35,31,32,0.10)',
          }}
        >
          {hoveredItem ? hoveredItem.title : 'Explore'}
        </p>

        <p
          className="mt-3 text-[14px] tracking-[0.15em] uppercase transition-all duration-300"
          style={{ color: hoveredItem ? 'rgba(35,31,32,0.55)' : 'rgba(35,31,32,0.20)' }}
        >
          {hoveredItem ? hoveredItem.subtitle : 'Hover to discover'}
        </p>
      </div>

      {/* ── Gallery track ────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        className="absolute will-change-transform"
        style={{ width: 2800, height: 2200, padding: 80 }}
      >
        {galleryImages.map((image, index) => {
          const pos = positions[index % 24];
          return (
            <div
              key={index}
              className="gallery-item group absolute cursor-pointer"
              style={{ top: pos.top, left: pos.left, width: pos.width }}
              onMouseEnter={() =>
                setHoveredItem({ title: image.title, subtitle: image.subtitle })
              }
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                className="relative w-full bg-[#e8e6e3]"
                style={{ paddingBottom: '100%' }}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={`${pos.width}px`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom: mouse hint (center) ───────────────────────────────────── */}
      <p
        className="fade-in fixed bottom-7 left-1/2 -translate-x-1/2 z-50 text-[10px] tracking-[0.25em] uppercase text-[#231f20]/25 pointer-events-none"
        style={{ opacity: 0 }}
      >
        Move mouse to explore
      </p>

      {/* ── Bottom: copyright (right) ────────────────────────────────────── */}
      <p
        className="fade-in fixed bottom-7 right-8 z-50 text-[10px] tracking-[0.15em] uppercase text-[#231f20]/25 pointer-events-none"
        style={{ opacity: 0 }}
      >
        © 2025 Byredo
      </p>
    </div>
  );
}
