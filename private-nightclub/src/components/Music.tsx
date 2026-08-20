import { residents } from "@/lib/site";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

/** DJ / music section. The sound is the brand, so it gets real estate. */
export default function Music() {
  return (
    <section id="music" className="atmosphere relative overflow-hidden bg-soft-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="relative mx-auto max-w-edge">
        <SectionHeading
          eyebrow="The Sound"
          title={
            <>
              Residents and <span className="gold-text">headliners</span>
            </>
          }
          intro="Open-format house, R&B, hip-hop, and Afro sounds. A rotating residency anchors the weekend, with touring guests on special nights."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {residents.map((dj, i) => (
            <Reveal key={dj.name} delay={i * 0.06}>
              <article className="group relative h-full overflow-hidden border border-gold/15 bg-black/50 p-7">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/5 blur-2xl transition-all duration-500 group-hover:bg-gold/15" />
                <span className="text-[0.66rem] uppercase tracking-wide2 text-gold/70">{dj.night}</span>
                <h3 className="display mt-4 text-3xl text-cream">{dj.name}</h3>
                <p className="mt-2 text-sm text-cream/55">{dj.style}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
