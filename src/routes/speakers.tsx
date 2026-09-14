import { createFileRoute } from "@tanstack/react-router";
import { SpeakersSection } from "@/components/sections/SpeakersSection";

export const Route = createFileRoute("/speakers")({
  head: () => ({
    meta: [
      { title: "Speakers - YALI Summit 2026" },
      { name: "description", content: "Meet the keynote speakers, masterclass facilitators, and panel moderators for AIDIENGL 2026 summit." },
      { property: "og:title", content: "Speakers - YALI Summit 2026" },
      { property: "og:description", content: "Meet the keynote speakers, masterclass facilitators, and panel moderators for AIDIENGL 2026 summit." },
    ],
  }),
  component: SpeakersPage,
});

function SpeakersPage() {
  return (
    <div className="pt-20">
      <SpeakersSection />
    </div>
  );
}
