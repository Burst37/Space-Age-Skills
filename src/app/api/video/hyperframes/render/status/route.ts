import { NextRequest, NextResponse } from "next/server";
import { getRenderJob, listRenderJobs, readRenderLog } from "@/lib/videoProjects";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");
  if (jobId) {
    const job = getRenderJob(jobId);
    const log = readRenderLog(jobId);
    return NextResponse.json({ job, log });
  }
  return NextResponse.json({ jobs: listRenderJobs() });
}
