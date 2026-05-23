import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sun, Moon, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

const items = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/schedule", label: "Schedule" },
  { to: "/tracks", label: "Tracks" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/contact", label: "Contact" },
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
  pathname,
  onNavigate,
  vertical,
}: {
  pathname: string;
  onNavigate?: () => void;
  vertical?: boolean;
}) {
  return (
    <nav className={vertical ? "flex flex-col gap-1" : "flex items-center gap-1"}>
      {items.map(({ to, label }) => {
        const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`${vertical ? "px-3 py-3 text-base" : "px-4 py-2 text-sm"} rounded-lg font-medium transition-colors ${
              active
                ? "text-accent-cyan bg-accent-cyan/10"
                : "text-text-primary hover:bg-white/5"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function TopNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 inset-x-0 z-40 h-16 border-b border-border-strong backdrop-blur-md bg-surface/85"
    >
      <div className="max-w-7xl mx-auto h-full px-4 md:px-8 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="text-rainbow font-bold text-2xl font-display"
        >
          AIDIFILN
        </Link>

        <div className="hidden md:block">
          <NavLinks pathname={pathname} />
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-secondary"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link
            to="/register"
            className="px-5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105 active:scale-95 bg-accent-cyan text-brand-navy"
          >
            Register
          </Link>
          <Link
            to="/sponsors"
            className="px-5 py-2 rounded-full text-sm font-semibold border border-accent-cyan text-accent-cyan transition-colors hover:bg-accent-cyan/10"
          >
            Sponsor
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-secondary"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-primary"
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
                <SheetTitle
                  className="text-rainbow text-2xl font-bold text-left font-display"
                >
                  AIDIFILN
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-6">
                <NavLinks
                  pathname={pathname}
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
                  <Link
                    to="/sponsors"
                    onClick={() => setOpen(false)}
                    className="px-5 py-3 rounded-full text-sm font-semibold text-center border border-accent-cyan text-accent-cyan"
                  >
                    Sponsor
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}