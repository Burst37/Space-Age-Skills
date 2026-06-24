/**
 * Single source of truth for venue content. No lorem ipsum — every field is
 * realistic, editable copy. Swap values here and the whole site updates.
 */

export const venue = {
  name: "Private",
  fullName: "Private Nightclub",
  tagline: "St. Louis After Dark",
  city: "St. Louis",
  phone: process.env.NEXT_PUBLIC_VENUE_PHONE ?? "+1 (314) 555-0142",
  email: process.env.NEXT_PUBLIC_VENUE_EMAIL ?? "vip@privatestl.com",
  address: {
    line1: "1142 Washington Ave",
    line2: "St. Louis, MO 63101",
    mapsQuery: "1142 Washington Ave, St. Louis, MO 63101",
  },
  hours: [
    { day: "Thursday", time: "10:00 PM - 3:00 AM" },
    { day: "Friday", time: "10:00 PM - 3:00 AM" },
    { day: "Saturday", time: "10:00 PM - 3:00 AM" },
    { day: "Sun - Wed", time: "Private events only" },
  ],
  social: [
    { label: "Instagram", slug: "instagram", href: "https://instagram.com" },
    { label: "TikTok", slug: "tiktok", href: "https://tiktok.com" },
    { label: "X", slug: "x", href: "https://x.com" },
    { label: "YouTube", slug: "youtube", href: "https://youtube.com" },
  ],
} as const;

