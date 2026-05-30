import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay";

type Hub = {
  state: string;
  region: "North Central" | "North East" | "North West" | "South East" | "South South" | "South West" | "Federal Capital";
  coordinator?: string;
  focus?: string;
};

const hubs: Hub[] = [
  { state: "Abia", region: "South East" },
  { state: "Adamawa", region: "North East" },
  { state: "Akwa Ibom", region: "South South" },
  { state: "Anambra", region: "South East" },
  { state: "Bauchi", region: "North East" },
  { state: "Bayelsa", region: "South South" },
  { state: "Benue", region: "North Central" },
  { state: "Borno", region: "North East" },
  { state: "Cross River", region: "South South" },
  { state: "Delta", region: "South South" },
  { state: "Ebonyi", region: "South East" },
  { state: "Edo", region: "South South" },
  { state: "Ekiti", region: "South West" },
  { state: "Enugu", region: "South East" },
  { state: "FCT Abuja", region: "Federal Capital" },
  { state: "Gombe", region: "North East" },
  { state: "Imo", region: "South East" },
  { state: "Jigawa", region: "North West" },
  { state: "Kaduna", region: "North West" },
  { state: "Kano", region: "North West" },
  { state: "Katsina", region: "North West" },
  { state: "Kebbi", region: "North West" },
  { state: "Kogi", region: "North Central" },
  { state: "Kwara", region: "North Central" },
  { state: "Lagos", region: "South West" },
  { state: "Nasarawa", region: "North Central" },
  { state: "Niger", region: "North Central" },
  { state: "Ogun", region: "South West" },
  { state: "Ondo", region: "South West" },
  { state: "Osun", region: "South West" },
  { state: "Oyo", region: "South West" },
  { state: "Plateau", region: "North Central" },
  { state: "Rivers", region: "South South" },
  { state: "Sokoto", region: "North West" },
  { state: "Taraba", region: "North East" },
  { state: "Yobe", region: "North East" },
  { state: "Zamfara", region: "North West" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function HubCard({ hub, onSelect }: { hub: Hub; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group w-full rounded-xl border p-4 flex flex-col items-center justify-center gap-3 h-[160px] transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border-strong)",
      }}
      aria-label={`View ${hub.state} State Hub details`}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white shadow-md"
        style={{
          background:
            "linear-gradient(135deg, var(--brand-primary, #0a3d62), var(--brand-accent, #079992))",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "18px",
        }}
        aria-hidden="true"
      >
        {initials(hub.state)}
      </div>
      <div className="text-center">
        <div
          className="font-semibold text-sm leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {hub.state}
        </div>
        <div
          className="text-[11px] uppercase tracking-wider mt-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {hub.region}
        </div>
      </div>
    </button>
  );
}

export function StateHubs() {
  const [selected, setSelected] = useState<Hub | null>(null);

  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "var(--surface-muted, var(--background))" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            Convening Partners
          </p>
          <h2
            className="font-bold"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "32px",
              color: "var(--text-primary)",
            }}
          >
            YALI Network Nigeria State Hubs
          </h2>
          <p
            className="mt-3 max-w-2xl mx-auto text-sm md:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            36 states and the FCT — tap any hub to learn more about its work in
            your region.
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 3500, stopOnInteraction: true })]}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {hubs.map((hub) => (
              <CarouselItem
                key={hub.state}
                className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <HubCard hub={hub} onSelect={() => setSelected(hub)} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>

        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-md">
            {selected && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand-primary, #0a3d62), var(--brand-accent, #079992))",
                        fontFamily: "Space Grotesk, sans-serif",
                      }}
                    >
                      {initials(selected.state)}
                    </div>
                    <div>
                      <DialogTitle className="text-left">
                        {selected.state} State Hub
                      </DialogTitle>
                      <p
                        className="text-xs uppercase tracking-wider mt-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {selected.region}
                      </p>
                    </div>
                  </div>
                  <DialogDescription className="text-left pt-2">
                    The {selected.state} State Hub of YALI Network Nigeria
                    mobilises young leaders across the {selected.region} region
                    around civic engagement, digital innovation, and inclusive
                    leadership ahead of the AIDIFILN 2026 Summit.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 pt-4 border-t text-sm" style={{ color: "var(--text-secondary)" }}>
                  Interested in connecting with this hub? Reach out via{" "}
                  <a
                    href="mailto:yalinetworknig@gmail.com"
                    className="font-medium underline"
                    style={{ color: "var(--text-primary)" }}
                  >
                    yalinetworknig@gmail.com
                  </a>
                  .
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}