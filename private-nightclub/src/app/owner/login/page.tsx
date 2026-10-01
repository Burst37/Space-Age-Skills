"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OwnerLogin() {
  const [passcode, setPasscode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/owner/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    if (res.ok) {
      router.push("/owner");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error ?? "Wrong passcode.");
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-xl border border-gold/15 border-t-gold/30 bg-white/[0.025] p-8 backdrop-blur-xl"
      >
        <div className="mb-1 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo.png" alt="Private Nightclub" className="h-10 w-10 object-contain" />
          <span className="text-[0.66rem] uppercase tracking-brand text-gold/80">Owner Access</span>
        </div>
        <h1 className="display mt-4 text-3xl text-cream">The Control Room</h1>
        <p className="mt-2 text-sm text-cream/45">Enter the owner passcode to continue.</p>

        <input
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Passcode"
          aria-label="Owner passcode"
          autoFocus
          className="mt-6 w-full border border-gold/25 bg-soft-black px-4 py-3.5 text-cream outline-none transition-colors placeholder:text-cream/30 focus:border-gold/60"
        />
        {err && <p className="mt-3 text-sm text-red-300">{err}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full bg-gold py-3.5 text-[0.72rem] uppercase tracking-wide2 text-black transition-colors hover:bg-champagne disabled:opacity-60"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}
