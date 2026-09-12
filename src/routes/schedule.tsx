import { createFileRoute } from "@tanstack/react-router";
import { ScheduleSection } from "@/components/sections/ScheduleSection";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — YALI Summit 2026" },
      { name: "description", content: "One-day Summit programme and agenda. Friday, September 25, 2026, 8:00 AM – 4:00 PM at Shiba Event Center, Lagos." },
      { property: "og:title", content: "Schedule — YALI Summit 2026" },
      { property: "og:description", content: "One-day Summit programme and agenda. Friday, September 25, 2026, 8:00 AM – 4:00 PM at Shiba Event Center, Lagos." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  return <div className="pt-20"><ScheduleSection /></div>;
}