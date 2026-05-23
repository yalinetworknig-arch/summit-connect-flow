const titleSponsor = { name: "First Bank Nigeria" };
const keySponsors = [
  { name: "MTN Nigeria" },
  { name: "Microsoft Africa" },
  { name: "Dangote Group" },
];
const partners = [
  { name: "Andela" },
  { name: "Flutterwave" },
  { name: "Paystack" },
  { name: "Interswitch" },
  { name: "NITDA" },
  { name: "Co-Creation Hub" },
];

function logoUrl(name: string) {
  return `https://placehold.co/200x100/141B2D/94A3B8?text=${encodeURIComponent(name)}`;
}

function LogoCard({ name }: { name: string }) {
  return (
    <div
      className="rounded-xl border p-4 flex items-center justify-center h-[120px]"
      style={{ background: "var(--surface)", borderColor: "var(--border-strong)" }}
    >
      <img
        src={logoUrl(name)}
        alt={`${name} logo`}
        width={200}
        height={100}
        loading="lazy"
        className="grayscale hover:grayscale-0 transition duration-300 max-h-[80px] object-contain"
      />
    </div>
  );
}

function Group({ heading, items, cols }: { heading: string; items: Array<{ name: string }>; cols: string }) {
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
          <LogoCard key={i.name} name={i.name} />
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
          <Group heading="Key Sponsors" items={keySponsors} cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
          <Group heading="Partners" items={partners} cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </div>
    </section>
  );
}