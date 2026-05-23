import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sun, Moon, Menu } from "lucide-react";
import logoRainbow from "@/assets/aidifiln-logo-rainbow.png";
import logoNavy from "@/assets/aidifiln-lockup-navy.png";
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
          } rounded-full font-medium transition-colors text-text-primary hover:bg-accent-cyan/10 hover:text-accent-cyan`}
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
    <header className="fixed top-0 inset-x-0 z-40 bg-[#0A1128] border-b border-white/10">
      <div className="mx-auto max-w-[1200px] flex items-center justify-between gap-4 px-4 md:px-6 h-14 md:h-16">
        <a href="#home" aria-label="AIDIFILN — Home" className="flex items-center shrink-0">
          <img
            src={logoRainbow}
            alt="AIDIFILN"
            className="hidden dark:block h-7 md:h-8 w-auto select-none"
            loading="eager"
            decoding="async"
          />
          <img
            src={logoNavy}
            alt="AIDIFILN"
            className="block dark:hidden h-7 md:h-8 w-auto select-none"
            loading="eager"
            decoding="async"
          />
        </a>

        <div className="hidden md:block">
          <NavLinks />
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-accent-cyan/10 transition-colors text-text-secondary"
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

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-full hover:bg-accent-cyan/10 transition-colors text-text-secondary"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-full hover:bg-accent-cyan/10 transition-colors text-text-primary"
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
                  <img src={logoRainbow} alt="AIDIFILN" className="hidden dark:block h-8 w-auto" />
                  <img src={logoNavy} alt="AIDIFILN" className="block dark:hidden h-8 w-auto" />
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