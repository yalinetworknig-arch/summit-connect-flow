import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Users, MapPin, CalendarDays, Target, Globe } from "lucide-react";
import {
  Reveal,
  Stagger,
  staggerChild,
  SideLabel,
  HalftoneBackdrop,
  Eyebrow,
} from "@/components/motion-primitives";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — YALI Summit 2026" },
      { name: "description", content: "About the AIDIFILN Summit 2026 by YALI Network Nigeria." },
      { property: "og:title", content: "About — YALI Summit 2026" },
      { property: "og:description", content: "About the AIDIFILN Summit 2026 by YALI Network Nigeria." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative px-6 py-20 md:py-28 bg-background text-text-primary overflow-hidden">
        <HalftoneBackdrop />
        <SideLabel>Presents · AIDIFILN 2026</SideLabel>
        <SideLabel side="right" tone="muted">YALI Network Nigeria</SideLabel>
        <div className="relative max-w-4xl mx-auto">
          <Reveal><Eyebrow>About the Summit</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-[1.05] mt-5 mb-7">
              AI, Digital Innovation & the Future of{" "}
              <span className="text-accent-cyan">Inclusive Leadership</span> in
              Nigeria.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
              AIDIFILN is the flagship national summit of the YALI Network Nigeria —
              four days where Nigerian young leaders, technologists, policymakers and
              sponsors converge to shape what an inclusive AI-powered future looks like
              for our country.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-14 md:py-20 bg-surface text-text-primary">
        <Stagger className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { Icon: CalendarDays, label: "Dates", value: "Sept 10 – 13, 2026" },
            { Icon: MapPin, label: "Location", value: "Lagos, Nigeria" },
            { Icon: Users, label: "Delegates", value: "2,000+ expected" },
            { Icon: Globe, label: "Reach", value: "All 36 states + FCT" },
          ].map(({ Icon, label, value }) => (
            <motion.div
              key={label}
              variants={staggerChild}
              className="rounded-2xl border border-border-strong p-6 bg-background hover:border-accent-cyan/60 transition-colors"
            >
              <Icon className="w-7 h-7 text-accent-cyan mb-4" />
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-secondary mb-1">
                {label}
              </p>
              <p className="text-lg font-display font-semibold">{value}</p>
            </motion.div>
          ))}
        </Stagger>
      </section>

      <section className="px-6 py-20 md:py-28 bg-background text-text-primary">
        <div className="max-w-4xl mx-auto">
          <Reveal><Eyebrow>Why now</Eyebrow></Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display font-bold text-3xl md:text-5xl mt-5 mb-10 leading-tight">
              Nigeria's AI inflection point is{" "}
              <span className="text-accent-cyan">already underway.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="space-y-6 text-text-secondary leading-relaxed text-lg">
              <p>
                Decisions made in the next 24 months — about data, infrastructure,
                talent and regulation — will shape the next two decades of inclusive
                growth.
              </p>
              <p>
                AIDIFILN brings together the people actually building that future:
                founders shipping product, civil servants drafting policy, educators
                reskilling millions, and sponsors funding the pipeline.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28 bg-surface text-text-primary">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <Eyebrow>Theme pillars</Eyebrow>
              <h2 className="font-display font-bold text-3xl md:text-5xl mt-5">
                Three commitments. <span className="text-accent-cyan">No flinching.</span>
              </h2>
            </div>
          </Reveal>
          <Stagger className="grid md:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                Icon: Sparkles,
                title: "Applied AI",
                body: "Beyond demos — real deployments solving Nigerian problems at scale.",
              },
              {
                Icon: Users,
                title: "Inclusive Leadership",
                body: "Women, youth, persons with disabilities, rural communities — leadership that reflects Nigeria.",
              },
              {
                Icon: Target,
                title: "Action over talk",
                body: "Every track ends in commitments, partnerships, and follow-through.",
              },
            ].map(({ Icon, title, body }, i) => (
              <motion.div
                key={title}
                variants={staggerChild}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="relative rounded-3xl border border-border-strong p-7 bg-background overflow-hidden hover:border-accent-cyan/60 transition-colors"
              >
                <span
                  aria-hidden
                  className="absolute top-3 right-4 font-mono text-[10px] tracking-[0.3em] text-text-secondary/60"
                >
                  0{i + 1}
                </span>
                <Icon className="w-8 h-8 text-accent-cyan mb-5" />
                <h3 className="font-display font-semibold text-xl mb-2">{title}</h3>
                <p className="text-text-secondary leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative px-6 py-20 md:py-24 bg-background text-text-primary text-center overflow-hidden">
        <HalftoneBackdrop intensity="soft" />
        <div className="relative max-w-2xl mx-auto">
          <Reveal>
            <h2 className="font-display font-bold text-3xl md:text-5xl mb-5 leading-tight">
              Be part of it.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-text-secondary mb-8 text-lg">
              Registration is open. Verified YALI delegates attend free.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 min-h-12 rounded-full text-base font-semibold bg-accent-cyan text-brand-navy hover:scale-[1.03] active:scale-100 transition-transform"
            >
              Register now
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}