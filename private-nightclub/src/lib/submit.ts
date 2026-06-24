import { NextResponse } from "next/server";

/**
 * Shared form handler. Validates required fields, optionally forwards the
 * submission to a configured webhook, and always logs server-side so nothing
 * is lost when no webhook is set. Frontend-ready: wire a real CRM/email by
 * setting the webhook env var, no code change required.
 */
export async function handleSubmission(
  req: Request,
  opts: { required: string[]; webhookEnv: string; label: string },
) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const missing = opts.required.filter((k) => {
    const v = payload[k];
    return v === undefined || v === null || String(v).trim() === "";
  });
  if (missing.length) {
    return NextResponse.json(
      { ok: false, error: `Missing required field(s): ${missing.join(", ")}` },
      { status: 422 },
    );
  }

  const record = {
    type: opts.label,
    receivedAt: new Date().toISOString(),
    ...payload,
  };

  const webhook = process.env[opts.webhookEnv];
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      // Do not fail the guest. Log and still acknowledge.
      console.error(`[${opts.label}] webhook forward failed:`, err);
    }
  } else {
    console.log(`[${opts.label}] submission (no webhook configured):`, record);
  }

  return NextResponse.json({ ok: true });
}
