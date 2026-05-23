import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Partners } from "@/components/home/Partners";
import { FAQ } from "@/components/home/FAQ";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YALI Network Nigeria National Summit 2026 — AIDIFILN" },
      {
        name: "description",
        content:
          "AI, Digital Innovation and the Future of Inclusive Leadership in Nigeria. Sept 10–13, 2026, Lagos. Register free.",
      },
      { property: "og:title", content: "YALI Network Nigeria National Summit 2026" },
      {
        property: "og:description",
        content:
          "AI, Digital Innovation and the Future of Inclusive Leadership in Nigeria. Sept 10–13, 2026, Lagos.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Stats />
      <Partners />
      <FAQ />
    </>
  );
}
