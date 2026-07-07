"use client";

/**
 * Sticky bottom conversion bar for mobile only. Always visible so RESERVE VIP
 * and GUESTLIST are never more than a thumb away.
 */
export default function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-3 border-t border-gold/20 bg-black/90 px-3 py-3 backdrop-blur-xl md:hidden">
      <a
        href="#vip"
        className="flex items-center justify-center rounded-full bg-gold py-3.5 text-[0.72rem] uppercase tracking-wide2 text-black"
      >
        Reserve VIP
      </a>
      <a
        href="#guestlist"
        className="flex items-center justify-center rounded-full border border-gold/40 py-3.5 text-[0.72rem] uppercase tracking-wide2 text-champagne"
      >
        Guestlist
      </a>
    </div>
  );
}
