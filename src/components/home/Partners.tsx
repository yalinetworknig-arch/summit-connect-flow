import { useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import hpLogo from "@/assets/sponsors/hp-logo.png";
import usEmbassySeal from "@/assets/sponsors/us-embassy-seal.png";
import usDiplomaticMission from "@/assets/sponsors/us-diplomatic-mission.jpeg";
import mwfaanLogo from "@/assets/sponsors/mwfaan-logo.png";
import unfpaLogo from "@/assets/sponsors/unfpa-logo.png";

type Partner = { name: string; logo: string };

const partners: Partner[] = [
  { name: "Embassy of the United States, Nigeria", logo: usEmbassySeal },
  { name: "United States Diplomatic Mission in Nigeria", logo: usDiplomaticMission },
  { name: "Mandela Washington Fellowship Alumni Association of Nigeria", logo: mwfaanLogo },
  { name: "HP", logo: hpLogo },
  { name: "UNFPA", logo: unfpaLogo },
];

function LogoCard({ name, logo }: Partner) {
  return (
    <div
      className="rounded-xl border p-4 flex items-center justify-center h-[120px]"
      style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}
    >
      <img
        src={logo}
        alt={`${name} logo`}
        width={200}
        height={100}
        loading="lazy"
        className="max-h-[80px] object-contain bg-white/95 rounded-md p-2"
      />
    </div>
  );
}

export function Partners() {
  const autoplay = useRef(
    Autoplay({ delay: 2200, stopOnInteraction: false, stopOnMouseEnter: true }),
  );
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [autoplay.current],
  );

  // duplicate the list so the loop is visually seamless even with few items
  const items = [...partners, ...partners];

  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-center font-bold mb-12"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "32px",
            color: "var(--text-primary)",
          }}
        >
          Partners From Our Previous Edition
        </h2>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {items.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex-[0_0_50%] sm:flex-[0_0_33.333%] lg:flex-[0_0_25%] min-w-0"
              >
                <LogoCard name={p.name} logo={p.logo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}