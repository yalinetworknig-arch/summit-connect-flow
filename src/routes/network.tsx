import { createFileRoute } from "@tanstack/react-router";
import { NetworkSection } from "@/components/sections/NetworkSection";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Network - AIDIENGL Summit 2026" },
      { name: "description", content: "Connect with innovators, leaders, and changemakers at the AIDIENGL 2026 summit. Find attendees by sector and interests." },
      { property: "og:title", content: "Network - AIDIENGL Summit 2026" },
      { property: "og:description", content: "Connect with innovators, leaders, and changemakers at the AIDIENGL 2026 summit. Find attendees by sector and interests." },
    ],
  }),
  component: NetworkPage,
});

function NetworkPage() {
  return (
    <div className="pt-20">
      <NetworkSection />
    </div>
  );
}
