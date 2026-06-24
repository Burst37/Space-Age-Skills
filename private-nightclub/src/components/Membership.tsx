import { membershipTiers } from "@/lib/site";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/** Membership / Black Card. The aspirational tier of the venue. */
export default function Membership() {
  return (
    <section id="membership" className="relative bg-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-edge">
        <SectionHeading
          align="center"
          eyebrow="Members"
          title={
            <>
              The <span className="gold-text">Black Card</span>
            </>
          }
          intro="Membership opens the door before the line forms. Priority entry, a table held for you, and access to nights the public never sees."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {membershipTiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <article
                className={`atmosphere relative flex h-full flex-col overflow-hidden border p-9 ${
                  tier.highlight
                    ? "border-gold/50 bg-gradient-to-br from-[#1a1206] to-black"
                    : "border-gold/15 bg-soft-black"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute right-6 top-6 border border-gold/50 px-3 py-1 text-[0.6rem] uppercase tracking-wide2 text-gold">
                    Flagship
                  </span>
                )}
                <h3 className="display text-4xl text-cream">{tier.name}</h3>
                <p className="mt-2 text-sm uppercase tracking-wide2 text-gold/80">{tier.price}</p>
                <ul className="mt-7 flex-1 space-y-3">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm text-cream/65">
                      <span className="mt-2 h-px w-5 flex-none bg-gold/60" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={`mt-8 inline-block px-6 py-3.5 text-center text-[0.7rem] uppercase tracking-wide2 transition-colors ${
                    tier.highlight
                      ? "bg-gold text-black hover:bg-champagne"
                      : "border border-gold/40 text-champagne hover:border-gold hover:text-cream"
                  }`}
                >
                  {tier.highlight ? "Request an invitation" : "Apply for membership"}
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
