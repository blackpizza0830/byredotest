"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function buildGoogleMapsEmbedSrc(address: string): string {
  const q = encodeURIComponent(address);
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (key !== undefined && key.length > 0) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(
      key,
    )}&q=${q}&zoom=15`;
  }
  return `https://www.google.com/maps?q=${q}&hl=en&z=15&output=embed`;
}

/**
 * Figma node 23:32 — offline-store detail page
 * Canvas: 1440px  |  All positions: Figma top minus 60px header
 *
 * Key positions (from content top = 0):
 *   Title:             top 70px
 *   Description:       top 261px, left 10px, w 715px (49.65%)
 *   Google Map embed: top 531px, left calc(50%+6px), w calc(50%-6px), h 531px
 *   STORE ADRESS:      top 1014px, left 18px
 *   COPY ADRESS btn:   top 1018px, 10px left of gray box (50%+6px), anchor right edge
 *   Address:           top 1038px, left 18px
 *   Gallery start:     top 1209px
 *     Left img (57.29% w, aspect 825:864), marginLeft 10px
 *     Right img (calc(41.67%-14px) w, aspect 586:438), left calc(58.33%+4px)
 *   Right caption:     33px below right img, left calc(58.33%+11px)
 *   Left caption:      31px below left img, left 17px
 *   Store list:        marginTop 195px after gallery captions
 *   Signature footer:  marginTop 100px after store list
 */

const imgFrame47 =
  "https://www.figma.com/api/mcp/asset/23c4de96-2c45-4e35-956b-65e0804b8f51";
const imgFrame48 =
  "https://www.figma.com/api/mcp/asset/26db3fbf-e08f-4d6b-88ae-41bbee646c8d";

interface StoreDetailProps {
  placeName: string;
  placeSlug: string;
}

interface StoreInfo {
  heroTitle: string;
  description: string;
  address: string;
}

const STORE_INFO: Record<string, StoreInfo> = {
  default: {
    heroTitle: "LE BONG MACHE",
    description:
      "Sunt ab odit quasi reprehenderit. Dolores eius aliquid eveniet perferendis quasi dignissimos asperiores molestiae. Sed vitae quae consequatur illo quasi doloribus. Molestiae in accusantium tempore voluptatibus occaecati similique sint nam. Facere illo quis.",
    address: "7082 Frank Loop Simi Valley",
  },
};

const OTHER_STORES = [
  { city: "PARIS,FRANCE", name: "LEBONG MARCHE" },
  { city: "PARIS,FRANCE", name: "LEBONG MARCHE" },
  { city: "PARIS,FRANCE", name: "LEBONG MARCHE" },
  { city: "PARIS,FRANCE", name: "LEBONG MARCHE" },
  { city: "PARIS,FRANCE", name: "LEBONG MARCHE" },
  { city: "PARIS,FRANCE", name: "LEBONG MARCHE" },
];

