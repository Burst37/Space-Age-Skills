import Reveal from "./Reveal";

/**
 * Shared section header. Eyebrow use is rationed across the page per the
 * anti-slop rules, so it is optional and off by default.
 */
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
}) {
  const alignment = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col ${alignment} max-w-2xl`}>
      {eyebrow && (
        <Reveal>
          <span className="mb-4 block text-[0.7rem] uppercase tracking-wide2 text-gold/80">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="display text-4xl text-cream sm:text-5xl lg:text-6xl">{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-cream/55">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
