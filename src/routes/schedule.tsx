import { createFileRoute } from "@tanstack/react-router";
import { ScheduleSection } from "@/components/sections/ScheduleSection";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Schedule — YALI Summit 2026" },
      { name: "description", content: "2-day Summit programme and agenda, plus arrival day." },
      { property: "og:title", content: "Schedule — YALI Summit 2026" },
      { property: "og:description", content: "2-day Summit programme and agenda, plus arrival day." },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  return <div className="pt-20"><ScheduleSection /></div>;
}