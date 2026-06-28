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
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Menu", href: "#menu" },
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
  { key: "food", title: "Food + Drinks", blurb: "Late-night plates and a champagne-forward bottle list.", href: "#menu" },
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

/* ----- Menu (transcribed from the official Private Nightclub menu cards) ----- */

export type MenuRow = { name: string; price: string };
export type MenuGroup = { title: string; rows: MenuRow[]; note?: string };

export const foodMenu: MenuGroup[] = [
  {
    title: "Appetizers",
    rows: [
      { name: "Mac and Cheese Bites", price: "10" },
      { name: "Beef Toasted Ravioli", price: "10" },
      { name: "Fried Pickles", price: "10" },
      { name: "Buffalo Shrimp", price: "12" },
      { name: "Buffalo Cauliflower", price: "10" },
    ],
  },
  {
    title: "Wings",
    rows: [
      { name: "5pc Party Wing", price: "8" },
      { name: "10pc Party Wing", price: "16" },
      { name: "20pc Party Wing", price: "24" },
      { name: "All Flats", price: "+3" },
      { name: "5pc Whole Wing", price: "16" },
      { name: "10pc Whole Wing", price: "24" },
      { name: "20pc Whole Wing", price: "32" },
    ],
    note: "Sauces: Buffalo, Honey Hot, Korean BBQ, Lemon Pepper, Garlic Parmesan. Additional wing sauce 50 cent upcharge.",
  },
  {
    title: "From the Grill",
    rows: [
      { name: "All Beef Hot Dog", price: "7" },
      { name: "Polish Sausage", price: "7" },
      { name: "Hamburger", price: "10" },
      { name: "Cheeseburger", price: "12" },
    ],
  },
  {
    title: "Pizza",
    rows: [
      { name: "10in Cheese Pizza", price: "12" },
      { name: "12in Cheese Pizza", price: "14" },
    ],
    note: "Add toppings: pepperoni or sausage +2, green pepper, onion, or mushroom +1.",
  },
];

export const foodNote =
  "Kitchen open until 1:30 AM. Wing sauces: Buffalo, Honey Hot, Korean BBQ, Lemon Pepper, Garlic Parmesan (extra sauce +50¢). Pizza toppings: pepperoni +$2, sausage, green pepper +$1, onion, mushroom.";

export const bottleMenu: MenuGroup[] = [
  {
    title: "Tequila",
    rows: [
      { name: "Teremana Blanco", price: "200" },
      { name: "Teremana Reposado", price: "225" },
      { name: "La Gritona Reposado", price: "275" },
      { name: "Don Julio Blanco", price: "250" },
      { name: "Don Julio Reposado", price: "275" },
      { name: "Don Fulano Reposado", price: "275" },
      { name: "Don Julio 1942", price: "600" },
      { name: "Clase Azul Reposado", price: "600" },
    ],
  },
  {
    title: "Sparkling",
    rows: [
      { name: "Luc Belaire Rare Luxe", price: "100" },
      { name: "Luc Belaire Brut Gold", price: "100" },
      { name: "Luc Belaire Bleu", price: "100" },
      { name: "Luc Belaire Luxe Rose", price: "100" },
    ],
  },
  {
    title: "Whiskey",
    rows: [
      { name: "Jameson", price: "150" },
      { name: "Makers Mark", price: "200" },
      { name: "Woodford Reserve", price: "250" },
    ],
  },
  {
    title: "Vodka",
    rows: [
      { name: "Tito's", price: "150" },
      { name: "Ketel One", price: "200" },
      { name: "Grey Goose", price: "225" },
      { name: "Deep Eddy's Lemon", price: "200" },
      { name: "Deep Eddy's Lime", price: "200" },
    ],
  },
  {
    title: "Cognac",
    rows: [
      { name: "Hennessy VS", price: "225" },
      { name: "D'usse", price: "250" },
      { name: "Remy Martin VSOP", price: "275" },
      { name: "Remy Martin 1738", price: "300" },
      { name: "Yah-Yah", price: "275" },
    ],
  },
];

export const bottleNote =
  "Bottle service includes 2 juice or soda options or 2 Red Bulls. 20% automatic gratuity added for bottle sales.";

/* ----- Split-screen menu items (name <-> branded card image <-> price) ----- */

export type MenuSelectItem = {
  name: string;
  category: string;
  price: string;
  note?: string;
  img: string;
  /** Optional spec chips shown in the detail view, e.g. [{k:"ABV",v:"40%"}]. */
  macros?: { k: string; v: string }[];
};

