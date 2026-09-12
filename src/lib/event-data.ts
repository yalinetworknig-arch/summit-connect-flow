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
    day: "Summit",
    date: "Fri · Sept 25, 2026",
    theme: "Artificial Intelligence, Digital Innovation, and Empowering the Next Generation of Leaders",
    blocks: [
      { time: "8:00 – 8:30 AM", title: "Breakfast & Arrival", description: "Breakfast, tea and refreshments; arrival of participants." },
      { time: "8:30 – 9:00 AM", title: "Registration & Networking", description: "Registration, networking and livestream readiness." },
      { time: "9:05 – 9:15 AM", title: "National Anthems", description: "America & Nigeria" },
      { time: "9:15 – 9:25 AM", title: "Opening Address", description: "Rabihat Rabiu – National Head, YALI Network Nigeria" },
      { time: "9:25 – 9:50 AM", title: "Cultural Presentation", description: "Poetry & Cultural Dance" },
      { time: "9:50 – 10:15 AM", title: "● Keynote I: Leadership Mindset", description: "Leading in the Age of AI – Julius Ilori, MWAFAAN President + Q&A" },
      { time: "10:15 – 10:25 AM", title: "Goodwill Remarks", description: "Casey Bonfield, Deputy Public Affairs Officer, U.S. Mission Nigeria" },
      { time: "10:25 – 10:50 AM", title: "● Keynote II: AI & Digital Transformation", description: "AI as a Catalyst for Africa's Transformation – Hon. Dr. Abdoul Baq Ladi Balogun + Q&A" },
      { time: "10:50 – 11:10 AM", title: "● Break & Networking", description: "Networking, refreshments, and official group photograph" },
      { time: "11:10 – 11:50 AM", title: "● Panel: FinTech & Inclusive Finance", description: "Leveraging Digital Innovation for Economic Opportunity + Audience Q&A" },
      { time: "11:50 AM – 12:20 PM", title: "● Masterclass: AI for Everyone", description: "Practical Tools to Empower African Leaders – Olalekan Adeeko. Interactive AI Challenge." },
      { time: "12:20 – 12:50 PM", title: "● Masterclass: Creative Innovation", description: "In the Digital Age – Dr. Salaimon Kassim, Executive Producer & Creative Leader" },
      { time: "12:50 – 1:20 PM", title: "● Panel: AI x Creative Practice", description: "Innovation Without Borders – Joint conversation on AI tools and creative practice" },
      { time: "1:20 – 1:30 PM", title: "Website Launch", description: "Official Launch of YALI Network Nigeria Website" },
      { time: "1:30 – 2:10 PM", title: "● Break & Lunch", description: "Lunch, networking and media engagement" },
      { time: "2:10 – 2:30 PM", title: "Documentary", description: "YALI Network Nigeria Impact Documentary: Our Impact, Our Journey" },
      { time: "2:30 – 2:55 PM", title: "Fireside Chat", description: "From Ideas to Impact: Entrepreneurship, Technology, and African Prosperity – Dr. Adenike Agoola-Fayemi" },
      { time: "2:55 – 3:35 PM", title: "● Panel: Building a Resilient Africa", description: "Technology, Innovation, Health, and Agriculture – Moderator: Khalifat Bint Ibrahim" },
      { time: "3:35 – 4:05 PM", title: "● Leadership Debate", description: "AI, Digital Innovation and the Future of African Leadership" },
      { time: "4:05 – 4:15 PM", title: "Commitment Poll", description: "Audience Poll & Leadership Challenge: What will you do differently after AIDIEGL 2026?" },
      { time: "4:15 – 4:25 PM", title: "Recognition", description: "Recognition of Partners, Sponsors & Contributors" },
      { time: "4:25 – 4:30 PM", title: "Closing Remarks", description: "Yahyah Saleh Muhammad, National Secretary, YALI Network Nigeria" },
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