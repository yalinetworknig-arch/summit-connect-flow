import { Outlet } from "@tanstack/react-router";
import { SideDrawer } from "./SideDrawer";
import { BottomTabBar } from "./BottomTabBar";

export function AppShell() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)", color: "var(--text-primary)" }}>
      <SideDrawer />
      <main className="md:ml-60 min-h-screen pb-16 md:pb-0 overflow-y-auto">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}