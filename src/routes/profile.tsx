import { createFileRoute, Link } from "@tanstack/react-router";
import { UserCircle } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — YALI Network Nigeria" },
      { name: "description", content: "Your registration status and settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <section className="px-6 py-20 md:py-28 bg-background text-text-primary">
      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-flex w-14 h-14 rounded-2xl bg-accent-cyan/10 items-center justify-center mb-5">
          <UserCircle className="w-7 h-7 text-accent-cyan" />
        </span>
        <p className="text-accent-cyan font-semibold tracking-widest uppercase text-sm mb-3">
          Coming soon
        </p>
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
          Your AIDIFILN profile.
        </h1>
        <p className="text-text-secondary mb-8">
          Once accounts go live you'll see your ticket QR code, track choice,
          schedule bookmarks and check-in status here.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-full text-base font-semibold bg-accent-cyan text-brand-navy hover:scale-[1.02] transition-transform"
          >
            Register
          </Link>
          <Link
            to="/summit"
            className="inline-flex items-center justify-center px-6 min-h-12 rounded-full text-base font-semibold border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 transition-colors"
          >
            Summit hub
          </Link>
        </div>
      </div>
    </section>
  );
}