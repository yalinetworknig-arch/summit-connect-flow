import { Outlet } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { BottomTabBar } from "./BottomTabBar";

export function AppShell() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--text-primary)" }}>
      <TopNav />
      <main className="min-h-screen pt-0 md:pt-16 pb-16 md:pb-0 overflow-y-auto">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}