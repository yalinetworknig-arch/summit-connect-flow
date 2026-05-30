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

import abiaLogo from "@/assets/hubs/abia.webp";
import anambraLogo from "@/assets/hubs/anambra.webp";
import benueLogo from "@/assets/hubs/benue.webp";
import bornoLogo from "@/assets/hubs/borno.webp";
import crossRiverLogo from "@/assets/hubs/cross-river.webp";
import deltaLogo from "@/assets/hubs/delta.webp";
import edoLogo from "@/assets/hubs/edo.webp";
import ekitiLogo from "@/assets/hubs/ekiti.webp";
import enuguLogo from "@/assets/hubs/enugu.webp";
import fctAbujaLogo from "@/assets/hubs/fct-abuja.webp";
import imoLogo from "@/assets/hubs/imo.webp";
import kadunaLogo from "@/assets/hubs/kaduna.webp";
import kebbiLogo from "@/assets/hubs/kebbi.webp";
import kogiLogo from "@/assets/hubs/kogi.webp";
import kwaraLogo from "@/assets/hubs/kwara.webp";
import lagosLogo from "@/assets/hubs/lagos.webp";
import nasarawaLogo from "@/assets/hubs/nasarawa.webp";
import ogunLogo from "@/assets/hubs/ogun.webp";
import ondoLogo from "@/assets/hubs/ondo.webp";
import osunLogo from "@/assets/hubs/osun.webp";
import oyoLogo from "@/assets/hubs/oyo.webp";
import plateauLogo from "@/assets/hubs/plateau.webp";
import sokotoLogo from "@/assets/hubs/sokoto.webp";

type Hub = {
  state: string;
  region: "North Central" | "North East" | "North West" | "South East" | "South South" | "South West" | "Federal Capital";
  coordinator?: string;
  focus?: string;
  logo?: string;
};

const hubs: Hub[] = [
  { state: "Abia", region: "South East", logo: abiaLogo },
  { state: "Adamawa", region: "North East" },
  { state: "Akwa Ibom", region: "South South" },
  { state: "Anambra", region: "South East", logo: anambraLogo },
  { state: "Bauchi", region: "North East" },
  { state: "Bayelsa", region: "South South" },
  { state: "Benue", region: "North Central", logo: benueLogo },
  { state: "Borno", region: "North East", logo: bornoLogo },
  { state: "Cross River", region: "South South", logo: crossRiverLogo },
  { state: "Delta", region: "South South", logo: deltaLogo },
  { state: "Ebonyi", region: "South East" },
  { state: "Edo", region: "South South", logo: edoLogo },
  { state: "Ekiti", region: "South West", logo: ekitiLogo },
  { state: "Enugu", region: "South East", logo: enuguLogo },
  { state: "FCT Abuja", region: "Federal Capital", logo: fctAbujaLogo },
  { state: "Gombe", region: "North East" },
  { state: "Imo", region: "South East", logo: imoLogo },
  { state: "Jigawa", region: "North West" },
  { state: "Kaduna", region: "North West", logo: kadunaLogo },
  { state: "Kano", region: "North West" },
  { state: "Katsina", region: "North West" },
  { state: "Kebbi", region: "North West", logo: kebbiLogo },
  { state: "Kogi", region: "North Central", logo: kogiLogo },
  { state: "Kwara", region: "North Central", logo: kwaraLogo },
  { state: "Lagos", region: "South West", logo: lagosLogo },
  { state: "Nasarawa", region: "North Central", logo: nasarawaLogo },
  { state: "Niger", region: "North Central" },
  { state: "Ogun", region: "South West", logo: ogunLogo },
  { state: "Ondo", region: "South West", logo: ondoLogo },
  { state: "Osun", region: "South West", logo: osunLogo },
  { state: "Oyo", region: "South West", logo: oyoLogo },
  { state: "Plateau", region: "North Central", logo: plateauLogo },
  { state: "Rivers", region: "South South" },
  { state: "Sokoto", region: "North West", logo: sokotoLogo },
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
      className="group w-full rounded-2xl border p-4 flex flex-col items-center justify-center gap-3 h-[200px] md:h-[220px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[color:var(--brand-accent,#079992)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border-strong)",
      }}
      aria-label={`View ${hub.state} State Hub details`}
    >
      <div
        className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-bold text-white overflow-hidden bg-white ring-1 ring-black/5 shadow-[0_6px_18px_-8px_rgba(10,61,98,0.35)] group-hover:shadow-[0_10px_24px_-10px_rgba(7,153,146,0.55)] transition-shadow"
        style={
          hub.logo
            ? undefined
            : {
                background:
                  "linear-gradient(135deg, var(--brand-primary, #0a3d62), var(--brand-accent, #079992))",
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "20px",
              }
        }
        aria-hidden="true"
      >
        {hub.logo ? (
          <img
            src={hub.logo}
            alt={`YALI Network ${hub.state} logo`}
            className="w-full h-full object-contain p-1"
            loading="lazy"
            decoding="async"
          />
        ) : (
          initials(hub.state)
        )}
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
                      className="w-28 h-28 rounded-full flex items-center justify-center font-bold text-white overflow-hidden bg-white ring-1 ring-black/5 shadow-[0_8px_20px_-10px_rgba(10,61,98,0.4)] shrink-0"
                      style={
                        selected.logo
                          ? undefined
                          : {
                              background:
                                "linear-gradient(135deg, var(--brand-primary, #0a3d62), var(--brand-accent, #079992))",
                              fontFamily: "Space Grotesk, sans-serif",
                              fontSize: "24px",
                            }
                      }
                    >
                      {selected.logo ? (
                        <img
                          src={selected.logo}
                          alt={`YALI Network ${selected.state} logo`}
                          className="w-full h-full object-contain p-1.5"
                        />
                      ) : (
                        initials(selected.state)
                      )}
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