import Nav from "@/components/Nav";
import MobileCtaBar from "@/components/MobileCtaBar";
import Hero from "@/components/Hero";
import ScrollStory from "@/components/ScrollStory";
import SplitShowcase from "@/components/SplitShowcase";
import ExperienceGallery from "@/components/ExperienceGallery";
import Events from "@/components/Events";
import VipReservation from "@/components/VipReservation";
import Guestlist from "@/components/Guestlist";
import FoodDrinks from "@/components/FoodDrinks";
import Music from "@/components/Music";
import Membership from "@/components/Membership";
import SocialProof from "@/components/SocialProof";
import InfoFaq from "@/components/InfoFaq";
import Contact from "@/components/Contact";
import Concierge from "@/components/Concierge";
import { venue, events } from "@/lib/site";

/** Structured data so search engines understand the venue and its events. */
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

export default function Home() {
  return (
    <>
      <StructuredData />
      <Nav />
      <main>
        <Hero />
        <ScrollStory />
        <SplitShowcase />
        <ExperienceGallery />
        <Events />
        <VipReservation />
        <Guestlist />
        <Music />
        <FoodDrinks />
        <Membership />
        <SocialProof />
        <InfoFaq />
        <Contact />
      </main>
      <MobileCtaBar />
      <Concierge />
    </>
  );
}
