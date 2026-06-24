import { drinks } from "@/lib/site";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/** Food and drinks. Kept simple and legible, not buried. */
export default function FoodDrinks() {
  return (
    <section id="food" className="relative bg-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-edge">
        <SectionHeading
          eyebrow="The Menu"
          title={<>Food and drinks</>}
          intro="A champagne-forward bottle list, top-shelf spirits, and a late-night kitchen that runs until last call."
        />
        <div className="mt-14 grid gap-px overflow-hidden border border-gold/12 bg-gold/12 sm:grid-cols-2">
          {drinks.map((d, i) => (
            <Reveal key={d.name} delay={i * 0.05} className="bg-soft-black">
              <div className="atmosphere relative h-full p-8 sm:p-10">
                <span className="display text-5xl text-gold/15">0{i + 1}</span>
                <h3 className="display mt-3 text-3xl text-cream">{d.name}</h3>
                <p className="mt-3 text-sm text-cream/55">{d.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1} className="mt-8">
          <p className="text-sm text-cream/45">
            Full bottle menu and pricing are shared with your VIP host at booking.
            Dietary requests for private events are welcome.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
