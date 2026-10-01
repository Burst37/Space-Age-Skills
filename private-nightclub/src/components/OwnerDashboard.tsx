"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Item = { item: string; tab: string; category: string; count: number };
type Signup = { email: string; name: string | null; source: string | null; created_at: string };
type Metrics = {
  totals: { signups: number; opens: number };
  items: Item[];
  ctaCounts: Record<string, number>;
  topItem: string;
  busiestCategory: string;
  signups: Signup[];
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 26 } },
};

/** Glass panel borrowed from the Agentic OS mission-control, recolored gold. */
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`rounded-xl border border-gold/15 border-t-gold/30 bg-white/[0.025] p-6 backdrop-blur-xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Panel>
      <p className="text-[0.62rem] uppercase tracking-wide2 text-gold/70">{label}</p>
      <p className="display mt-3 text-[2.6rem] leading-none text-gold tabular-nums">{value}</p>
    </Panel>
  );
}

export default function OwnerDashboard() {
  const [data, setData] = useState<Metrics | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"food" | "bottle">("food");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/owner/metrics")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Failed to load."))))
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  const ranked = useMemo(
    () => (data?.items ?? []).filter((i) => i.tab === tab),
    [data, tab],
  );
  const maxCount = ranked[0]?.count ?? 0;

  async function logout() {
    await fetch("/api/owner/logout", { method: "POST" });
    router.push("/owner/login");
    router.refresh();
  }

  function exportCsv() {
    if (!data) return;
    const rows = [
      ["email", "name", "source", "created_at"],
      ...data.signups.map((s) => [s.email, s.name ?? "", s.source ?? "", s.created_at]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `private-signups-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-5 text-cream/60">
        {error}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-gold/12 pb-6">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.png" alt="Private Nightclub" className="h-12 w-12 object-contain" />
            <div>
              <p className="text-[0.62rem] uppercase tracking-brand text-gold/70">Owner · Control Room</p>
              <h1 className="display text-3xl text-cream sm:text-4xl">Tonight in numbers</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.refresh()}
              className="rounded-full border border-gold/25 px-4 py-2.5 text-[0.66rem] uppercase tracking-wide2 text-champagne transition-colors hover:border-gold/60"
            >
              Refresh
            </button>
            <button
              onClick={logout}
              className="rounded-full border border-gold/25 px-4 py-2.5 text-[0.66rem] uppercase tracking-wide2 text-cream/60 transition-colors hover:border-gold/50 hover:text-cream"
            >
              Sign out
            </button>
          </div>
        </header>

        <p className="mb-8 text-xs text-cream/40">
          Menu numbers are <span className="text-cream/70">engagement</span> — how often each card is
          opened on the site, a proxy for interest. They are not point-of-sale figures.
        </p>

        {!data ? (
          <p className="text-cream/40">Loading…</p>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            {/* Metric tiles */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Metric label="Email signups" value={data.totals.signups} />
              <Metric label="Menu opens" value={data.totals.opens} />
              <Metric label="Most-viewed item" value={data.topItem} />
              <Metric label="Busiest category" value={data.busiestCategory} />
            </div>

            {/* Menu popularity */}
            <Panel>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="display text-2xl text-cream">Menu engagement</h2>
                <div className="flex gap-2">
                  {(["food", "bottle"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`rounded-full px-4 py-2 text-[0.62rem] uppercase tracking-wide2 transition-colors ${
                        tab === t ? "bg-gold text-black" : "border border-gold/25 text-champagne"
                      }`}
                    >
                      {t === "food" ? "Food" : "Bottles"}
                    </button>
                  ))}
                </div>
              </div>
              {ranked.length === 0 ? (
                <p className="text-sm text-cream/40">No opens recorded yet.</p>
              ) : (
                <ul className="space-y-3">
                  {ranked.map((it) => (
                    <li key={it.item} className="flex items-center gap-4">
                      <span className="w-44 shrink-0 truncate text-sm text-cream/80">{it.item}</span>
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.04]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold/70 to-champagne"
                          style={{ width: `${maxCount ? (it.count / maxCount) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm tabular-nums text-champagne">{it.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
              {/* CTA performance */}
              <Panel>
                <h2 className="display mb-5 text-2xl text-cream">CTA clicks</h2>
                {Object.keys(data.ctaCounts).length === 0 ? (
                  <p className="text-sm text-cream/40">No clicks recorded yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {Object.entries(data.ctaCounts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([label, count]) => (
                        <li key={label} className="flex items-baseline justify-between gap-3 border-b border-gold/10 pb-2">
                          <span className="text-sm text-cream/75">{label}</span>
                          <span className="text-lg tabular-nums text-champagne">{count}</span>
                        </li>
                      ))}
                  </ul>
                )}
              </Panel>

              {/* Email list */}
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="display text-2xl text-cream">Email list</h2>
                  <button
                    onClick={exportCsv}
                    disabled={data.signups.length === 0}
                    className="rounded-full border border-gold/25 px-4 py-2 text-[0.62rem] uppercase tracking-wide2 text-champagne transition-colors hover:border-gold/60 disabled:opacity-40"
                  >
                    Export CSV
                  </button>
                </div>
                {data.signups.length === 0 ? (
                  <p className="text-sm text-cream/40">No signups yet.</p>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-black/80 text-[0.6rem] uppercase tracking-wide2 text-gold/60 backdrop-blur">
                        <tr>
                          <th className="py-2 pr-3 font-normal">Email</th>
                          <th className="py-2 pr-3 font-normal">Source</th>
                          <th className="py-2 font-normal">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.signups.map((s) => (
                          <tr key={s.email} className="border-t border-gold/8">
                            <td className="py-2 pr-3 text-cream/80">{s.email}</td>
                            <td className="py-2 pr-3 text-cream/45">{s.source}</td>
                            <td className="py-2 text-cream/45">
                              {new Date(s.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Panel>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
