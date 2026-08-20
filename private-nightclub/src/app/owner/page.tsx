import type { Metadata } from "next";
import OwnerDashboard from "@/components/OwnerDashboard";

export const metadata: Metadata = {
  title: "Owner · Private Nightclub",
  robots: { index: false, follow: false },
};

export default function OwnerPage() {
  return <OwnerDashboard />;
}
