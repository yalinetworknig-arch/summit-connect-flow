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
    long: "Smallholder farmers feed Nigeria, but the data, capital and cold-chain don't reach them. This conversation names the tools and financing models that make agriculture the next growth engine - not the next casualty.",
    sessions: [
      "Building a Resilient Africa: Technology, Innovation, Health, and Agriculture",
    ],
    Icon: Sprout,
  },
  {
    slug: "fintech",
    title: "FinTech & Digital Finance",
    short: "Payments, lending, Naira-native digital products.",
    long: "Lagos is Africa's fintech capital. The next chapter - embedded finance, agency banking, credit for the underbanked - gets discussed here, with the founders and regulators in the same room.",
    sessions: [
      "Panel: FinTech & Digital Finance - Leveraging Digital Innovation for Economic Opportunity",
    ],
    Icon: Landmark,
  },
  {
    slug: "creative",
    title: "Creative Economy",
    short: "Film, music, fashion, gaming, AI-driven creators.",
    long: "Nollywood, Afrobeats, Nigerian fashion and gaming already export. The work now is keeping the IP, the distribution and the AI tooling in Nigerian hands - and getting paid like it.",
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
      { time: "8:00 - 8:30 AM", title: "Breakfast & Arrival", description: "Breakfast, tea and refreshments; arrival of participants." },
      { time: "8:30 - 9:00 AM", title: "Registration & Networking", description: "Registration, networking and livestream readiness." },
      { time: "9:05 - 9:15 AM", title: "National Anthems", description: "America & Nigeria" },
      { time: "9:15 - 9:25 AM", title: "Opening Address", description: "Rabihat Rabiu - National Head, YALI Network Nigeria" },
      { time: "9:25 - 9:50 AM", title: "Cultural Presentation", description: "Poetry & Cultural Dance" },
      { time: "9:50 - 10:15 AM", title: "* Keynote I: Leadership Mindset", description: "Leading in the Age of AI - Julius Ilori, MWAFAAN President + Q&A" },
      { time: "10:15 - 10:25 AM", title: "Goodwill Remarks", description: "Casey Bonfield, Deputy Public Affairs Officer, U.S. Mission Nigeria" },
      { time: "10:25 - 10:50 AM", title: "* Keynote II: AI & Digital Transformation", description: "AI as a Catalyst for Africa's Transformation - Hon. Dr. Abdoul Baq Ladi Balogun + Q&A" },
      { time: "10:50 - 11:10 AM", title: "* Break & Networking", description: "Networking, refreshments, and official group photograph" },
      { time: "11:10 - 11:50 AM", title: "* Panel: FinTech & Digital Finance", description: "Leveraging Digital Innovation for Economic Opportunity + Audience Q&A" },
      { time: "11:50 AM - 12:20 PM", title: "* Masterclass: AI for Everyone", description: "Practical Tools to Empower African Leaders - Olalekan Adeeko. Interactive AI Challenge." },
      { time: "12:20 - 12:50 PM", title: "* Masterclass: Creative Innovation", description: "In the Digital Age - Dr. Salaimon Kassim, Executive Producer & Creative Leader" },
      { time: "12:50 - 1:20 PM", title: "* Panel: AI x Creative Practice", description: "Innovation Without Borders - Joint conversation on AI tools and creative practice" },
      { time: "1:20 - 1:30 PM", title: "Website Launch", description: "Official Launch of YALI Network Nigeria Website" },
      { time: "1:30 - 2:10 PM", title: "* Break & Lunch", description: "Lunch, networking and media engagement" },
      { time: "2:10 - 2:30 PM", title: "Documentary", description: "YALI Network Nigeria Impact Documentary: Our Impact, Our Journey" },
      { time: "2:30 - 2:55 PM", title: "Fireside Chat", description: "From Ideas to Impact: Entrepreneurship, Technology, and African Prosperity - Dr. Adenike Agoola-Fayemi" },
      { time: "2:55 - 3:35 PM", title: "* Panel: Building a Resilient Africa", description: "Technology, Innovation, Health, and Agriculture - Moderator: Khalifat Bint Ibrahim" },
      { time: "3:35 - 4:05 PM", title: "* Leadership Debate", description: "AI, Digital Innovation and the Future of African Leadership" },
      { time: "4:05 - 4:15 PM", title: "Commitment Poll", description: "Audience Poll & Leadership Challenge: What will you do differently after AIDIENGL 2026?" },
      { time: "4:15 - 4:25 PM", title: "Recognition", description: "Recognition of Partners, Sponsors & Contributors" },
      { time: "4:25 - 4:30 PM", title: "Closing Remarks", description: "Yahyah Saleh Muhammad, National Secretary, YALI Network Nigeria" },
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
    price: "N150K",
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
    price: "N250K - N500K",
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
    price: "N1M - N2.9M",
    highlight: false,
    benefits: [
      "Everything in Bronze",
      "Supported by status",
      "3 social posts + 1 advertorial slot",
      "Shared signage, Cultural Night mention, track shoutout",
      "3 delegate passes",
    ],
  },
  {
    name: "Gold",
    price: "N5M - N7M",
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
    price: "N7M - N10M+",
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
  "Under N150K",
  "N150K - N500K",
  "N500K - N2.9M",
  "N2.9M - N7M",
  "Over N7M",
  "Let's discuss",
];
export const DECISION_TIMELINES = [
  "Within 2 weeks",
  "Within 1 month",
  "1-3 months",
  "Exploring only",
];

