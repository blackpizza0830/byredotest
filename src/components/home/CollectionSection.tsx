/**
 * Figma node 0:941 + 0:948-0:951
 *
 * Divider row (node 0:941):
 *   border-top [#231f20], h=20px, left=9px, top=2783px
 *   Left: "Placeholder Text" 8px uppercase (node 0:943)
 *   Right: "Text Link" + 20px square (node 0:944-0:947)
 *
 * 4-column grid (node 0:948-0:951):
 *   h=346px per cell (aspect ~347/346 ≈ 1:1), left=10px, top=2865px
 *   Uses assets/main images: main_2_1 … main_3_2
 */

interface CollectionItem {
  src: string;
  alt: string;
}

const COLLECTION: CollectionItem[] = [
  { src: "/assets/main/main_2_1.png", alt: "Collection 1" },
  { src: "/assets/main/main_2_2.png", alt: "Collection 2" },
  { src: "/assets/main/main_3_1.png", alt: "Collection 3" },
  { src: "/assets/main/main_3_2.png", alt: "Collection 4" },
];

export function CollectionSection(): React.JSX.Element {
  return (
    <section className="w-full px-[10px] mt-[100px]">
      {/* ── Divider row — node 0:941 ── */}
      <div className="flex items-center justify-between border-t border-[#231f20] py-[8px]">
        {/* "Placeholder Text" — node 0:943 */}
        <span className="text-[8px] font-normal text-[#0a0a0a] uppercase tracking-[0.2057px] leading-[12px]">
          Placeholder Text
        </span>

        {/* Text Link + square — node 0:944-0:947 */}
        <div className="flex items-center gap-[5px]">
          <span className="text-[8px] font-normal text-[#0a0a0a] uppercase tracking-[0.2057px] leading-[12px]">
            Text Link
          </span>
          <div className="w-[20px] h-[20px] bg-[#231f20] shrink-0" />
        </div>
      </div>

      {/* ── 4-column grid — node 0:948-0:951 ── */}
      {/* Each cell: 347px × 346px ≈ 1:1 aspect ratio */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] w-full mt-[10px] mb-[10px]">
        {COLLECTION.map((item) => (
          <div
            key={item.src}
            className="relative w-full overflow-hidden bg-[#e3e3e3]"
            style={{ aspectRatio: "347 / 346" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
