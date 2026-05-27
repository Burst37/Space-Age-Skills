import { NextRequest, NextResponse } from "next/server";
import { appendJournalEntry, readJournal, listJournalDays, todayISO } from "@/lib/vaultWriter";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || todayISO();
  const list = searchParams.get("list");
  if (list) return NextResponse.json({ days: await listJournalDays() });
  return NextResponse.json({ date, content: await readJournal(date) });
}
export async function POST(req: NextRequest) {
  const { content } = await req.json() as { content: string };
  await appendJournalEntry(content);
  return NextResponse.json({ ok: true });
}