export type Speaker = {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  session: string;
  sessionType: "keynote" | "panel" | "masterclass";
};

export const SPEAKERS: Speaker[] = [
  {
    id: "julius-ilori",
    name: "Julius Ilori",
    title: "MWAFAAN President",
    bio: "Visionary leader driving AI innovation and digital transformation across Africa with a focus on sustainable technology adoption.",
    image: "/speakers/julius-ilori.jpg",
    session: "Keynote I: Leadership Mindset - Leading in the Age of AI",
    sessionType: "keynote",
  },
  {
    id: "abdoul-baq-ladi-balog",
    name: "Dr. Abdoulbaq Ladi Balog",
    title: "Policy Leader & Digital Transformation Strategist",
    bio: "Policy innovator committed to leveraging AI and digital transformation as catalysts for Africa's economic and social development.",
    image: "/speakers/abdoulbaq-ladi-balog.jpg",
    session: "Keynote II: AI & Digital Transformation",
    sessionType: "keynote",
  },
  {
    id: "olalekan-adeeko",
    name: "Olalekan Adeeko",
    title: "Co-Founder, TedPrime Ltd & AI Expert",
    bio: "Passionate advocate for democratizing AI knowledge and leveraging technology for social impact, empowering African leaders with practical tools and skills for the digital age.",
    image: "/speakers/olalekan-adeeko.jpg",
    session: "Masterclass: AI for Everyone - Practical Tools to Empower African Leaders",
    sessionType: "masterclass",
  },
  {
    id: "sulaiman-kassim",
    name: "Dr. Sulaiman Kassim",
    title: "Founder, TEN Works & Creative Innovation Leader",
    bio: "Visionary creative strategist bridging technology and artistic expression, advancing digital innovation and cultural excellence in African creative industries.",
    image: "/speakers/sulaiman-kassim.jpg",
    session: "Masterclass: Creative Innovation in the Digital Age",
    sessionType: "masterclass",
  },
  {
    id: "adenike-agboola-fayemi",
    name: "Dr. Adenike Agboola-Fayemi",
    title: "Head, Corporate Sustainability and Responsibility, Wema Bank",
    bio: "Sustainability leader and thought pioneer dedicated to leveraging business innovation and social responsibility to drive Africa's economic transformation.",
    image: "/speakers/adenike-agboola-fayemi.jpg",
    session: "Fireside Chat: From Ideas to Impact: Entrepreneurship, Technology, and African Prosperity",
    sessionType: "panel",
  },
  {
    id: "kayode-odunuga",
    name: "Dr. Kayode Odunuga",
    title: "Healthcare Innovator - Brain Bloom Care",
    bio: "Pioneering digital health solutions and AI-driven diagnostics to bridge care gaps and improve health outcomes across Africa.",
    image: "/speakers/kayode-odunuga.jpg",
    session: "Panel: Building a Resilient Africa - Technology, Innovation, Health, and Agriculture",
    sessionType: "panel",
  },
  {
    id: "olayemi-dawodu",
    name: "Dr. Olayemi Dawodu",
    title: "Pathologist & Healthcare Innovator",
    bio: "Medical innovator advancing diagnostic excellence and healthcare technology to drive equitable access and better patient outcomes in Africa.",
    image: "/speakers/olayemi-dawodu.jpg",
    session: "Panel: Building a Resilient Africa - Technology, Innovation, Health, and Agriculture",
    sessionType: "panel",
  },
  {
    id: "ameenah-kazeem",
    name: "Ameenah Kazeem",
    title: "Founder and CEO, OFADAHUB Nigeria Limited",
    bio: "Enterprising entrepreneur revolutionizing digital finance and business solutions to empower African entrepreneurs and drive economic innovation.",
    image: "/speakers/ameenah-kazeem.jpg",
    session: "Panel: FinTech & Digital Finance - Leveraging Digital Innovation for Economic Opportunity",
    sessionType: "panel",
  },
  {
    id: "khalilat-ibrahim-ajidagba",
    name: "Khalilat Ibrahim Ajidagba",
    title: "Panel Moderator & Sector Expert",
    bio: "Knowledge expert in health, agriculture, and sustainable innovation, facilitating dialogue on building a resilient Africa.",
    image: "/speakers/khalilat-ibrahim-ajidagba.jpg",
    session: "Panel: Building a Resilient Africa - Technology, Innovation, Health, and Agriculture",
    sessionType: "panel",
  },
  {
    id: "jeremiah-adeyemi",
    name: "Jeremiah Adeyemi",
    title: "Panel Moderator & Creative Innovation Expert",
    bio: "Innovative thought leader bridging technology and creative practice, moderating conversations on AI's transformative role in African creative industries.",
    image: "/speakers/jeremiah-adeyemi.jpg",
    session: "Panel: AI x Creative Practice - Innovation Without Borders",
    sessionType: "panel",
  },
];

// NOTE: The attendee directory is no longer sample data. It's fetched live
// from Supabase via listNetworkDirectory() in src/lib/networking.functions.ts
// and rendered in src/components/sections/NetworkSection.tsx — see that file
// for the real, opt-in-gated attendee list.
