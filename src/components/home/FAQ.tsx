import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is YALI Summit?",
    a: "The YALI Network Nigeria National Summit (AIDIFILN) is the country's largest annual gathering of young leaders working at the intersection of AI, digital innovation and inclusive leadership.",
  },
  {
    q: "When does it take place?",
    a: "Friday 11 to Monday 14 September 2026, with a 4-day program of keynotes, sector tracks, workshops and a closing showcase.",
  },
  {
    q: "Who should attend?",
    a: "Active YALI Network members, founders, policymakers, civil-society leaders, sponsors, media, and members of the public who are passionate about Nigeria's digital future.",
  },
  {
    q: "What are the sector tracks?",
    a: "Seven tracks: Health, Agriculture, Education, FinTech & Inclusive Finance, Energy & Climate, Governance & Policy, and Creative Economy.",
  },
  {
    q: "How do I register?",
    a: "Click 'Register Now' on this page and complete the 5-step registration. Free for YALI delegates; paid for general public.",
  },
  {
    q: "Is there a fee?",
    a: "Verified YALI delegates attend free. General public tickets are ₦15,000 (early bird, until 30 June 2026) and ₦20,000 thereafter.",
  },
  {
    q: "Where is the venue?",
    a: "Eko Convention Centre, Eko Hotels & Suites, Victoria Island, Lagos. Travel and accommodation support is available for selected delegates.",
  },
  {
    q: "How do I sponsor?",
    a: "Visit the Sponsors page or email partnerships@summit.yalinetwork.ng for the sponsor prospectus and tier options.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-center font-bold mb-10"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "32px",
            color: "var(--text-primary)",
          }}
        >
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="rounded-lg border px-4"
              style={{ borderColor: "var(--border-strong)" }}
            >
              <AccordionTrigger
                className="text-left hover:no-underline data-[state=open]:text-[var(--accent-cyan)] [&>svg]:text-[var(--accent-cyan)]"
                style={{ color: "var(--text-primary)" }}
              >
                {f.q}
              </AccordionTrigger>
              <AccordionContent style={{ color: "var(--text-secondary)" }}>
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}