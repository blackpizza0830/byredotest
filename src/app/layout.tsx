import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Byredo",
    template: "%s | Byredo",
  },
  description:
    "Byredo — Perfumes, leather goods and accessories inspired by memories and experiences.",
  keywords: ["Byredo", "perfume", "fragrance", "luxury", "beauty"],
  openGraph: {
    title: "Byredo",
    description:
      "Perfumes, leather goods and accessories inspired by memories and experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="ko">
      <body className="bg-white text-[#231f20]">{children}</body>
    </html>
  );
}
