import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/sections/AboutSection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About â€” YALI Summit 2026" },
      { name: "description", content: "About the AIDIENGL Summit 2026 by YALI Network Nigeria." },
      { property: "og:title", content: "About â€” YALI Summit 2026" },
      { property: "og:description", content: "About the AIDIENGL Summit 2026 by YALI Network Nigeria." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return <div className="pt-20"><AboutSection /></div>;
}

