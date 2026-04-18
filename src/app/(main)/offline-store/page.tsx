import type { Metadata } from "next";
import { OfflineStoreList } from "@/components/offline-store/OfflineStoreList";

export const metadata: Metadata = {
  title: "Offline Store",
  description: "Find a Byredo store near you.",
};

export default function OfflineStorePage(): React.JSX.Element {
  return (
    /**
     * Figma node 20:57 — Offline Store page (1440px canvas)
     * Header: 60px (in layout)
     * White space before cards: 304px - 60px header = 244px
     * Cards: 6 × 350px image + title + description, horizontal scroll
     * Bottom bar: "(SCROLL)" left + "STORE 06" right at ~860px from page top
     */
    <div className="bg-white">
      {/* intro space — 세로 스크롤 후 섹션이 뷰포트 상단에 닿을 때 pin 시작 */}
      <div style={{ height: "244px" }} />

      <OfflineStoreList />

      {/* pin 이후 자연스럽게 이어지는 하단 여백 */}
      <div style={{ height: "160px" }} />
    </div>
  );
}
