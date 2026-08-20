import { NextResponse } from "next/server";
import { getStripe, DEPOSIT_CENTS } from "@/lib/stripe";

/**
 * Creates a Stripe Checkout Session for a VIP table reservation deposit and
 * returns the hosted checkout URL. The browser redirects to it; Stripe handles
 * the card details (no PCI burden here). Reservation details ride along as
 * metadata so the deposit can be matched to the booking.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    /* empty body is fine */
  }

  const str = (v: unknown) => (typeof v === "string" ? v.slice(0, 250) : "");
  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://private-nightclub.vercel.app";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: str(body.email) || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: DEPOSIT_CENTS,
            product_data: {
              name: "VIP Table Reservation Deposit",
              description: "Applied to your minimum spend at Private Nightclub.",
            },
          },
        },
      ],
      metadata: {
        name: str(body.name),
        phone: str(body.phone),
        date: str(body.date),
        partySize: str(body.partySize),
        occasion: str(body.occasion),
        intent: str(body.intent) || "table",
      },
      success_url: `${origin}/?reserved=1#vip`,
      cancel_url: `${origin}/?canceled=1#vip`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
