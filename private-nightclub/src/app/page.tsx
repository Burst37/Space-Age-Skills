import Nav from "@/components/Nav";
import MobileCtaBar from "@/components/MobileCtaBar";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Services from "@/components/Services";
import Menu from "@/components/Menu";
import Concierge from "@/components/Concierge";
import JoinList from "@/components/JoinList";
import Contact from "@/components/Contact";
import { venue, events } from "@/lib/site";

function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: venue.fullName,
    description: `${venue.fullName} is ${venue.city}'s flagship luxury nightlife venue.`,
    telephone: venue.phone,
    email: venue.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: venue.address.line1,
      addressLocality: venue.city,
      addressRegion: "MO",
      addressCountry: "US",
    },
    openingHours: ["Th 22:00-03:00", "Fr 22:00-03:00", "Sa 22:00-03:00"],
    event: events.map((e) => ({
      "@type": "Event",
      name: e.name,
      performer: { "@type": "PerformingGroup", name: e.host },
      description: e.blurb,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

/**
 * Page structure follows the Dinely luxury restaurant template wireframe,
 * adapted for a nightclub with Private's custom video hero, liquid-glass
 * typography, and GSAP scroll reveals layered on top.
 *
 * Section order:
 *   Nav → Hero → Intro (split: headline + stats / atmospheric photo)
 *   → Services (alternating image + text cards)
 *   → Menu (late-night food + bottle list)
 *   → Concierge (Tory — solo team card)
 *   → Contact / Footer
 */
export default function Home() {
  return (
    <>
      <StructuredData />
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Services />
        <Menu />
        <Concierge />
        <JoinList />
        <Contact />
      </main>
      <MobileCtaBar />
    </>
  );
}
