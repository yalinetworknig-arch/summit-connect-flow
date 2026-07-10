import {
  HeartPulse,
  Sprout,
  GraduationCap,
  Landmark,
  Zap,
  ScrollText,
  Palette,
  type LucideIcon,
} from "lucide-react";

export type TrackDetail = {
  slug: string;
  title: string;
  short: string;
  long: string;
  sessions: string[];
  Icon: LucideIcon;
};

export const TRACK_DETAILS: TrackDetail[] = [
  {
    slug: "health",
    title: "Health & Wellbeing",
    short: "Digital health, AI in diagnostics, equitable access.",
    long: "Care gaps don't close themselves. This room maps the AI tools, data and partnerships that get Nigerian innovators from a working pilot to a national-scale public-health win.",
    sessions: [
      "AI for early disease detection in low-resource clinics",
      "Femtech and maternal-health innovation",
      "Scaling tele-mental-health across Nigeria",
    ],
    Icon: HeartPulse,
  },
  {
    slug: "agriculture",
    title: "Agriculture & Food",
    short: "AgriTech, climate-smart farming, food security.",
    long: "Smallholder farmers feed Nigeria, but the data, capital and cold-chain don't reach them. This room names the tools and financing models that make agriculture the next growth engine — not the next casualty.",
    sessions: [
      "Satellite + AI for smallholder yield forecasting",
      "Cold-chain logistics for perishables",
      "Climate-resilient seed systems",
    ],
    Icon: Sprout,
  },
  {
    slug: "education",
    title: "Education & Skills",
    short: "EdTech, AI literacy, future-of-work skills.",
    long: "100 million young Nigerians need to be ready for an AI-shaped economy yesterday. Practitioners share what's actually moving the needle in classrooms, bootcamps and on-the-job learning — and what to stop funding.",
    sessions: [
      "AI literacy that survives secondary-school reality",
      "Bootcamps that actually lead to jobs",
      "Inclusive learning for out-of-school youth",
    ],
    Icon: GraduationCap,
  },
  {
    slug: "fintech",
    title: "FinTech & Inclusive Finance",
    short: "Payments, lending, Naira-native digital products.",
    long: "Lagos is Africa's fintech capital. The next chapter — embedded finance, agency banking, credit for the underbanked — gets written here, with the founders and regulators in the same room.",
    sessions: [
      "Building for the next 50 million bank accounts",
      "Open banking and the new CBN guidelines",
      "Alternative credit scoring with AI",
    ],
    Icon: Landmark,
  },
  {
    slug: "energy",
    title: "Energy & Climate",
    short: "Renewables, climate adaptation, green jobs.",
    long: "Grid power isn't coming fast enough. This room covers off-grid solar, productive use of electricity, and the policy levers that turn a just transition from a deck slide into a delivered MW.",
    sessions: [
      "Solar mini-grids as economic infrastructure",
      "Financing the green-jobs pipeline",
      "Climate adaptation for coastal communities",
    ],
    Icon: Zap,
  },
  {
    slug: "governance",
    title: "Governance & Policy",
    short: "AI policy, digital rights, accountable institutions.",
    long: "Rules decide who AI works for. Lawmakers, civil society and technologists sit at the same table to draft AI policy and digital-rights frameworks Nigerians can actually defend.",
    sessions: [
      "Drafting Nigeria's AI strategy",
      "Civic tech that actually moves policy",
      "Digital identity, done right",
    ],
    Icon: ScrollText,
  },
  {
    slug: "creative",
    title: "Creative Economy",
    short: "Film, music, fashion, gaming, IP-driven creators.",
    long: "Nollywood, Afrobeats, Nigerian fashion and gaming already export. The work now is keeping the IP, the distribution and the AI tooling in Nigerian hands — and getting paid like it.",
    sessions: [
      "AI tools in the Nollywood pipeline",
      "Music rights and monetisation in Africa",
      "Building game studios from Lagos",
    ],
    Icon: Palette,
  },
];

export type ScheduleDay = {
  day: string;
  date: string;
  theme: string;
  blocks: { time: string; title: string; description: string }[];
};