export const nav = [
  { label: "Home", href: "#top" },
  { label: "Events", href: "#events" },
  { label: "VIP", href: "#vip" },
  { label: "Guestlist", href: "#guestlist" },
  { label: "Membership", href: "#membership" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;

export type EventItem = {
  date: string;
  weekday: string;
  name: string;
  host: string;
  blurb: string;
  tag: "Resident" | "Special" | "Holiday";
};

export const events: EventItem[] = [
  {
    date: "JUL 03",
    weekday: "Friday",
    name: "Gold Room Fridays",
    host: "DJ Marcel Vaughn",
    blurb:
      "The flagship Friday. Open-format house and R&B, bottle parades on the hour, and the Gold Room reserved for tables only.",
    tag: "Resident",
  },
  {
    date: "JUL 04",
    weekday: "Saturday",
    name: "Independence After Dark",
    host: "Saint & Kayla B2B",
    blurb:
      "Holiday weekend takeover. Rooftop sparklers at midnight, champagne service, and a late set that runs to last call.",
    tag: "Holiday",
  },
  {
    date: "JUL 11",
    weekday: "Friday",
    name: "Noir Lounge",
    host: "DJ Renata",
    blurb:
      "Slow-burn deep house in low light. Reserved seating, curated crowd, dress code strictly enforced.",
    tag: "Resident",
  },
  {
    date: "JUL 18",
    weekday: "Saturday",
    name: "The Velvet Hour",
    host: "Guest: Tone Rivera",
    blurb:
      "A touring headliner takes the booth. Limited VIP tables, advance guestlist closes Thursday at 6 PM.",
    tag: "Special",
  },
];

export type ExperienceCard = {
  key: string;
  title: string;
  blurb: string;
  href: string;
};

export const experiences: ExperienceCard[] = [
  { key: "vip", title: "VIP Tables", blurb: "Reserved seating, your own host, the best sightlines in the room.", href: "#vip" },
  { key: "djs", title: "Resident DJs", blurb: "Open-format residents and touring headliners every weekend.", href: "#music" },
  { key: "events", title: "Live Events", blurb: "Themed nights, takeovers, and holiday weekend productions.", href: "#events" },
  { key: "food", title: "Food + Drinks", blurb: "Late-night plates and a champagne-forward bottle list.", href: "#food" },
  { key: "membership", title: "Black Card", blurb: "Priority entry, standing tables, and members-only nights.", href: "#membership" },
  { key: "private", title: "Private Events", blurb: "Buyouts, birthdays, and corporate nights built around you.", href: "#vip" },
];

export const splitSlides = [
  {
    id: "vip",
    kicker: "01 / Reserved",
    title: "VIP Tables",
    body: "Hand-picked seating with a dedicated host, premium mixers, and the shortest line in the city. From two-tops to the full Gold Room.",
    cta: { label: "Reserve a table", href: "#vip" },
  },
  {
    id: "bottle",
    kicker: "02 / Service",
    title: "Bottle Service",
    body: "Sparkler parades, curated champagne, and top-shelf spirits delivered to your section. Packages scale from a single bottle to a full buy-in.",
    cta: { label: "See packages", href: "#vip" },
  },
  {
    id: "events",
    kicker: "03 / Tonight",
    title: "Live Events",
    body: "Resident sets, touring headliners, and themed productions every weekend. The calendar moves fast and the good tables move faster.",
    cta: { label: "View events", href: "#events" },
  },
  {
    id: "membership",
    kicker: "04 / Members",
    title: "Membership",
    body: "The Black Card opens the door before the line forms. Priority entry, a held table, and access to members-only nights.",
    cta: { label: "Apply now", href: "#membership" },
  },
] as const;

export const drinks = [
  { name: "Champagne & Sparkling", note: "Brut, rosé, and reserve cuvées by the bottle." },
  { name: "Top-Shelf Spirits", note: "Aged tequila, cognac, single-malt, and rare pours." },
  { name: "Signature Cocktails", note: "House builds shaken to order, garnished tableside." },
  { name: "Late-Night Plates", note: "Wagyu sliders, truffle fries, and shareable bites until 2 AM." },
];

export const residents = [
  { name: "Marcel Vaughn", style: "Open-format · House", night: "Fridays" },
  { name: "Renata", style: "Deep & Melodic House", night: "Noir Lounge" },
  { name: "Saint", style: "Hip-Hop · R&B", night: "Saturdays" },
  { name: "Kayla B", style: "Afro House · Amapiano", night: "Rotating" },
];

export const membershipTiers = [
  {
    name: "The Black Card",
    price: "Invitation + dues",
    highlight: true,
    perks: [
      "Priority entry, every night, no line",
      "A standing table held until midnight",
      "Dedicated host and direct booking line",
      "Access to members-only nights",
      "Two guests included on the list",
    ],
  },
  {
    name: "The Gold List",
    price: "Annual",
    highlight: false,
    perks: [
      "Skip-the-line entry on weekends",
      "Priority table requests",
      "Early access to event tickets",
      "Birthday package upgrade",
    ],
  },
];

export const faqs = [
  {
    q: "What is the dress code?",
    a: "Upscale and intentional. Collared shirts or elevated streetwear, clean footwear, no athletic wear, no sportswear, no baggy fits. Tables and members hold to the same standard. Management has final say at the door.",
  },
  {
    q: "Where do I park?",
    a: "Valet runs at the front entrance on Washington Ave from 10 PM. Self-park is available in the Lucas Avenue garage one block north, and street metered parking is free after 11 PM.",
  },
  {
    q: "What are the hours?",
    a: "Doors open Thursday, Friday, and Saturday at 10 PM and we run to 3 AM. Sunday through Wednesday is reserved for private events and buyouts.",
  },
  {
    q: "How do I book a table?",
    a: "Use the VIP form on this page or call the booking line. Tables are confirmed with a deposit and a minimum spend that scales with the night and section.",
  },
  {
    q: "Can I book a birthday or private event?",
    a: "Yes. Birthday packages include a reserved section, a bottle with a sparkler parade, and a dedicated host. Full buyouts are available any night of the week. Send an inquiry through the VIP form.",
  },
  {
    q: "How does the guestlist work?",
    a: "Join the guestlist for the night you are coming. It speeds up entry and is free, but it does not guarantee admission once we reach capacity. Tables and members always have priority.",
  },
];

export const stats = [
  { value: 1200, suffix: "+", label: "Guests on a sold-out night" },
  { value: 18, suffix: "", label: "VIP tables and sections" },
  { value: 52, suffix: "", label: "Resident and guest sets a year" },
  { value: 4.9, suffix: "★", label: "Average VIP host rating", decimals: 1 },
];

export const testimonials = [
  {
    quote: "Best table service in the city. The host had everything ready before we walked in.",
    name: "Devin Carter",
    role: "Regular, Gold Room",
  },
  {
    quote: "Booked it for my birthday and they made it feel like the whole room was ours.",
    name: "Aaliyah Morrow",
    role: "Birthday buyout",
  },
  {
    quote: "The sound and the lighting are a different level. It does not feel like St. Louis.",
    name: "Marcus Bell",
    role: "Black Card member",
  },
];
