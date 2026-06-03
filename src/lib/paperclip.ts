/**
 * Paperclip API client for Space Age Agent OS.
 *
 * Paperclip runs as a separate Node.js process at PAPERCLIP_API_URL (default
 * http://localhost:3100). This module provides typed fetch helpers so Space
 * Age components can pull live agent state, tasks, goals, and cost data from
 * Paperclip's control plane instead of static fixtures.
 *
 * Usage:
 *   import { getAgents, getIssues } from "@/lib/paperclip"
 *   const agents = await getAgents()
 *
 * Requires Paperclip running:  cd tools/paperclip && pnpm dev
 */

const BASE = (process.env.PAPERCLIP_API_URL ?? "http://localhost:3100").replace(/\/$/, "");
const API_KEY = process.env.PAPERCLIP_API_KEY ?? "";

// ─── Core types mirrored from @paperclipai/shared ─────────────────────────

export interface PaperclipAgent {
  id: string;
  shortName: string;
  name: string;
  role: string;
  adapterType: string;
  companyId: string;
  reportsToAgentId: string | null;
  budgetMonthlyUsdLimit: number | null;
  budgetMonthlyUsdSpent: number | null;
  status: "active" | "paused" | "terminated";
  lastHeartbeatAt: string | null;
  capabilities: string | null;
}

export interface PaperclipCompany {
  id: string;
  name: string;
  mission: string | null;
  status: "active" | "archived";
  createdAt: string;
}

export interface PaperclipIssue {
  id: string;
  identifier: string;
  title: string;
  description: string | null;
  status: "backlog" | "todo" | "in_progress" | "in_review" | "done" | "cancelled" | "blocked";
  priority: "urgent" | "high" | "medium" | "low" | "none";
  assigneeAgentId: string | null;
  companyId: string;
  projectId: string | null;
  parentIssueId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaperclipGoal {
  id: string;
  title: string;
  description: string | null;
  status: "active" | "achieved" | "missed" | "archived";
  companyId: string;
  parentGoalId: string | null;
  dueDate: string | null;
}

export interface PaperclipBudget {
  agentId: string;
  periodStart: string;
  periodEnd: string;
  limitUsd: number | null;
  spentUsd: number;
  percentUsed: number | null;
}

export interface PaperclipHeartbeatRun {
  id: string;
  agentId: string;
  companyId: string;
  status: "running" | "completed" | "failed" | "cancelled";
  startedAt: string;
  completedAt: string | null;
  tokenInputCount: number | null;
  tokenOutputCount: number | null;
  costUsd: number | null;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Paperclip API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ─── Company ──────────────────────────────────────────────────────────────

export async function getCompanies(): Promise<PaperclipCompany[]> {
  return apiFetch<PaperclipCompany[]>("/companies");
}

export async function getCompany(id: string): Promise<PaperclipCompany> {
  return apiFetch<PaperclipCompany>(`/companies/${id}`);
}

// ─── Agents ───────────────────────────────────────────────────────────────

export async function getAgents(companyId?: string): Promise<PaperclipAgent[]> {
  const qs = companyId ? `?companyId=${companyId}` : "";
  return apiFetch<PaperclipAgent[]>(`/agents${qs}`);
}

export async function getAgent(agentId: string): Promise<PaperclipAgent> {
  return apiFetch<PaperclipAgent>(`/agents/${agentId}`);
}

// ─── Issues / Tasks ───────────────────────────────────────────────────────

export interface ListIssuesOptions {
  companyId?: string;
  assigneeAgentId?: string;
  status?: string;
  projectId?: string;
  limit?: number;
}

export async function getIssues(opts: ListIssuesOptions = {}): Promise<PaperclipIssue[]> {
  const params = new URLSearchParams();
  if (opts.companyId) params.set("companyId", opts.companyId);
  if (opts.assigneeAgentId) params.set("assigneeAgentId", opts.assigneeAgentId);
  if (opts.status) params.set("status", opts.status);
  if (opts.projectId) params.set("projectId", opts.projectId);
  if (opts.limit) params.set("limit", String(opts.limit));
  const qs = params.toString() ? `?${params}` : "";
  return apiFetch<PaperclipIssue[]>(`/issues${qs}`);
}

export async function checkoutIssue(issueId: string, agentId: string, runId: string): Promise<void> {
  await apiFetch(`/issues/${issueId}/checkout`, {
    method: "POST",
    headers: { "X-Paperclip-Run-Id": runId },
    body: JSON.stringify({ agentId, expectedStatuses: ["todo", "backlog", "in_review"] }),
  });
}

export async function updateIssue(
  issueId: string,
  patch: Partial<Pick<PaperclipIssue, "status" | "title" | "description">>,
  runId?: string,
): Promise<PaperclipIssue> {
  return apiFetch<PaperclipIssue>(`/issues/${issueId}`, {
    method: "PATCH",
    headers: runId ? { "X-Paperclip-Run-Id": runId } : {},
    body: JSON.stringify(patch),
  });
}

export async function addComment(issueId: string, body: string, runId?: string): Promise<void> {
  await apiFetch(`/issues/${issueId}/comments`, {
    method: "POST",
    headers: runId ? { "X-Paperclip-Run-Id": runId } : {},
    body: JSON.stringify({ body }),
  });
}

// ─── Goals ────────────────────────────────────────────────────────────────

export async function getGoals(companyId: string): Promise<PaperclipGoal[]> {
  return apiFetch<PaperclipGoal[]>(`/goals?companyId=${companyId}`);
}

// ─── Cost / Budget ────────────────────────────────────────────────────────

export async function getAgentBudget(agentId: string): Promise<PaperclipBudget> {
  return apiFetch<PaperclipBudget>(`/agents/${agentId}/budget`);
}

export async function getHeartbeatRuns(agentId: string, limit = 20): Promise<PaperclipHeartbeatRun[]> {
  return apiFetch<PaperclipHeartbeatRun[]>(`/agents/${agentId}/runs?limit=${limit}`);
}

// ─── Health check ─────────────────────────────────────────────────────────

export async function pingPaperclip(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}
