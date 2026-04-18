import type { Metadata } from "next";
import { AdminGate } from "@/components/admin/AdminGate";

export const metadata: Metadata = {
  title: "Admin",
  description: "Byredo admin access page.",
};

export default function AdminPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-white pt-[60px]">
      <AdminGate />
    </div>
  );
}
