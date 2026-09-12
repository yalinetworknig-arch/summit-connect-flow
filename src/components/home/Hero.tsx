import { Link } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { Countdown } from "./Countdown";
import aidieglWhite from "@/assets/aidiegl-white.png";
import usMissionLogo from "@/assets/sponsors/us-mission-logo.jpeg";
import yaliLogo from "@/assets/sponsors/yali-logo.jpeg";

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

      {/* Animated dynamic halftone wave field (bottom of flier inspiration) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="glow1" cx="20%" cy="80%" r="60%">
              <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#0066FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0A1128" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow2" cx="80%" cy="90%" r="55%">
              <stop offset="0%" stopColor="#7B2CFF" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#001B4B" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0A1128" stopOpacity="0" />
            </radialGradient>
            <pattern id="halftone" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="7" r="2" fill="#00D9FF" />
            </pattern>
            <mask id="waveMask">
              <rect width="1200" height="800" fill="black" />
              <path
                id="wavePath"
                d="M0,520 Q300,420 600,520 T1200,520 L1200,800 L0,800 Z"
                fill="white"
              />
            </mask>
          </defs>
          <rect width="1200" height="800" fill="url(#glow1)" />
          <rect width="1200" height="800" fill="url(#glow2)" />
          <rect width="1200" height="800" fill="url(#halftone)" mask="url(#waveMask)" opacity="0.55" />
          {/* Static diagonal streaks for performance */}
          <g opacity="0.18">
            <path
              d="M-100,700 L400,300"
              stroke="#00D9FF"
              strokeWidth="1"
              opacity="0.25"
            />
            <path
              d="M200,800 L800,200"
              stroke="#7B2CFF"
              strokeWidth="1"
              opacity="0.15"
            />
          </g>
        </svg>

        {/* Static ambient dots for performance */}
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#00D9FF]"
            style={{
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              left: `${10 + i * 14}%`,
              bottom: `${10 + (i % 4) * 12}%`,
              opacity: 0.35,
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

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
        {/* Partners bar — elevated, prestigious presentation */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10 sm:mb-12 inline-flex flex-row items-center justify-center gap-6 sm:gap-12"
        >
          {[
            { src: usMissionLogo, alt: "United States Diplomatic Mission in Nigeria" },
            { src: yaliLogo, alt: "YALI Network Nigeria" },
          ].map(({ src, alt }, idx) => (
            <div
              key={alt}
              className="flex items-center justify-center group"
            >
              {/* Refined logo container with subtle elevation */}
              <div className="relative">
                <img
                  src={src}
                  alt={alt}
                  className="h-14 sm:h-20 w-auto object-contain select-none transition-transform duration-300 group-hover:scale-105"
                  style={{
                    filter:
                      "drop-shadow(0 8px 16px rgba(0,0,0,0.25)) drop-shadow(0 1px 2px rgba(255,255,255,0.1))",
                  }}
                  draggable={false}
                  loading="eager"
                />
              </div>
              {/* Divider between logos on desktop */}
              {idx === 0 && (
                <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-transparent via-[#00D9FF]/20 to-transparent mx-8" />
              )}
            </div>
          ))}
        </motion.div>

        {/* YALI NETWORK NIGERIA PRESENTS — main branding headline */}
        <motion.h2
          custom={0.1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-8 sm:mt-10 text-white/85 text-2xl sm:text-3xl font-bold tracking-tight leading-tight"
          style={{ letterSpacing: "-0.01em" }}
        >
          YALI Network Nigeria
          <br />
          <span className="text-[#00D9FF]">Presents</span>
        </motion.h2>

        {/* THE 2026 THEME — refined section header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-12 sm:mt-14"
        >
          <motion.p
            custom={0.9}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="text-[#00D9FF]/70 text-sm font-semibold uppercase tracking-[0.1em] mb-8"
          >
            The 2026 Theme
          </motion.p>
        </motion.div>

        {/* AIDIEGL wordmark image (contains tagline) */}
        <h1 className="sr-only">
          AIDIEGL — Artificial Intelligence, Digital Innovation and Empowering
          the Next Generation of Leaders
        </h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.3 }}
          className="relative w-full max-w-[780px] mt-6 sm:mt-8"
        >
          {/* Refined breathing halo — more subtle and sophisticated */}
          <motion.div
            aria-hidden="true"
            className="absolute -inset-12 pointer-events-none motion-reduce:hidden"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(0,217,255,0.18), rgba(123,44,255,0.06) 60%, transparent 85%)",
              filter: "blur(40px)",
            }}
            animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.02, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* AIDIEGL Wordmark — white version for dark background, refined shadow */}
          <motion.img
            src={aidieglWhite}
            alt="AIDIEGL — Artificial Intelligence, Digital Innovation, and Empowering the Next Generation of Leaders"
            className="relative w-full h-auto select-none"
            draggable={false}
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(255,255,255,0.2)) drop-shadow(0 16px 32px rgba(0,0,0,0.5)) drop-shadow(0 0 32px rgba(0,217,255,0.3))",
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Event details — refined typography and spacing */}
        <motion.div
          custom={1.2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-12 sm:mt-14 space-y-2"
        >
          <p
            className="text-white/80 font-semibold text-lg leading-relaxed"
            style={{ letterSpacing: "0.02em" }}
          >
            Friday, September 25, 2026 · 8:00 AM – 4:00 PM
          </p>
          <p className="text-white/70 text-base" style={{ letterSpacing: "0.01em" }}>
            Shiba Event Center, Lagos
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          custom={1.4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-10 sm:mt-12"
        >
          <Countdown />
        </motion.div>

        {/* CTAs — premium presentation */}
        <motion.div
          custom={1.6}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-12 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link
            to="/register"
            className="px-8 min-h-[52px] inline-flex items-center justify-center rounded-full text-base font-semibold bg-[#00D9FF] text-[#0A1128] transition-all duration-200 hover:shadow-[0_12px_28px_rgba(0,217,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Claim your seat
          </Link>
          <a
            href="/AIDIEGL_2026_Official_Programme_Agenda.docx"
            download="AIDIEGL_2026_Official_Programme_Agenda.docx"
            className="px-8 min-h-[52px] inline-flex items-center justify-center rounded-full text-base font-semibold border-2 border-[#00D9FF] transition-all duration-200 hover:bg-[#00D9FF]/10 hover:shadow-[0_8px_20px_rgba(0,217,255,0.2)] text-white"
          >
            ↓ Download Agenda
          </a>
          <a
            href="#sponsors"
            className="px-8 min-h-[52px] inline-flex items-center justify-center rounded-full text-base font-semibold border-2 border-[#00D9FF] transition-all duration-200 hover:bg-[#00D9FF]/10 hover:shadow-[0_8px_20px_rgba(0,217,255,0.2)] text-white"
          >
            Partner with us
          </a>
        </motion.div>

        {/* Event metadata — subtle and refined */}
        <motion.p
          custom={1.8}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-10 text-white/50 text-xs font-medium uppercase tracking-wider"
        >
          Physical & Virtual · 150–200 Attendees · Networking & Innovation
        </motion.p>
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