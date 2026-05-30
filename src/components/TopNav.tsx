import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sun, Moon, Menu } from "lucide-react";
import logoRainbow from "@/assets/aidifiln-logo-rainbow.png";
import lockupFull from "@/assets/aidifiln-lockup-full.png";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

const items = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#schedule", label: "Schedule" },
  { href: "#tracks", label: "Tracks" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#contact", label: "Contact" },
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

function NavLinks({
  onNavigate,
  vertical,
}: {
  onNavigate?: () => void;
  vertical?: boolean;
}) {
  return (
    <nav className={vertical ? "flex flex-col gap-1" : "flex items-center gap-1"}>
      {items.map(({ href, label }) => (
        <a
          key={href}
          href={href}
          onClick={onNavigate}
          className={`${
            vertical ? "px-3 py-3 text-base" : "px-4 py-2 text-sm"
          } font-medium uppercase tracking-wide transition-colors ${
            vertical
              ? "text-text-primary hover:text-accent-cyan"
              : "text-brand-navy/80 hover:text-accent-cyan dark:text-white/80 dark:hover:text-[#00D9FF]"
          } relative after:absolute after:left-3 after:right-3 after:bottom-0 after:h-0.5 after:bg-accent-cyan after:scale-x-0 hover:after:scale-x-100 after:transition-transform`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

export function TopNav() {
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-3 md:top-5 inset-x-0 z-40 px-3 md:px-6 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-[1180px] flex items-center justify-between gap-4 px-3 md:px-5 h-14 md:h-16 rounded-full border border-brand-navy/10 dark:border-white/10 bg-white/85 dark:bg-[#0A1128]/70 backdrop-blur-xl shadow-[0_10px_40px_-12px_rgba(15,27,61,0.18)] dark:shadow-[0_10px_40px_-12px_rgba(0,0,0,0.6)]">
        <a href="#home" aria-label="AIDIFILN — Home" className="flex items-center shrink-0">
          <img
            src={lockupFull}
            alt="AIDIFILN"
            className="block dark:hidden h-9 md:h-11 w-auto select-none"
            loading="eager"
            decoding="async"
          />
          <img
            src={logoRainbow}
            alt="AIDIFILN"
            className="hidden dark:block h-10 md:h-12 w-auto select-none"
            loading="eager"
            decoding="async"
          />
        </a>

        <div className="hidden lg:block">
          <NavLinks />
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-accent-cyan/10 transition-colors text-brand-navy/70 dark:text-white/80"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link
            to="/register"
            className="px-5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95 bg-accent-cyan text-brand-navy shadow-elegant"
          >
            Register
          </Link>
        </div>

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
              className="w-full sm:max-w-sm bg-surface border-border-strong"
            >
              <SheetHeader>
                <SheetTitle className="text-left">
                  <img
                    src={lockupFull}
                    alt="AIDIFILN"
                    className="block dark:hidden w-full max-w-[240px] h-auto"
                  />
                  <img
                    src={logoRainbow}
                    alt="AIDIFILN"
                    className="hidden dark:block h-10 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-6">
                <NavLinks
                  vertical
                  onNavigate={() => setOpen(false)}
                />
                <div className="flex flex-col gap-3">
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="px-5 py-3 rounded-full text-sm font-semibold text-center bg-accent-cyan text-brand-navy active:scale-95"
                  >
                    Register
                  </Link>
                  <a
                    href="#sponsors"
                    onClick={() => setOpen(false)}
                    className="px-5 py-3 rounded-full text-sm font-semibold text-center border border-accent-cyan text-accent-cyan"
                  >
                    Sponsor
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}