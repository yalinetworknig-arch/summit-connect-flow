import { createFileRoute } from "@tanstack/react-router";
import { ScheduleSection } from "@/components/sections/ScheduleSection";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda - AIDIENGL Summit 2026" },
      { name: "description", content: "Complete agenda and schedule for AIDIENGL 2026. Friday, September 25, 2026 at Shiba Event Center." },
      { property: "og:title", content: "Agenda - AIDIENGL Summit 2026" },
      { property: "og:description", content: "Complete agenda and schedule for AIDIENGL 2026. Friday, September 25, 2026 at Shiba Event Center." },
    ],
  }),
  component: AgendaPage,
});

function AgendaPage() {
  return (
    <div className="pt-20">
      <ScheduleSection />
    </div>
  );
}
