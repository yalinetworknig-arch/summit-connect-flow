import { Link } from "@tanstack/react-router";
import { Countdown } from "./Countdown";
import logoRainbow from "@/assets/aidifiln-lockup-rainbow.png";

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-brand-navy text-white scroll-mt-24"
    >
      {/* Hex pattern overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.1 }}
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hex"
            width="56"
            height="48"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(1)"
          >
            <path
              d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z"
              fill="none"
              stroke="#00D9FF"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>

      <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center gap-8">
        <h2
          className="font-bold uppercase tracking-wide font-display"
          style={{
            fontSize: "clamp(32px, 5.5vw, 64px)",
            lineHeight: 1.05,
          }}
        >
          YALI Network Nigeria<br className="hidden sm:block" /> National Summit
        </h2>

        <h1 className="sr-only">AIDIFILN</h1>
        <img
          src={logoRainbow}
          alt="AIDIFILN — Artificial Intelligence, Digital Innovation and the Future of Inclusive Leadership in Nigeria"
          className="w-full max-w-3xl h-auto select-none drop-shadow-[0_8px_30px_rgba(0,217,255,0.2)]"
          loading="eager"
          decoding="async"
        />

        <p
          className="max-w-2xl text-white/70"
          style={{ fontSize: "18px", lineHeight: 1.6 }}
        >
          Artificial Intelligence, Digital Innovation and the Future of Inclusive
          Leadership in Nigeria.
        </p>

        <Countdown />

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Link
            to="/register"
            className="px-7 py-3 rounded-full text-base font-semibold transition-transform hover:scale-105 active:scale-95 bg-accent-cyan text-brand-navy min-h-12"
          >
            Register Now
          </Link>
          <Link
            to="/sponsors"
            className="px-7 py-3 rounded-full text-base font-semibold border-2 border-accent-cyan text-accent-cyan transition-colors hover:bg-white/5 min-h-12"
          >
            Become a Sponsor
          </Link>
        </div>
      </div>
    </section>
  );
}