import { Outlet } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { BottomTabBar } from "@/components/BottomTabBar";

export function AppShell() {
  return (
    <div className="min-h-dvh bg-background text-text-primary">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-cyan focus:text-brand-navy focus:rounded focus:font-semibold"
      >
        Skip to main content
      </a>
      <TopNav />
      <main id="main-content" className="pt-24 md:pt-28 pb-20 md:pb-0 min-h-dvh">
        <Outlet />
      </main>
      <Footer />
      <BottomTabBar />
    </div>
  );
}