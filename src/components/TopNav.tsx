import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Sun, Moon } from "lucide-react";

const items = [
  { to: "/", label: "Home" },
  { to: "/summit", label: "Summit" },
  { to: "/schedule", label: "Schedule" },
  { to: "/network", label: "Network" },
  { to: "/sponsors", label: "Sponsors" },
  { to: "/profile", label: "Profile" },
];

export function TopNav() {
  const [isDark, setIsDark] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header
      className="hidden md:flex fixed top-0 inset-x-0 z-40 h-16 items-center justify-between px-8 border-b backdrop-blur-md"
      style={{
        background: "color-mix(in oklab, var(--surface) 85%, transparent)",
        borderColor: "var(--border)",
      }}
    >
      <Link to="/" className="text-rainbow font-bold text-2xl" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
        YALI NG
      </Link>

      <nav className="flex items-center gap-1">
        {items.map(({ to, label }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: active ? "var(--accent-cyan)" : "var(--text-primary)",
                background: active ? "color-mix(in oklab, var(--accent-cyan) 10%, transparent)" : "transparent",
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          style={{ color: "var(--text-secondary)" }}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <Link
          to="/register"
          className="px-5 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105"
          style={{ background: "var(--accent-cyan)", color: "var(--text-primary)" }}
        >
          Register Free
        </Link>
      </div>
    </header>
  );
}