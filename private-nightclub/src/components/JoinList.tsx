"use client";

import { useState } from "react";
import SectionHeading from "./ui/SectionHeading";

/** Email-only "join the list" capture. Posts to /api/signup (Supabase). */
export default function JoinList() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    setMsg("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "join-list" }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Something went wrong.");
      setState("done");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="list" className="relative border-t border-gold/12 lux-bg px-5 py-24 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-edge">
        <SectionHeading
          eyebrow="Stay Close"
          title={
            <>
              Get on the <span className="gold-text">list</span>
            </>
          }
          intro="Event drops, table releases, and members-only nights — straight to your inbox. No spam, just the nights worth knowing about."
        />

        {state === "done" ? (
          <p className="mt-10 text-lg text-champagne">
            You&rsquo;re on the list. Watch your inbox — the good nights come first.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="flex-1 border border-gold/25 bg-soft-black px-5 py-4 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold/60"
            />
            <button
              type="submit"
              disabled={state === "busy"}
              className="bg-gold px-8 py-4 text-[0.72rem] uppercase tracking-wide2 text-black transition-colors hover:bg-champagne disabled:opacity-60"
            >
              {state === "busy" ? "Joining…" : "Join the List"}
            </button>
          </form>
        )}
        {state === "error" && <p className="mt-4 text-sm text-red-300">{msg}</p>}
      </div>
    </section>
  );
}
