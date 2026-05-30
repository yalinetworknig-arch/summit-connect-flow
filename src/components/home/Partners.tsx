type Partner = { name: string; logo: string };

const titleSponsor: Partner = {
  name: "HP",
  logo: "https://upload.wikimedia.org/wikipedia/commons/a/ad/HP_logo_2012.svg",
};
const keySponsors: Partner[] = [
  {
    name: "U.S. Mission Nigeria",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seal_of_an_Embassy_of_the_United_States_of_America.svg/1200px-Seal_of_an_Embassy_of_the_United_States_of_America.svg.png",
  },
  {
    name: "U.S. Consulate General Lagos",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Seal_of_a_Consulate_General_of_the_United_States_of_America.svg/1200px-Seal_of_a_Consulate_General_of_the_United_States_of_America.svg.png",
  },
  {
    name: "UNFPA",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/UNFPA_logo.svg/1200px-UNFPA_logo.svg.png",
  },
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
        className="grayscale hover:grayscale-0 transition duration-300 max-h-[80px] object-contain bg-white/90 rounded-md p-2"
      />
    </div>
  );
}

function Group({ heading, items, cols }: { heading: string; items: Partner[]; cols: string }) {
  return (
    <div>
      <h3
        className="text-center text-sm uppercase tracking-widest mb-6"
        style={{ color: "var(--text-secondary)" }}
      >
        {heading}
      </h3>
      <div className={`grid gap-6 ${cols}`}>
        {items.map((i) => (
          <LogoCard key={i.name} name={i.name} logo={i.logo} />
        ))}
      </div>
    </div>
  );
}

export function Partners() {
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
        <div className="space-y-12">
          <Group heading="Title Sponsor" items={[titleSponsor]} cols="grid-cols-1 max-w-sm mx-auto" />
          <Group heading="Partners" items={keySponsors} cols="grid-cols-1 sm:grid-cols-3" />
        </div>
      </div>
    </section>
  );
}