export const SCHEDULE: ScheduleDay[] = [
  {
    day: "Arrival",
    date: "Thu · Sept 24, 2026",
    theme: "Land, settle in, connect",
    blocks: [
      { time: "All day", title: "Delegate arrival & check-in", description: "Fly or drive in, get settled at your accommodation, and pick up your badge, swag and track briefing pack." },
      { time: "18:00 – 21:00", title: "Informal meetup", description: "Casual welcome mixer for early arrivals — meet your YALI cohort lead and fellow delegates before the summit opens." },
    ],
  },
  {
    day: "Day 1",
    date: "Fri · Sept 25, 2026",
    theme: "Understand → Build",
    blocks: [
      { time: "08:00 – 09:00", title: "Registration & badge pickup", description: "For delegates arriving morning-of. Coffee and networking in the main hall." },
      { time: "09:00 – 10:30", title: "Opening keynote", description: "YALI Network Nigeria leadership opens the summit, followed by the headline address on AI and inclusive leadership." },
      { time: "11:00 – 13:00", title: "Plenary: State of AI in Nigeria", description: "A data-led read of where we are, where the capital is moving, and what's blocking scale." },
      { time: "14:00 – 16:30", title: "Track sessions · Round 1", description: "Health, Agriculture, Education, FinTech, Energy, Governance and Creative Economy rooms run in parallel. Pick one and commit." },
      { time: "17:00 – 18:30", title: "Fireside chats", description: "Founders and policymakers, on the record. No deck-reading." },
      { time: "19:00 – 21:30", title: "Welcome reception", description: "Working dinner with sponsors, alumni and invited dignitaries — name-tagged by track." },
    ],
  },
  {
    day: "Day 2",
    date: "Sat · Sept 26, 2026",
    theme: "Build → Lead",
    blocks: [
      { time: "09:00 – 12:00", title: "Hands-on workshops & hackathon", description: "Build with AI, ship a product, draft a policy memo. Practitioner-led, laptop-required. Cross-disciplinary teams tackle a real sector challenge — mentors on the floor, judges in the room." },
      { time: "13:00 – 15:00", title: "Hackathon final pitches", description: "Top teams pitch to a panel of investors, policymakers and operators. Cheques, MOUs and pilot slots on the line." },
      { time: "15:30 – 17:00", title: "Closing keynote", description: "Public commitments from delegates, sponsors and partners — recorded, published, and tracked for 12 months." },
      { time: "17:00 – 18:00", title: "Farewell and follow-through", description: "Year-round YALI programming, your post-summit cohort plan, and a first look at AIDIFILN 2027." },
      { time: "19:00 – 22:00", title: "Cultural night", description: "Afrobeats, Nollywood shorts, a fashion showcase. The reason the world keeps watching Nigeria." },
    ],
  },
];

export type SponsorTier = {
  name: string;
  price: string;
  highlight: boolean;
  benefits: string[];
};

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    name: "Community",
    price: "₦150K",
    highlight: false,
    benefits: [
      "Name on the partner wall",
      "1 shared mention across our platforms",
      "A community appreciation post",
      "1 delegate pass",
    ],
  },
  {
    name: "Bronze",
    price: "₦250K – ₦500K",
    highlight: false,
    benefits: [
      "Everything in Community",
      "Logo on event signage",
      "1 social media post + logo on delegate materials",
      "An insert in the delegate kit",
      "2 delegate passes",
    ],
  },
  {
    name: "Silver",
    price: "₦1M – ₦2.9M",
    highlight: false,
    benefits: [
      "Everything in Bronze",
      "\"Supported by\" status",
      "3 social posts + 1 advertorial slot",
      "Shared signage, Cultural Night mention, track shoutout",
      "3 delegate passes",
    ],
  },
  {
    name: "Gold",
    price: "₦5M – ₦7M",
    highlight: true,
    benefits: [
      "Everything in Silver",
      "Co-sponsor status",
      "2+ press releases, TV mentions, 6 social posts",
      "Standard exhibition booth, panel seat, CSR feature story",
      "6 delegate passes",
    ],
  },
  {
    name: "Platinum",
    price: "₦7M – ₦10M+",
    highlight: false,
    benefits: [
      "Everything in Gold",
      "Title sponsor + main stage branding",
      "Full press kit, homepage takeover, 10+ social posts, branded jingle & airtime",
      "Premium exhibition booth, opening remarks invite, 20-min keynote slot",
      "10 delegate passes",
    ],
  },
];

export const SPONSOR_TIER_OPTIONS = SPONSOR_TIERS.map((t) => t.name);
export const BUDGET_RANGES = [
  "Under ₦150K",
  "₦150K – ₦500K",
  "₦500K – ₦2.9M",
  "₦2.9M – ₦7M",
  "Over ₦7M",
  "Let's discuss",
];
export const DECISION_TIMELINES = [
  "Within 2 weeks",
  "Within 1 month",
  "1–3 months",
  "Exploring only",
];