export function StoreDetail({
  placeSlug,
}: StoreDetailProps): React.JSX.Element {
  const info = STORE_INFO[placeSlug] ?? STORE_INFO.default;
  const mapsEmbedSrc = useMemo(
    () => buildGoogleMapsEmbedSrc(info.address),
    [info.address],
  );
  const [copied, setCopied] = useState(false);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current !== null) {
        clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyAddress = (): void => {
    if (copyResetTimeoutRef.current !== null) {
      clearTimeout(copyResetTimeoutRef.current);
      copyResetTimeoutRef.current = null;
    }
    void navigator.clipboard.writeText(info.address).then(
      () => {
        setCopied(true);
        copyResetTimeoutRef.current = setTimeout(() => {
          setCopied(false);
          copyResetTimeoutRef.current = null;
        }, 1500);
      },
      () => {
        /* clipboard denied or unavailable — keep default label */
      },
    );
  };

  return (
    <div className="w-full bg-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          HERO + ADDRESS — combined relative block
          Height covers from content top (0) to gallery start (1209px).
          All child elements absolutely positioned within.
      ═══════════════════════════════════════════════════════ */}
      <div className="relative w-full" style={{ height: "1209px" }}>

        {/* ── Title ──────────────────────────────────────────
            Figma: top=130px → content top=70px
            font: 172px bold, leading=1, full width
        ─────────────────────────────────────────────────── */}
        <h1
          className="absolute font-bold text-black not-italic select-none overflow-hidden"
          style={{
            top: "70px",
            left: 0,
            right: 0,
            fontSize: "clamp(48px, 11.94vw, 172px)",
            lineHeight: "1",
            whiteSpace: "nowrap",
          }}
        >
          {info.heroTitle}
        </h1>

        {/* ── Description ────────────────────────────────────
            Figma: top=321px → content=261px
            left=10px, w=715px (49.65%), font=20px lh=1.5
        ─────────────────────────────────────────────────── */}
        <p
          className="absolute font-normal text-black not-italic"
          style={{
            top: "261px",
            left: "10px",
            width: "49.65%",
            maxWidth: "715px",
            fontSize: "20px",
            lineHeight: "1.5",
          }}
        >
          {info.description}
        </p>

        {/* ── Google Maps (address = info.address) ─────────
            Figma: top=591px → content=531px
            left=calc(50%+6px), w=704px (calc(50%-6px)), h=531px
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY + enable Maps Embed API.
        ─────────────────────────────────────────────────── */}
        <div
          className="absolute overflow-hidden bg-[#e8e4e4] grayscale"
          style={{
            top: "531px",
            left: "calc(50% + 6px)",
            width: "calc(50% - 6px)",
            height: "531px",
          }}
        >
          <iframe
            title={`Store location: ${info.address}`}
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapsEmbedSrc}
          />
        </div>

        {/* ── STORE ADRESS label ─────────────────────────────
            Figma: top=1074px → content=1014px, left=18px
            font=16px, lh=1.5
        ─────────────────────────────────────────────────── */}
        <p
          className="absolute font-normal text-black not-italic whitespace-nowrap"
          style={{
            top: "1014px",
            left: "18px",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          STORE ADRESS
        </p>

        {/* ── COPY ADRESS button ─────────────────────────────
            10px gap to the right gray rectangle (starts at 50%+6px):
            anchor right edge at calc(50% + 6px - 10px).
        ─────────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleCopyAddress}
          className="absolute bg-[#f5f5f5] flex items-center justify-center hover:bg-[#e8e8e8] transition-colors cursor-pointer"
          style={{
            top: "1018px",
            left: "calc(50% + 6px - 10px)",
            transform: "translateX(-100%)",
            padding: "10px",
          }}
        >
          <span
            className="font-normal text-black not-italic whitespace-nowrap"
            style={{ fontSize: "16px", lineHeight: "1.5" }}
          >
            {copied ? "COPIED" : "COPY ADDRESS"}
          </span>
        </button>

        {/* ── Address text ───────────────────────────────────
            Figma: top=1098px → content=1038px, left=18px
        ─────────────────────────────────────────────────── */}
        <p
          className="absolute font-normal text-black not-italic whitespace-nowrap"
          style={{
            top: "1038px",
            left: "18px",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          {info.address}
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════
          GALLERY SECTION
          Left img:  marginLeft=10px, w=57.29%, aspect=825:864
          Right column: absolute — image + caption stacked, 50px gap below image
          Left caption:  31px below left img
      ═══════════════════════════════════════════════════════ */}
      <section className="relative w-full">

        {/* Left image — marginLeft 10px, w=(57.29% - 10px) maintaining aspect 825:864 */}
        <div
          className="relative overflow-hidden"
          style={{
            marginLeft: "10px",
            width: "calc(57.29% - 10px)",
            aspectRatio: "825 / 864",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgFrame47}
            alt="Store interior photo"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right column: image then caption (50px below image) — no fragile top calc */}
        <div
          className="absolute top-0 flex flex-col"
          style={{
            left: "calc(58.33% + 4px)",
            width: "calc(41.67% - 14px)",
          }}
        >
          <div
            className="relative w-full overflow-hidden shrink-0"
            style={{ aspectRatio: "586 / 438" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgFrame48}
              alt="Store exterior photo"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div
            className="shrink-0 flex flex-col"
            style={{ marginTop: "50px", paddingLeft: "7px", gap: "20px" }}
          >
            <p
              className="font-bold text-black not-italic"
              style={{
                fontSize: "18px",
                lineHeight: "9px",
                letterSpacing: "0.18px",
                width: "350px",
              }}
            >
              Photo Titel
            </p>
            <p
              className="font-normal text-black not-italic whitespace-nowrap"
              style={{
                fontSize: "12px",
                lineHeight: "16.5px",
                letterSpacing: "0.12px",
              }}
            >
              DISCRIPTION DISCRIPTIONDISCRIPTI
            </p>
          </div>
        </div>

        {/* Left caption — 31px below left image, left=17px */}
        <div
          className="flex flex-col"
          style={{ marginLeft: "17px", marginTop: "31px", gap: "20px" }}
        >
          <p
            className="font-bold text-black not-italic"
            style={{
              fontSize: "18px",
              lineHeight: "9px",
              letterSpacing: "0.18px",
              width: "350px",
            }}
          >
            Photo Titel
          </p>
          <p
            className="font-normal text-black not-italic whitespace-nowrap"
            style={{
              fontSize: "12px",
              lineHeight: "16.5px",
              letterSpacing: "0.12px",
            }}
          >
            DISCRIPTION DISCRIPTIONDISCRIPTI
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STORE LIST — 6 rows with horizontal dividers
          Figma: 6 rows, each row height ~87px, starts 2248px from content top
          Row layout (left to right):
            CITY (12px, rgba opacity 0.72, w=196px) — left
            + (22px) ————————————————————————————— right
            STORE NAME (22px bold, w=196px) ———————— below city (12px row-gap)
          Top border on each row
      ═══════════════════════════════════════════════════════ */}
      <section
        className="w-full"
        style={{ marginTop: "195px" }}
      >
        {OTHER_STORES.map((store, i) => (
          <div key={i} className="w-full">
            <div className="w-full border-t border-black" />
            <div
              className="flex items-start justify-between"
              style={{ padding: "10px" }}
            >
              <div>
                <p
                  className="font-normal not-italic"
                  style={{
                    fontSize: "12px",
                    lineHeight: "9px",
                    letterSpacing: "0.12px",
                    color: "rgba(0,0,0,0.72)",
                    width: "196px",
                  }}
                >
                  {store.city}
                </p>
                <p
                  className="font-bold text-black not-italic"
                  style={{
                    fontSize: "22px",
                    lineHeight: "9px",
                    letterSpacing: "0.22px",
                    width: "196px",
                    marginTop: "12px",
                  }}
                >
                  {store.name}
                </p>
              </div>

              <p
                className="font-normal text-black not-italic"
                style={{
                  fontSize: "22px",
                  lineHeight: "9px",
                  letterSpacing: "0.22px",
                }}
              >
                +
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* ═══════════════════════════════════════════════════════
          BYREDO SIGNATURE + FOOTER
          Figma node 20:67: SVG left=13px, top=3027px
          Footer text: name / email / id  |  copyright / date
      ═══════════════════════════════════════════════════════ */}
      <section
        className="w-full"
        style={{ marginTop: "100px", paddingLeft: "13px", paddingRight: "13px" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/기타/byredo-signature.svg"
          alt="BYREDO"
          className="w-full h-auto block select-none"
          draggable={false}
        />

        <div
          className="w-full flex items-start justify-between"
          style={{ marginTop: "28px", paddingBottom: "32px" }}
        >
          <div>
            <p
              className="capitalize font-medium text-black"
              style={{ fontSize: "12px", lineHeight: "1" }}
            >
              Horace Ortiz
            </p>
            <p
              className="capitalize font-medium text-black"
              style={{ fontSize: "12px", lineHeight: "1", marginTop: "30px" }}
            >
              Gladys.Romaguera10@gmail.com
            </p>
            <p
              className="capitalize font-medium text-black"
              style={{ fontSize: "12px", lineHeight: "1", marginTop: "30px" }}
            >
              59362
            </p>
          </div>
          <div className="text-right">
            <p
              className="capitalize font-medium text-black"
              style={{ fontSize: "12px", lineHeight: "1" }}
            >
              BYREDO all right reserved
            </p>
            <p
              className="capitalize font-medium text-black"
              style={{ fontSize: "12px", lineHeight: "1", marginTop: "30px" }}
            >
              Fri Jan 14 2039 16:54:41 GMT+0900
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
