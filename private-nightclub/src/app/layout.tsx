import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit, Anton } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { venue } from "@/lib/site";

/**
 * Self-hosted at build time by next/font, so there is no runtime Google Fonts
 * link. Cormorant carries the editorial-luxury display voice; Outfit handles
 * clean UI and body. Neither is on the banned default-serif list.
 */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

// Heavy condensed display face for the full-screen hero wordmark. Anton is
// tall and narrow, so the glyphs fill the viewport height while a long word
// like NIGHTCLUB still fits the width — exactly the reference look.
const condensed = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-condensed",
  display: "swap",
});

const title = `${venue.fullName} | ${venue.tagline}`;
const description = `${venue.fullName} is ${venue.city}'s flagship luxury nightlife venue. VIP tables, bottle service, weekend events, and the Black Card. Reserve a table or join the guestlist.`;

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "St. Louis nightclub",
    "VIP bottle service St. Louis",
    "luxury nightlife",
    "table reservations",
    "guestlist",
    venue.fullName,
  ],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: venue.fullName,
    images: [{ url: "/video/poster.svg", width: 1470, height: 630, alt: venue.fullName }],
  },
  twitter: { card: "summary_large_image", title, description },
  metadataBase: new URL("https://privatestl.com"),
};

export const viewport: Viewport = {
  themeColor: "#030303",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${condensed.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
