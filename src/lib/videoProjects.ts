import fs from "fs";
import path from "path";
import { config } from "./config";

const PROJECTS_DIR = path.join(process.cwd(), ".video-projects");

export interface VideoProject {
  id: string;
  name: string;
  client: string;
  model: string;
  prompt: string;
  status: "queued" | "rendering" | "done" | "error";
  createdAt: number;
  outputPath?: string;
}

export interface RenderJob {
  id: string;
  projectId: string;
  status: "queued" | "rendering" | "done" | "error";
  startedAt: number;
  completedAt?: number;
  error?: string;
  outputUrl?: string;
}

function ensureDir() {
  fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

export function createProject(data: Omit<VideoProject, "id" | "status" | "createdAt">): VideoProject {
  ensureDir();
  const project: VideoProject = {
    ...data,
    id: `vp-${Date.now()}`,
    status: "queued",
    createdAt: Date.now(),
  };
  fs.writeFileSync(path.join(PROJECTS_DIR, `${project.id}.json`), JSON.stringify(project, null, 2));
  return project;
}

export function listProjects(): VideoProject[] {
  ensureDir();
  return fs.readdirSync(PROJECTS_DIR)
    .filter(f => f.endsWith(".json") && !f.includes("job"))
    .map(f => JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, f), "utf-8")) as VideoProject)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getRenderJob(jobId: string): RenderJob | null {
  const p = path.join(PROJECTS_DIR, `job-${jobId}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8")) as RenderJob;
}

export function listRenderJobs(): RenderJob[] {
  ensureDir();
  return fs.readdirSync(PROJECTS_DIR)
    .filter(f => f.startsWith("job-") && f.endsWith(".json"))
    .map(f => JSON.parse(fs.readFileSync(path.join(PROJECTS_DIR, f), "utf-8")) as RenderJob)
    .sort((a, b) => b.startedAt - a.startedAt);
}

export function readRenderLog(jobId: string): string {
  const p = path.join(PROJECTS_DIR, `log-${jobId}.txt`);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
}

void config; // satisfy import
