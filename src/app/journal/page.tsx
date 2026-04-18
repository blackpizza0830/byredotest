import type { Metadata } from "next";
import type React from "react";
import { JournalPage } from "@/components/journal/JournalPage";

export const metadata: Metadata = {
  title: "Journal",
  description: "Explore the Byredo Journal — stories, inspiration and fragrance craft.",
};

export default function JournalRoute(): React.JSX.Element {
  return <JournalPage />;
}
