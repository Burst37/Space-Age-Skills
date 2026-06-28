"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { springs } from "@/lib/motion";
import type { LiveStatus, LiveVoiceSession } from "@/lib/live-voice";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "VIP table pricing",
  "Dress code",
  "Tonight's event",
  "Birthday packages",
  "Parking",
];

const GREETING =
  "Good evening, I'm Tory, your concierge at Private. Ask me about tables, bottle service, dress code, parking, events, or the guestlist.";

/** Tory's avatar. Falls back to the monogram until /brand/tory.webp is added. */
function ToryAvatar({ className = "" }: { className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return <span className="display text-lg leading-none">P</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/tory.webp"
      alt="Tory, the Private concierge"
      onError={() => setOk(false)}
      className={`h-full w-full rounded-full object-cover ${className}`}
    />
  );
}

/**
 * Floating luxury concierge. Talks to /api/concierge, which answers from the
 * venue knowledge base (and can be upgraded to a live model via env). Designed
 * to feel like a host, not a toy chatbot.
 */
export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Live voice (Gemini native audio)
  const [voiceStatus, setVoiceStatus] = useState<LiveStatus>("idle");
  const [liveUser, setLiveUser] = useState<string | null>(null);
  const [liveTory, setLiveTory] = useState<string | null>(null);
  const voiceRef = useRef<LiveVoiceSession | null>(null);
  const voiceOn = voiceStatus === "listening" || voiceStatus === "speaking";

  async function startVoice() {
    if (voiceRef.current) return;
    setVoiceStatus("connecting");
    // Load the Gemini SDK only on first use — keeps it out of the initial bundle.
    const { LiveVoiceSession } = await import("@/lib/live-voice");
    if (voiceRef.current) return; // guard against a double-tap during import
    const session = new LiveVoiceSession({
      onStatus: setVoiceStatus,
      onError: (msg) => setMessages((m) => [...m, { role: "assistant", content: msg }]),
      onTranscript: (role, text, final) => {
        const setLive = role === "user" ? setLiveUser : setLiveTory;
        if (final) {
          setLive(null);
          if (text) setMessages((m) => [...m, { role, content: text }]);
        } else {
          setLive(text);
        }
      },
    });
    voiceRef.current = session;
    session.start();
  }

  function endVoice() {
    voiceRef.current?.stop();
    voiceRef.current = null;
    setLiveUser(null);
    setLiveTory(null);
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, liveUser, liveTory]);

  // Never hold the mic open once the panel is closed or the component unmounts.
  useEffect(() => {
    if (!open) endVoice();
    return () => endVoice();
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "" }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I could not reach the desk just now. Please call us and we will take care of you." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="fixed bottom-20 right-5 z-50 flex flex-row-reverse items-center gap-3 md:bottom-6 md:right-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close concierge" : "Open concierge — ask questions or place an order"}
          className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-black/80 text-gold shadow-lift backdrop-blur-xl transition-colors hover:border-gold hover:text-champagne"
        >
          {open ? <span className="display text-2xl leading-none">×</span> : <ToryAvatar />}
          {!open && <span className="absolute inset-0 animate-drift rounded-full ring-1 ring-gold/20" />}
        </button>

        {/* Label so visitors know the bubble is a live concierge — not just a
            headshot. Glass pill that points at the avatar; hidden once open. */}
        {!open && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="relative hidden items-center rounded-full border border-gold/30 bg-black/80 py-2 pl-4 pr-4 shadow-lift backdrop-blur-xl sm:flex"
          >
            <span className="leading-tight">
              <span className="block text-[0.72rem] font-medium text-cream">
                Ask me anything
              </span>
              <span className="block text-[0.6rem] uppercase tracking-wide2 text-gold/80">
                Questions {String.fromCharCode(183)} Orders {String.fromCharCode(183)} 24/7
              </span>
            </span>
            <span className="absolute -right-1 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 border-r border-t border-gold/30 bg-black/80" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={springs.smooth}
            className="atmosphere fixed bottom-36 right-5 z-50 flex h-[30rem] w-[min(92vw,23rem)] flex-col overflow-hidden border border-gold/25 bg-black/95 shadow-lift backdrop-blur-2xl md:bottom-24 md:right-6"
          >
            <div className="flex items-center gap-3 border-b border-gold/15 px-5 py-4">
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gold/40 text-gold">
                <ToryAvatar />
              </span>
              <div>
                <div className="text-sm text-cream">Tory</div>
                <div className="flex items-center gap-1.5 text-[0.62rem] uppercase tracking-wide2 text-gold/70">
                  {voiceStatus === "speaking" ? (
                    <span className="text-champagne">Speaking{String.fromCharCode(8230)}</span>
                  ) : voiceOn ? (
                    <span className="flex items-center gap-1.5 text-champagne">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-champagne" />
                      Listening
                    </span>
                  ) : voiceStatus === "connecting" ? (
                    <span>Connecting{String.fromCharCode(8230)}</span>
                  ) : (
                    <span>Private Concierge {String.fromCharCode(183)} Online</span>
                  )}
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-gold/90 text-black"
                      : "border border-gold/15 bg-white/[0.03] text-cream/85"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {/* Live voice transcripts stream in as they're spoken. */}
              {liveUser && (
                <div className="ml-auto max-w-[85%] bg-gold/90 px-4 py-2.5 text-sm leading-relaxed text-black opacity-80">
                  {liveUser}
                </div>
              )}
              {liveTory && (
                <div className="max-w-[85%] border border-gold/15 bg-white/[0.03] px-4 py-2.5 text-sm leading-relaxed text-cream/85">
                  {liveTory}
                </div>
              )}
              {busy && (
                <div className="border border-gold/15 bg-white/[0.03] px-4 py-2.5 text-sm text-gold/60">
                  Checking the book...
                </div>
              )}
            </div>

            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 px-5 pb-3">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="border border-gold/25 px-3 py-1.5 text-[0.66rem] uppercase tracking-wide2 text-champagne transition-colors hover:border-gold/60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-gold/15 p-3"
            >
              {/* Tap to talk to Tory by voice (Gemini live native audio). */}
              <button
                type="button"
                onClick={() => (voiceOn || voiceStatus === "connecting" ? endVoice() : startVoice())}
                aria-label={voiceOn ? "End voice call with Tory" : "Talk to Tory by voice"}
                title={voiceOn ? "End voice call" : "Talk to Tory"}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  voiceOn || voiceStatus === "connecting"
                    ? "border-red-400/60 bg-red-500/20 text-red-200 hover:bg-red-500/30"
                    : "border-gold/40 text-gold hover:border-gold hover:text-champagne"
                }`}
              >
                {voiceOn || voiceStatus === "connecting" ? (
                  // hang-up
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85a.97.97 0 0 1-1.34 0L.29 13.08a.97.97 0 0 1 0-1.37C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.71a.97.97 0 0 1 0 1.37l-2.55 2.49a.97.97 0 0 1-1.34 0 12.4 12.4 0 0 0-2.66-1.85.99.99 0 0 1-.56-.9v-3.1A15.6 15.6 0 0 0 12 9Z" />
                  </svg>
                ) : (
                  // mic
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
                    <path d="M17 11a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2Z" />
                  </svg>
                )}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={voiceOn ? "Listening — or type..." : "Ask the concierge..."}
                className="flex-1 bg-transparent px-2 py-2 text-sm text-cream outline-none placeholder:text-cream/30"
              />
              <button
                type="submit"
                disabled={busy}
                className="bg-gold px-4 py-2 text-[0.66rem] uppercase tracking-wide2 text-black transition-colors hover:bg-champagne disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
