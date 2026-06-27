import { handleSubmission } from "@/lib/submit";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  // Capture the email into the signups list (best-effort), then run the shared
  // submission handler. Clone the request so the body can be read twice.
  try {
    const data = (await req.clone().json()) as { email?: string; name?: string };
    const email = String(data?.email ?? "").trim().toLowerCase();
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      await db()
        .from("signups")
        .upsert(
          { email, name: data?.name?.slice(0, 80) ?? null, source: "guestlist" },
          { onConflict: "email", ignoreDuplicates: true },
        );
    }
  } catch (err) {
    console.error("[guestlist] signup persist failed:", err);
  }

  return handleSubmission(req, {
    required: ["name", "phone", "email", "date", "partySize"],
    webhookEnv: "GUESTLIST_WEBHOOK_URL",
    label: "guestlist",
  });
}
