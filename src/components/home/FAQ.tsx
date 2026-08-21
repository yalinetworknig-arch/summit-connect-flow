import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is AIDIFILN 2026?",
    a: "A 2-day summit where civic leaders, educators, founders, and policymakers across Nigeria's 36 states convene to lead how AI and digital systems get built. Not a conference. A working session with commitments that outlive it.",
  },
  {
    q: "When does it happen?",
    a: "Delegates arrive Thursday, September 24. The summit runs Friday 25 to Saturday 26, 2026 — keynotes, seven sector tracks, workshops, a civic-tech hackathon, and a commitments showcase.",
  },
  {
    q: "Who comes?",
    a: "Civic servants, educators, social-impact founders, community organisers, public-sector leaders, media. Anyone building or governing for Nigerian communities. You don't need a YALI credential.",
  },
  {
    q: "Do I have to be YALI-verified to attend?",
    a: "No. Verified YALI delegates attend free. General public registration costs ₦15,000 early-bird (until 30 June 2026), ₦20,000 standard.",
  },
  {
    q: "What tracks run?",
    a: "Seven sector rooms: Health & Wellbeing, Agriculture & Food, Education & Skills, FinTech & Inclusive Finance, Energy & Climate, Governance & Policy, Creative Economy.",
  },
  {
    q: "How do I register?",
    a: 'Click "Claim your seat" and step through the registration form. Takes about three minutes.',
  },
  {
    q: "What's the cost breakdown?",
    a: "Free for verified YALI delegates. General public: ₦15,000 early-bird through 30 June 2026, then ₦20,000. Includes all sessions, materials, two days of meals.",
  },
  {
    q: "Where is it?",
    a: "UNILAG Main Auditorium, Akoka Lagos. Travel support and accommodation for selected delegates from outside Lagos.",
  },
  {
    q: "What do I actually leave with?",
    a: "Named commitments drafted in your sector room. The people and orgs committed to deliver them. A 12-month follow-through plan owned by YALI Network Nigeria. No tote bags.",
  },
  {
    q: "How do I sponsor or partner?",
    a: "Go to Sponsors, pick a tier, or tell us the outcome you want. We'll reply within 48 hours. Email partnerships@summit.yalinetwork.ng.",
  },
];

export function FAQ() {
  return (
    <section className="py-16 md:py-24 px-6" style={{ background: "var(--surface)" }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--text-secondary)",
              marginBottom: "12px",
            }}
          >
            Essentials
          </p>
          <h2
            className="font-bold"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(28px, 4vw, 42px)",
              color: "var(--text-primary)",
              lineHeight: 1.1,
            }}
          >
            Get answers.
          </h2>
        </div>
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