"use client";

import { useEffect, useState } from "react";
import { Field, SelectField, TextareaField, FormShell } from "./ui/Field";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

type Status = "idle" | "submitting" | "success" | "error";

const intents = [
  { id: "table", label: "VIP Table", note: "Reserved seating with a dedicated host." },
  { id: "bottle", label: "Bottle Service", note: "Sparkler parades and curated champagne." },
  { id: "birthday", label: "Birthday Package", note: "A section, a bottle, and a celebration." },
];

/** VIP inquiry: table, bottle service, and birthday packages in one flow. */
export default function VipReservation() {
  const [status, setStatus] = useState<Status>("idle");
  const [intent, setIntent] = useState("table");
  const [paying, setPaying] = useState(false);
  const stripeEnabled = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "1";

  // Show the success state when Stripe sends the guest back after paying.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("reserved") === "1") setStatus("success");
  }, []);

  // Pay the table deposit via Stripe Checkout, carrying the form details along.
  async function payDeposit(e: React.MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.closest("form");
    if (!form || !form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, intent }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url as string;
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
    setPaying(false);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, intent }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="vip" className="relative bg-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-edge gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Reserve"
            title={
              <>
                Your table is <span className="gold-text">waiting</span>
              </>
            }
            intro="Tell us the night and the occasion. A host reaches out to confirm your section, minimum spend, and bottle selection before you arrive."
          />
          <div className="mt-10 space-y-3">
            {intents.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setIntent(it.id)}
                className={`flex w-full items-center justify-between border px-5 py-4 text-left transition-colors ${
                  intent === it.id
                    ? "border-gold bg-gold/10"
                    : "border-gold/20 hover:border-gold/45"
                }`}
              >
                <span>
                  <span className="block text-sm uppercase tracking-wide2 text-cream">{it.label}</span>
                  <span className="mt-1 block text-xs text-cream/50">{it.note}</span>
                </span>
                <span
                  className={`ml-4 h-3 w-3 flex-none rounded-full border ${
                    intent === it.id ? "border-gold bg-gold" : "border-cream/30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <FormShell
            onSubmit={onSubmit}
            status={status}
            successTitle="Request received"
            successBody="A VIP host will confirm your table by text shortly. Check your phone."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" required autoComplete="name" placeholder="Full name" />
              <Field label="Phone" name="phone" type="tel" required autoComplete="tel" placeholder="(314) 000-0000" />
              <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
              <Field label="Date" name="date" type="date" required />
              <SelectField
                label="Party Size"
                name="partySize"
                required
                options={["1 - 2", "3 - 5", "6 - 10", "10 - 15", "15+"]}
              />
              <SelectField
                label="Occasion"
                name="occasion"
                options={["Night out", "Birthday", "Bachelor / Bachelorette", "Corporate", "Buyout", "Other"]}
              />
            </div>
            <div className="mt-5">
              <TextareaField
                label="Anything else"
                name="message"
                placeholder="Bottle preferences, guest count, special requests..."
              />
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-7 w-full bg-gold py-4 text-[0.72rem] uppercase tracking-wide2 text-black transition-colors hover:bg-champagne disabled:opacity-60"
            >
              {status === "submitting" ? "Sending..." : "Request my table"}
            </button>
            {stripeEnabled && (
              <button
                type="button"
                onClick={payDeposit}
                disabled={paying || status === "submitting"}
                className="mt-3 w-full rounded-full border border-gold/40 py-4 text-[0.72rem] uppercase tracking-wide2 text-champagne transition-colors hover:border-gold hover:text-cream disabled:opacity-60"
              >
                {paying ? "Redirecting to secure checkout..." : "Reserve now with a deposit →"}
              </button>
            )}
          </FormShell>
        </Reveal>
      </div>
    </section>
  );
}
