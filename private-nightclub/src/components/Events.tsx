import { events } from "@/lib/site";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

const tagStyle: Record<string, string> = {
  Resident: "text-cream/50 border-cream/20",
  Special: "text-champagne border-gold/50",
  Holiday: "text-gold border-gold/60",
};

/** Upcoming events. Practical first: date, name, host, blurb, and an RSVP. */
export default function Events() {
  return (
    <section id="events" className="relative bg-soft-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-edge">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="What's On"
            title={<>Upcoming nights</>}
            intro="The calendar moves fast. Lock a table early or get on the list before the door fills."
          />
          <Reveal delay={0.1}>
            <a
              href="#guestlist"
              className="inline-block whitespace-nowrap border border-gold/40 px-6 py-3 text-[0.7rem] uppercase tracking-wide2 text-champagne transition-colors hover:border-gold hover:text-cream"
            >
              Join the guestlist
            </a>
          </Reveal>
        </div>

        <div className="mt-14 divide-y divide-gold/12 border-y border-gold/12">
          {events.map((e, i) => (
            <Reveal key={e.name} delay={i * 0.05}>
              <article className="group grid grid-cols-1 items-center gap-6 py-8 md:grid-cols-12">
                <div className="md:col-span-2">
                  <div className="display text-4xl text-gold">{e.date}</div>
                  <div className="mt-1 text-[0.7rem] uppercase tracking-wide2 text-cream/45">
                    {e.weekday}
                  </div>
                </div>
                <div className="md:col-span-6">
                  <div className="flex items-center gap-3">
                    <h3 className="display text-3xl text-cream">{e.name}</h3>
                    <span
                      className={`border px-2.5 py-0.5 text-[0.6rem] uppercase tracking-wide2 ${tagStyle[e.tag]}`}
                    >
                      {e.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gold/80">{e.host}</p>
                  <p className="mt-3 max-w-xl text-sm text-cream/55">{e.blurb}</p>
                </div>
                <div className="flex gap-3 md:col-span-4 md:justify-end">
                  <a
                    href="#vip"
                    className="border border-gold/40 px-5 py-2.5 text-[0.68rem] uppercase tracking-wide2 text-champagne transition-colors hover:border-gold hover:text-cream"
                  >
                    Reserve table
                  </a>
                  <a
                    href="#guestlist"
                    className="bg-gold/90 px-5 py-2.5 text-[0.68rem] uppercase tracking-wide2 text-black transition-colors hover:bg-champagne"
                  >
                    RSVP
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
