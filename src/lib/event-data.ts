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
    long: "From AI-assisted triage to community-driven mental-health platforms, this track explores how Nigerian innovators are closing care gaps and building resilient public-health systems.",
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
    long: "Smallholder farmers feed the country. We unpack the tools, financing models and data infrastructure that turn agriculture into Nigeria's next growth engine.",
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
    long: "How do we equip 100 million young Nigerians for an AI-shaped economy? Practitioners share what's working in classrooms, bootcamps and on-the-job learning.",
    sessions: [
      "AI literacy in secondary schools",
      "Bootcamps that actually lead to jobs",
      "Inclusive learning for out-of-school youth",
    ],
    Icon: GraduationCap,
  },
  {
    slug: "fintech",
    title: "FinTech & Inclusive Finance",
    short: "Payments, lending, Naira-native digital products.",
    long: "Africa's fintech capital meets its next chapter — embedded finance, agency banking, regulation, and credit for the underbanked.",
    sessions: [
      "Building for the next 50 million bank accounts",
      "Open banking & the new CBN guidelines",
      "Alternative credit scoring with AI",
    ],
    Icon: Landmark,
  },
  {
    slug: "energy",
    title: "Energy & Climate",
    short: "Renewables, climate adaptation, green jobs.",
    long: "Off-grid solar, productive use of electricity, and the policy levers needed for a just energy transition across Nigeria.",
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
    long: "The rules of the game matter. Lawmakers, civil society, and technologists meet to shape AI policy and digital-rights frameworks for Nigeria.",
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
    long: "Nollywood, Afrobeats, Nigerian fashion and gaming are global. We dig into the IP, distribution and AI tooling powering the creator economy.",
    sessions: [
      "AI tools in the Nollywood pipeline",
      "Music rights & monetisation in Africa",
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
    day: "Day 1",
    date: "Thu · Sept 10, 2026",
    theme: "Arrivals & Opening Ceremony",
    blocks: [
      { time: "12:00 – 17:00", title: "Delegate check-in", description: "Lagos venue accreditation, swag pickup, and YALI member meet & greet." },
      { time: "18:00 – 19:30", title: "Opening keynote", description: "Welcome from YALI Network Nigeria leadership and a headline address on AI & inclusive leadership." },
      { time: "19:30 – 21:30", title: "Welcome reception", description: "Networking dinner with sponsors, alumni and invited dignitaries." },
    ],
  },
  {
    day: "Day 2",
    date: "Fri · Sept 11, 2026",
    theme: "Sector Tracks — Deep Dives",
    blocks: [
      { time: "09:00 – 10:00", title: "Plenary: State of AI in Nigeria", description: "A data-driven look at where we are and where we're heading." },
      { time: "10:30 – 13:00", title: "Parallel track sessions (Round 1)", description: "Health · Agriculture · Education · FinTech run in parallel rooms." },
      { time: "14:00 – 16:30", title: "Parallel track sessions (Round 2)", description: "Energy · Governance · Creative Economy run in parallel rooms." },
      { time: "17:00 – 18:30", title: "Fireside chats", description: "Founders and policymakers in candid conversation." },
    ],
  },
  {
    day: "Day 3",
    date: "Sat · Sept 12, 2026",
    theme: "Workshops & Hackathon",
    blocks: [
      { time: "09:00 – 12:30", title: "Hands-on workshops", description: "Build with AI, ship a product, pitch a policy memo — practitioner-led labs." },
      { time: "13:30 – 17:00", title: "AIDIFILN Hackathon", description: "Cross-disciplinary teams tackle a sector challenge. Mentors on the floor." },
      { time: "19:00 – 22:00", title: "Cultural night", description: "Afrobeats, Nollywood shorts, fashion showcase — celebrating Nigerian creativity." },
    ],
  },
  {
    day: "Day 4",
    date: "Sun · Sept 13, 2026",
    theme: "Showcase & Closing",
    blocks: [
      { time: "10:00 – 12:00", title: "Hackathon final pitches", description: "Top teams pitch to a panel of investors, policymakers and operators." },
      { time: "13:00 – 14:30", title: "Closing keynote", description: "Commitments from delegates, sponsors and partners — what happens next." },
      { time: "14:30 – 15:30", title: "Farewell & next steps", description: "Year-round YALI programming overview and 2027 preview." },
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
    price: "₦2.5M",
    highlight: false,
    benefits: [
      "Logo on website & event signage",
      "2 delegate passes",
      "Recognition during opening",
    ],
  },
  {
    name: "Silver",
    price: "₦7.5M",
    highlight: false,
    benefits: [
      "Everything in Community",
      "Branded session or workshop",
      "5 delegate passes",
      "Logo on conference materials",
    ],
  },
  {
    name: "Gold",
    price: "₦20M",
    highlight: true,
    benefits: [
      "Everything in Silver",
      "Track sponsorship + naming",
      "Speaking slot in plenary",
      "10 delegate passes",
      "Premium booth in expo area",
    ],
  },
  {
    name: "Platinum",
    price: "₦50M",
    highlight: false,
    benefits: [
      "Everything in Gold",
      "Headline sponsor across all comms",
      "Co-branded opening keynote",
      "Unlimited delegate passes",
      "Year-round YALI programme partnership",
    ],
  },
];

export const SPONSOR_TIER_OPTIONS = SPONSOR_TIERS.map((t) => t.name);
export const BUDGET_RANGES = [
  "Under ₦2.5M",
  "₦2.5M – ₦7.5M",
  "₦7.5M – ₦20M",
  "₦20M – ₦50M",
  "Over ₦50M",
  "Let's discuss",
];
export const DECISION_TIMELINES = [
  "Within 2 weeks",
  "Within 1 month",
  "1–3 months",
  "Exploring only",
];