import { NextRequest, NextResponse } from "next/server";
import { createProject } from "@/lib/videoProjects";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  const body = await req.json() as { name: string; client: string; model: string; prompt: string };
  const project = createProject(body);
  return NextResponse.json({ ok: true, project });
}
