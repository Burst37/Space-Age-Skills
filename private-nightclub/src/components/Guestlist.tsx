"use client";

import { useState } from "react";
import { Field, SelectField, FormShell } from "./ui/Field";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

type Status = "idle" | "submitting" | "success" | "error";

/** Fast guestlist signup. Five fields, no friction. */
export default function Guestlist() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/guestlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="guestlist" className="relative overflow-hidden bg-soft-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="atmosphere pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-edge items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Free Entry List"
            title={<>Skip the wait</>}
            intro="Get on the list for your night. It speeds up the door and it is free. Tables and members always have priority once we reach capacity."
          />
          <ul className="mt-8 space-y-3 text-sm text-cream/55">
            <li className="flex items-center gap-3">
              <span className="h-px w-6 bg-gold/60" /> Faster entry before midnight
            </li>
            <li className="flex items-center gap-3">
              <span className="h-px w-6 bg-gold/60" /> Event reminders by text
            </li>
            <li className="flex items-center gap-3">
              <span className="h-px w-6 bg-gold/60" /> No cost, no obligation
            </li>
          </ul>
        </div>

        <Reveal delay={0.1}>
          <FormShell
            onSubmit={onSubmit}
            status={status}
            successTitle="You're on the list"
            successBody="Bring your ID and arrive before midnight for the fastest entry. See you on the floor."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" name="name" required autoComplete="name" placeholder="Full name" />
              <Field label="Phone" name="phone" type="tel" required autoComplete="tel" placeholder="(314) 000-0000" />
              <Field label="Email" name="email" type="email" required autoComplete="email" placeholder="you@email.com" />
              <Field label="Date" name="date" type="date" required />
            </div>
            <div className="mt-5">
              <SelectField
                label="Party Size"
                name="partySize"
                required
                options={["1", "2", "3", "4", "5", "6+"]}
              />
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-7 w-full rounded-full bg-gold py-4 text-[0.72rem] uppercase tracking-wide2 text-black transition-colors hover:bg-champagne disabled:opacity-60"
            >
              {status === "submitting" ? "Adding you..." : "Add me to the list"}
            </button>
          </FormShell>
        </Reveal>
      </div>
    </section>
  );
}
