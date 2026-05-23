import { Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { Countdown } from "./Countdown";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0A1128] text-white scroll-mt-24"
    >
      {/* Hexagonal dot pattern overlay (~9% opacity, cyan on navy) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.09 }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hexdots"
            width="36"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="0" cy="0" r="1.2" fill="#00D9FF" />
            <circle cx="18" cy="16" r="1.2" fill="#00D9FF" />
            <circle cx="36" cy="0" r="1.2" fill="#00D9FF" />
            <circle cx="0" cy="32" r="1.2" fill="#00D9FF" />
            <circle cx="36" cy="32" r="1.2" fill="#00D9FF" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexdots)" />
      </svg>

      {/* Vertical side labels — desktop only */}
      <span
        aria-hidden="true"
        className="hidden lg:block absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 text-[11px] font-normal uppercase whitespace-nowrap text-[#00D9FF]/40 pointer-events-none"
        style={{
          writingMode: "vertical-rl",
          transform: "translateY(-50%) rotate(180deg)",
          letterSpacing: "0.1em",
        }}
      >
        Artificial Intelligence (AI), Digital Innovation and the Future of Inclusive Leadership in Nigeria
      </span>
      <span
        aria-hidden="true"
        className="hidden lg:block absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 text-[11px] font-normal uppercase whitespace-nowrap text-[#00D9FF]/40 pointer-events-none"
        style={{
          writingMode: "vertical-rl",
          letterSpacing: "0.1em",
        }}
      >
        YALI Network Nigeria National Summit — National Summit
      </span>

      {/* Content */}
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-12 py-20 md:py-28 min-h-[100dvh] flex flex-col items-center justify-center text-center">
        {/* Partners bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 inline-flex items-center gap-6 px-6 py-3 rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-6 rounded-sm bg-gradient-to-b from-white/95 to-white/80 flex items-center justify-center text-[7px] font-black tracking-tight text-[#0A1128]">
              U.S.A
            </div>
            <div className="text-left text-[9px] leading-tight font-semibold text-white/90 uppercase tracking-wider">
              United States Diplomatic<br />Mission in Nigeria
            </div>
          </div>
          <div className="h-6 w-px bg-white/15" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-[#0A1128]">
              Y
            </div>
            <div className="text-left text-[9px] leading-tight font-semibold text-white/90 uppercase tracking-wider">
              YALI Network<br />Nigeria
            </div>
          </div>
        </motion.div>

        {/* PRESENTS */}
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-[#00D9FF] text-xs font-medium uppercase mb-6"
          style={{ letterSpacing: "0.2em" }}
        >
          Presents:
        </motion.p>

        {/* Title */}
        <motion.h2
          custom={0.2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="font-display font-bold text-white uppercase"
          style={{
            fontSize: "clamp(32px, 5.6vw, 64px)",
            lineHeight: 1.05,
          }}
        >
          YALI Network Nigeria
          <br />
          National Summit
        </motion.h2>

        {/* AIDIFILN rainbow wordmark */}
        <h1 className="sr-only">AIDIFILN</h1>
        <motion.div
          custom={0.6}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          aria-hidden="true"
          className="font-display font-bold text-rainbow mt-6"
          style={{
            fontSize: "clamp(36px, 6.4vw, 72px)",
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}
        >
          AIDIFILN
        </motion.div>

        {/* THEME */}
        <motion.p
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="text-[#00D9FF] text-xs font-medium uppercase mt-8 mb-3"
          style={{ letterSpacing: "0.2em" }}
        >
          Theme:
        </motion.p>
        <motion.p
          custom={1.2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="max-w-[600px] text-white/90 text-base md:text-lg leading-relaxed"
        >
          Artificial Intelligence, Digital Innovation and the Future of
          Inclusive Leadership in Nigeria.
        </motion.p>

        {/* Date */}
        <motion.p
          custom={1.4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 text-white/70 font-semibold text-base"
          style={{ letterSpacing: "0.05em" }}
        >
          September 10 – 13, 2026
        </motion.p>

        <motion.div
          custom={1.6}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-8"
        >
          <Countdown />
        </motion.div>

        {/* CTAs */}
        <motion.div
          custom={1.8}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <Link
            to="/register"
            className="px-7 min-h-12 inline-flex items-center justify-center rounded-full text-base font-semibold bg-[#00D9FF] text-[#0A1128] transition-transform hover:scale-[1.03] active:scale-95"
          >
            Register Now
          </Link>
          <a
            href="#sponsors"
            className="px-7 min-h-12 inline-flex items-center justify-center rounded-full text-base font-semibold border-2 border-[#00D9FF] text-[#00D9FF] transition-colors hover:bg-[#00D9FF]/10"
          >
            Become a Sponsor
          </a>
        </motion.div>

        <p className="mt-10 text-[#00D9FF]/80 text-sm">
          www.yalinetwork.ng/summit
        </p>
      </div>

      {/* Bottom vignette — clean fade to black */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #0A1128 100%)",
        }}
      />
    </section>
  );
}