// Real Late Night Food Menu (from the venue's printed menu). Each item uses the
// owner's OWN labeled card image (name matches the label printed on the card),
// with the real prices. NOTE: a few cards have an AI photo that doesn't match
// their (correct) label — flagged with PHOTO; regenerate those images.
export const foodSelectItems: MenuSelectItem[] = [
  // WINGS — party 5/10/20 = $8/$16/$24; whole 5/10/20 = $16/$24/$32; flats +$3
  { name: "Buffalo Wings", category: "Wings", price: "8 / 16 / 24", note: "Classic buffalo. Party wings 5/10/20 pc; whole 16/24/32; flats +$3.", img: "/menu/food/food-01.webp" },
  { name: "Honey Hot Wings", category: "Wings", price: "8 / 16 / 24", note: "Sweet heat. Party wings 5/10/20 pc; whole 16/24/32; flats +$3.", img: "/menu/food/food-05.webp" },
  { name: "Korean BBQ Wings", category: "Wings", price: "8 / 16 / 24", note: "Sweet, savory, sticky. Party wings 5/10/20 pc; whole 16/24/32; flats +$3.", img: "/menu/food/food-02.webp" },
  { name: "Lemon Pepper Wings", category: "Wings", price: "8 / 16 / 24", note: "Citrus and cracked pepper. Party wings 5/10/20 pc; whole 16/24/32; flats +$3.", img: "/menu/food/food-04.webp" },
  { name: "Garlic Parmesan Wings", category: "Wings", price: "8 / 16 / 24", note: "Herb and aged parmesan. Party wings 5/10/20 pc; whole 16/24/32; flats +$3.", img: "/menu/food/food-03.webp" },
  // APPETIZERS
  { name: "Mac & Cheese Bites", category: "Appetizers", price: "10", note: "Crispy fried mac and cheese.", img: "/menu/food/food-11.webp" },
  { name: "Beef Toasted Ravioli", category: "Appetizers", price: "10", note: "St. Louis style, marinara.", img: "/menu/food/food-12.webp" },
  { name: "Buffalo Shrimp", category: "Appetizers", price: "12", note: "Crispy shrimp tossed in buffalo.", img: "/menu/food/food-15.webp" },
  { name: "Buffalo Cauliflower", category: "Appetizers", price: "10", note: "Crispy cauliflower, buffalo sauce.", img: "/menu/food/food-14.webp" }, // PHOTO shows pizza — regenerate
  { name: "Fried Pickles", category: "Appetizers", price: "10", note: "Hand-battered dill pickles.", img: "/menu/food/food-13.webp" }, // real photo (owner-supplied)
  // FROM THE GRILL
  { name: "All Beef Hot Dog", category: "From the Grill", price: "7", note: "Quarter-pound all-beef dog.", img: "/menu/food/food-17.webp" }, // PHOTO shows bites — regenerate
  { name: "Cheeseburger", category: "From the Grill", price: "12", note: "Char-grilled, American cheese.", img: "/menu/food/food-16.webp" }, // PHOTO shows pizza — regenerate
  // PIZZA — cheese; toppings extra (pepperoni +$2, sausage, green pepper +$1, onion, mushroom)
  { name: "Cheese Pizza", category: "Pizza", price: "12 / 14", note: "10-inch $12 · 12-inch $14. Add toppings.", img: "/menu/food/food-22.webp" }, // PHOTO shows ravioli — regenerate
];

export const drinkSelectItems: MenuSelectItem[] = [
  { name: "Teremana Blanco", category: "Tequila", price: "200", img: "/menu/drinks/drink-01.webp" },
  { name: "Teremana Reposado", category: "Tequila", price: "225", img: "/menu/drinks/drink-02.webp" },
  { name: "La Gritona Reposado", category: "Tequila", price: "275", img: "/menu/drinks/drink-03.webp" },
  { name: "Don Julio Blanco", category: "Tequila", price: "250", img: "/menu/drinks/drink-04.webp" },
  { name: "Don Julio Reposado", category: "Tequila", price: "275", img: "/menu/drinks/drink-05.webp" },
  { name: "Don Fulano Reposado", category: "Tequila", price: "275", img: "/menu/drinks/drink-06.webp" },
  { name: "Don Julio 1942", category: "Tequila", price: "600", img: "/menu/drinks/drink-07.webp" },
  { name: "Clase Azul Reposado", category: "Tequila", price: "600", img: "/menu/drinks/drink-08.webp" },
  { name: "Tito's", category: "Vodka", price: "150", img: "/menu/drinks/drink-09.webp" },
  { name: "Ketel One", category: "Vodka", price: "200", img: "/menu/drinks/drink-10.webp" },
  { name: "Yah-Yah", category: "Cognac", price: "275", img: "/menu/drinks/drink-11.webp" },
  { name: "Remy Martin 1738", category: "Cognac", price: "300", img: "/menu/drinks/drink-12.webp" },
  { name: "Remy Martin VSOP", category: "Cognac", price: "275", img: "/menu/drinks/drink-13.webp" },
  { name: "Luc Belaire Rare Luxe", category: "Sparkling", price: "100", img: "/menu/drinks/drink-14.webp" },
  { name: "Luc Belaire Brut Gold", category: "Sparkling", price: "100", img: "/menu/drinks/drink-15.webp" },
  { name: "Luc Belaire Bleu", category: "Sparkling", price: "100", img: "/menu/drinks/drink-16.webp" },
  { name: "Luc Belaire Luxe Rose", category: "Sparkling", price: "100", img: "/menu/drinks/drink-17.webp" },
  { name: "Jameson", category: "Whiskey", price: "150", img: "/menu/drinks/drink-18.webp" },
  { name: "Makers Mark", category: "Whiskey", price: "200", img: "/menu/drinks/drink-19.webp" },
  { name: "Woodford Reserve", category: "Whiskey", price: "250", img: "/menu/drinks/drink-20.webp" },
  { name: "D'usse", category: "Cognac", price: "250", img: "/menu/drinks/drink-21.webp" },
  { name: "Hennessy VS", category: "Cognac", price: "225", img: "/menu/drinks/drink-22.webp" },
  { name: "Deep Eddy's Lime", category: "Vodka", price: "200", img: "/menu/drinks/drink-23.webp" },
  { name: "Deep Eddy's Lemon", category: "Vodka", price: "200", img: "/menu/drinks/drink-24.webp" },
  { name: "Grey Goose", category: "Vodka", price: "225", img: "/menu/drinks/drink-25.webp" },
];

/* Extracted menu photography (self-labeled cards from the menu PDFs). */
export const foodImages: string[] = Array.from(
  { length: 22 },
  (_, i) => `/menu/food/food-${String(i + 1).padStart(2, "0")}.webp`,
);
export const drinkImages: string[] = Array.from(
  { length: 25 },
  (_, i) => `/menu/drinks/drink-${String(i + 1).padStart(2, "0")}.webp`,
);

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
