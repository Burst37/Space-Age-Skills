import { venue } from "@/lib/site";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
  venue.address.mapsQuery,
)}&z=15&output=embed`;
const mapsLink = `https://maps.google.com/maps?q=${encodeURIComponent(venue.address.mapsQuery)}`;

/** Contact, directions, map, hours, social, and footer. */
export default function Contact() {
  return (
    <footer id="contact" className="relative lux-bg-alt px-5 pt-24 sm:px-8 lg:pt-32">
      <div className="mx-auto max-w-edge">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Find Us"
              title={
                <>
                  {venue.city}, <span className="gold-text">after dark</span>
                </>
              }
              intro="On Washington Avenue in the heart of downtown. Valet at the door, doors at 10."
            />

            <div className="mt-10 space-y-6 text-sm">
              <div>
                <div className="text-[0.66rem] uppercase tracking-wide2 text-gold/70">Address</div>
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="mt-1 block text-cream/80 hover:text-champagne">
                  {venue.address.line1}
                  <br />
                  {venue.address.line2}
                </a>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[0.66rem] uppercase tracking-wide2 text-gold/70">Booking</div>
                  <a href={`tel:${venue.phone}`} className="mt-1 block text-cream/80 hover:text-champagne">
                    {venue.phone}
                  </a>
                </div>
                <div>
                  <div className="text-[0.66rem] uppercase tracking-wide2 text-gold/70">Email</div>
                  <a href={`mailto:${venue.email}`} className="mt-1 block text-cream/80 hover:text-champagne">
                    {venue.email}
                  </a>
                </div>
              </div>
              <div>
                <div className="text-[0.66rem] uppercase tracking-wide2 text-gold/70">Hours</div>
                <ul className="mt-2 space-y-1">
                  {venue.hours.map((h) => (
                    <li key={h.day} className="flex justify-between gap-6 text-cream/70">
                      <span>{h.day}</span>
                      <span className="text-cream/50">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#vip"
                  className="rounded-full bg-gold px-6 py-3.5 text-[0.7rem] uppercase tracking-wide2 text-black transition-colors hover:bg-champagne"
                >
                  Reserve VIP
                </a>
                <a
                  href="#guestlist"
                  className="rounded-full border border-gold/40 px-6 py-3.5 text-[0.7rem] uppercase tracking-wide2 text-champagne transition-colors hover:border-gold hover:text-cream"
                >
                  Join Guestlist
                </a>
              </div>
            </div>
          </div>

          <Reveal delay={0.1}>
            <div className="atmosphere relative h-full min-h-[360px] overflow-hidden border border-gold/15">
              <iframe
                title={`Map to ${venue.fullName}`}
                src={mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[360px] w-full grayscale invert-[0.92] contrast-[1.1]"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-gold/12 py-8 sm:flex-row">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt={venue.fullName} className="h-12 w-12 object-contain" />
            <span className="display text-xl text-cream/90">{venue.fullName}</span>
          </div>
          <div className="flex gap-5">
            {venue.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-xs uppercase tracking-wide2 text-cream/50 transition-colors hover:text-champagne"
              >
                {s.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-cream/35">
            {String.fromCharCode(169)} {new Date().getFullYear()} {venue.fullName}. {venue.city}, MO. 21+.
          </p>
        </div>
      </div>
    </footer>
  );
}
