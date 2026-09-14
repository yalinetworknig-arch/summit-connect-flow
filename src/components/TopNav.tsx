import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sun, Moon, Menu, ChevronDown } from "lucide-react";
import AIDIENGLWhite from "@/assets/aidiegl-white.png";
import AIDIENGLNavy from "@/assets/aidiegl-navy.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

const mainItems = [
  { href: "/", label: "Home" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/network", label: "Network" },
] as const;

const programItems = [
  { href: "/schedule", label: "Schedule" },
  { href: "/tracks", label: "Tracks" },
  { href: "/speakers", label: "Speakers" },
  { href: "/agenda", label: "Agenda" },
] as const;

const moreItems = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/merch", label: "Merchandise" },
] as const;

function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      stored === null
        ? window.matchMedia("(prefers-color-scheme: dark)").matches || true
        : stored === "dark";
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {}
      return next;
    });
  };

  return { isDark, toggle };
}

function DesktopDropdown({ label, items }: { label: string; items: readonly { href: string; label: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative group">
      <button
        className="px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors text-brand-navy/80 hover:text-accent-cyan dark:text-white/80 dark:hover:text-[#00D9FF] flex items-center gap-1"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {label}
        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-0 w-48 rounded-lg border-2 shadow-lg z-50 py-2"
          style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {items.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className="block px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors text-brand-navy/80 hover:text-accent-cyan dark:text-white/80 dark:hover:text-[#00D9FF]"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileDropdown({ label, items }: { label: string; items: readonly { href: string; label: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-3 text-base font-medium uppercase tracking-wide transition-colors text-text-primary hover:text-accent-cyan flex items-center justify-between"
      >
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="pl-4 flex flex-col gap-1 border-l-2" style={{ borderColor: "var(--border-strong)" }}>
          {items.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className="px-3 py-2 text-base font-medium uppercase tracking-wide transition-colors text-text-primary hover:text-accent-cyan"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? "");
  const lockUntilRef = (useState<{ t: number }>(() => ({ t: 0 }))[0]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!elements.length) return;

    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntilRef.t) {
          for (const entry of entries) {
            visibility.set(entry.target.id, entry.intersectionRatio);
          }
          return;
        }
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = activeId;
        let bestRatio = 0;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0 && bestId !== activeId) setActiveId(bestId);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join("|")]);

  const setActive = (id: string) => {
    lockUntilRef.t = Date.now() + 900;
    setActiveId(id);
  };

  return [activeId, setActive] as const;
}

export function TopNav() {
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useScrollSpy([]);

  return (
    <header className="fixed top-3 md:top-5 inset-x-0 z-40 px-3 md:px-6 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-[1180px] flex items-center justify-between gap-4 px-3 md:px-5 h-14 md:h-16 rounded-full border border-brand-navy/10 dark:border-white/10 bg-white/85 dark:bg-[#0A1128]/70 backdrop-blur-xl shadow-[0_10px_40px_-12px_rgba(15,27,61,0.18)] dark:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]">

        {/* Logo */}
        <Link
          to="/"
          aria-label="AIDIENGL - Home"
          className="flex items-center shrink-0 cursor-pointer"
        >
          <img
            src={AIDIENGLNavy}
            alt="AIDIENGL"
            className="block dark:hidden h-9 md:h-11 w-auto select-none"
            loading="eager"
            decoding="async"
          />
          <img
            src={AIDIENGLWhite}
            alt="AIDIENGL"
            className="hidden dark:block h-10 md:h-12 w-auto select-none"
            loading="eager"
            decoding="async"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-2">
          {mainItems.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className="px-4 py-2 text-sm font-medium uppercase tracking-wide transition-colors text-brand-navy/80 hover:text-accent-cyan dark:text-white/80 dark:hover:text-[#00D9FF]"
            >
              {label}
            </Link>
          ))}

          {/* Program Dropdown */}
          <DesktopDropdown label="Program" items={programItems} />

          {/* More Dropdown */}
          <DesktopDropdown label="More" items={moreItems} />
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-accent-cyan/10 transition-colors text-brand-navy/70 dark:text-white/80"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link
            to="/login"
            className="px-4 py-2 rounded-full text-sm font-semibold text-brand-navy/80 hover:text-accent-cyan dark:text-white/80 dark:hover:text-[#00D9FF] transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95 bg-accent-cyan text-brand-navy shadow-elegant"
          >
            Register
          </Link>
          <Link
            to="/sponsors"
            className="px-5 py-2 rounded-full text-sm font-semibold border border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 transition-colors"
          >
            Sponsor
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-accent-cyan/10 transition-colors text-brand-navy/70 dark:text-white/80"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-full hover:bg-accent-cyan/10 transition-colors text-brand-navy dark:text-white"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:max-w-sm bg-surface border-border-strong overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle className="text-left">
                  <img
                    src={AIDIENGLNavy}
                    alt="AIDIENGL"
                    className="block dark:hidden w-full max-w-[240px] h-auto"
                  />
                  <img
                    src={AIDIENGLWhite}
                    alt="AIDIENGL"
                    className="hidden dark:block h-10 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-2">
                {/* Main Items */}
                {mainItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 text-base font-medium uppercase tracking-wide text-text-primary hover:text-accent-cyan"
                  >
                    {label}
                  </Link>
                ))}

                {/* Program Dropdown */}
                <MobileDropdown label="Program" items={programItems} />

                {/* More Dropdown */}
                <MobileDropdown label="More" items={moreItems} />
              </div>

              {/* Mobile Buttons */}
              <div className="mt-8 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="px-5 py-3 rounded-full text-sm font-semibold text-center border border-brand-navy/20 dark:border-white/20 text-brand-navy dark:text-white active:scale-95"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="px-5 py-3 rounded-full text-sm font-semibold text-center bg-accent-cyan text-brand-navy active:scale-95"
                >
                  Register
                </Link>
                <Link
                  to="/sponsors"
                  onClick={() => setOpen(false)}
                  className="px-5 py-3 rounded-full text-sm font-semibold text-center border border-accent-cyan text-accent-cyan active:scale-95"
                >
                  Sponsor
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
