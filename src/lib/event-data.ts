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
    long: "Care gaps don't close themselves. This conversation maps the AI tools, data and partnerships that get Nigerian innovators from a working pilot to a national-scale public-health win.",
    sessions: [
      "Building a Resilient Africa: Technology, Innovation, Health, and Agriculture",
    ],
    Icon: HeartPulse,
  },
  {
    slug: "agriculture",
    title: "Agriculture & Food",
    short: "AgriTech, climate-smart farming, food security.",
    long: "Smallholder farmers feed Nigeria, but the data, capital and cold-chain don't reach them. This conversation names the tools and financing models that make agriculture the next growth engine â€” not the next casualty.",
    sessions: [
      "Building a Resilient Africa: Technology, Innovation, Health, and Agriculture",
    ],
    Icon: Sprout,
  },
  {
    slug: "fintech",
    title: "FinTech & Digital Finance",
    short: "Payments, lending, Naira-native digital products.",
    long: "Lagos is Africa's fintech capital. The next chapter â€” embedded finance, agency banking, credit for the underbanked â€” gets discussed here, with the founders and regulators in the same room.",
    sessions: [
      "Panel: FinTech & Digital Finance - Leveraging Digital Innovation for Economic Opportunity",
    ],
    Icon: Landmark,
  },
  {
    slug: "creative",
    title: "Creative Economy",
    short: "Film, music, fashion, gaming, AI-driven creators.",
    long: "Nollywood, Afrobeats, Nigerian fashion and gaming already export. The work now is keeping the IP, the distribution and the AI tooling in Nigerian hands â€” and getting paid like it.",
    sessions: [
      "Masterclass: Creative Innovation in the Digital Age",
      "Panel: AI x Creative Practice - Innovation Without Borders",
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
    date: "Fri - Sept 25, 2026",
    theme: "Artificial Intelligence, Digital Innovation, and Empowering the Next Generation of Leaders",
    blocks: [
      { time: "8:00 â€“ 8:30 AM", title: "Breakfast & Arrival", description: "Breakfast, tea and refreshments; arrival of participants." },
      { time: "8:30 â€“ 9:00 AM", title: "Registration & Networking", description: "Registration, networking and livestream readiness." },
      { time: "9:05 â€“ 9:15 AM", title: "National Anthems", description: "America & Nigeria" },
      { time: "9:15 â€“ 9:25 AM", title: "Opening Address", description: "Rabihat Rabiu â€“ National Head, YALI Network Nigeria" },
      { time: "9:25 â€“ 9:50 AM", title: "Cultural Presentation", description: "Poetry & Cultural Dance" },
      { time: "9:50 â€“ 10:15 AM", title: "â— Keynote I: Leadership Mindset", description: "Leading in the Age of AI â€“ Julius Ilori, MWAFAAN President + Q&A" },
      { time: "10:15 â€“ 10:25 AM", title: "Goodwill Remarks", description: "Casey Bonfield, Deputy Public Affairs Officer, U.S. Mission Nigeria" },
      { time: "10:25 â€“ 10:50 AM", title: "â— Keynote II: AI & Digital Transformation", description: "AI as a Catalyst for Africa's Transformation â€“ Hon. Dr. Abdoul Baq Ladi Balogun + Q&A" },
      { time: "10:50 â€“ 11:10 AM", title: "â— Break & Networking", description: "Networking, refreshments, and official group photograph" },
      { time: "11:10 â€“ 11:50 AM", title: "â— Panel: FinTech & Digital Finance", description: "Leveraging Digital Innovation for Economic Opportunity + Audience Q&A" },
      { time: "11:50 AM â€“ 12:20 PM", title: "â— Masterclass: AI for Everyone", description: "Practical Tools to Empower African Leaders â€“ Olalekan Adeeko. Interactive AI Challenge." },
      { time: "12:20 â€“ 12:50 PM", title: "â— Masterclass: Creative Innovation", description: "In the Digital Age â€“ Dr. Salaimon Kassim, Executive Producer & Creative Leader" },
      { time: "12:50 â€“ 1:20 PM", title: "â— Panel: AI x Creative Practice", description: "Innovation Without Borders â€“ Joint conversation on AI tools and creative practice" },
      { time: "1:20 â€“ 1:30 PM", title: "Website Launch", description: "Official Launch of YALI Network Nigeria Website" },
      { time: "1:30 â€“ 2:10 PM", title: "â— Break & Lunch", description: "Lunch, networking and media engagement" },
      { time: "2:10 â€“ 2:30 PM", title: "Documentary", description: "YALI Network Nigeria Impact Documentary: Our Impact, Our Journey" },
      { time: "2:30 â€“ 2:55 PM", title: "Fireside Chat", description: "From Ideas to Impact: Entrepreneurship, Technology, and African Prosperity â€“ Dr. Adenike Agoola-Fayemi" },
      { time: "2:55 â€“ 3:35 PM", title: "â— Panel: Building a Resilient Africa", description: "Technology, Innovation, Health, and Agriculture â€“ Moderator: Khalifat Bint Ibrahim" },
      { time: "3:35 â€“ 4:05 PM", title: "â— Leadership Debate", description: "AI, Digital Innovation and the Future of African Leadership" },
      { time: "4:05 â€“ 4:15 PM", title: "Commitment Poll", description: "Audience Poll & Leadership Challenge: What will you do differently after AIDIENGL 2026?" },
      { time: "4:15 â€“ 4:25 PM", title: "Recognition", description: "Recognition of Partners, Sponsors & Contributors" },
      { time: "4:25 â€“ 4:30 PM", title: "Closing Remarks", description: "Yahyah Saleh Muhammad, National Secretary, YALI Network Nigeria" },
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
    price: "...150K",
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
    price: "...250K â€“ ...500K",
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
    price: "...1M â€“ ...2.9M",
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
    price: "...5M â€“ ...7M",
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
    price: "...7M â€“ ...10M+",
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
  "Under ...150K",
  "...150K â€“ ...500K",
  "...500K â€“ ...2.9M",
  "...2.9M â€“ ...7M",
  "Over ...7M",
  "Let's discuss",
];
export const DECISION_TIMELINES = [
  "Within 2 weeks",
  "Within 1 month",
  "1â€“3 months",
  "Exploring only",
];

