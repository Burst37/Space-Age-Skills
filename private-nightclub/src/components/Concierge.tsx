"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { springs } from "@/lib/motion";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "VIP table pricing",
  "Dress code",
  "Tonight's event",
  "Birthday packages",
  "Parking",
];

const GREETING =
  "Good evening. I'm the Private concierge. Ask me about tables, bottle service, dress code, parking, events, or the guestlist.";

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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

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
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close concierge" : "Open concierge"}
        className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-black/80 text-gold shadow-lift backdrop-blur-xl transition-colors hover:border-gold hover:text-champagne md:bottom-6 md:right-6"
      >
        <span className="display text-2xl leading-none">{open ? "×" : "C"}</span>
        {!open && <span className="absolute inset-0 animate-drift rounded-full ring-1 ring-gold/20" />}
      </button>

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
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-gold">
                <span className="display text-lg">P</span>
              </span>
              <div>
                <div className="text-sm text-cream">Private Concierge</div>
                <div className="text-[0.62rem] uppercase tracking-wide2 text-gold/70">Online now</div>
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
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the concierge..."
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
