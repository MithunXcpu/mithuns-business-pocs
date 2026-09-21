/**
 * API client for Reflector POC.
 *
 * - If `import.meta.env.VITE_API_BASE` is set (e.g. http://localhost:8787),
 *   calls the real REST endpoints on that base.
 * - If unset, keeps offline stub/mock behavior (same MOCK_FINDINGS).
 *
 * See `.env.example` and `server/README.md`.
 */

export type SourceKind = "chat" | "email";

export interface ConnectSourcesRequest {
  sources: SourceKind[];
}

export interface ConnectSourcesResponse {
  ok: boolean;
  connected: SourceKind[];
}

export interface SignalOption {
  id: string;
  label: string;
  description: string;
}

export interface StartAnalysisRequest {
  signalIds: string[];
}

export interface StartAnalysisResponse {
  ok: boolean;
  jobId: string;
}

export type FindingLane = "risk" | "efficiency" | "cost";

export interface Finding {
  id: string;
  title: string;
  score: number;
  lane: FindingLane;
  summary: string;
  evidenceCount: number;
  source: string;
}

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

/** Base URL without trailing slash. Empty → stubs. */
const API_BASE = String(import.meta.env.VITE_API_BASE ?? "")
  .trim()
  .replace(/\/+$/, "");

const useLive = API_BASE.length > 0;

async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const SIGNAL_OPTIONS: SignalOption[] = [
  {
    id: "repeated-questions",
    label: "Repeated questions",
    description: "Same ask across chat/email with no durable answer",
  },
  {
    id: "repeated-tasks",
    label: "Repeated tasks",
    description: "Manual work that shows up in loops",
  },
  {
    id: "handoff-gaps",
    label: "Handoff gaps",
    description: "Work that stalls when people change shifts or tools",
  },
  {
    id: "compliance-asks",
    label: "Compliance asks",
    description: "Policy, audit, and risk questions that recur",
  },
  {
    id: "cost-leakage",
    label: "Cost leakage",
    description: "Duplicate spend or rework that burns budget",
  },
];

const MOCK_FINDINGS: Finding[] = [
  {
    id: "f-001",
    title: "Invoice status asked 14× / week in Slack",
    score: 0.94,
    lane: "efficiency",
    summary:
      "Ops repeatedly asks AP for invoice status; no shared tracker or bot reply.",
    evidenceCount: 47,
    source: "chat",
  },
  {
    id: "f-002",
    title: "Safety checklist emailed as freeform PDF",
    score: 0.88,
    lane: "risk",
    summary:
      "Field teams email completed checklists; no structured capture or exception flag.",
    evidenceCount: 31,
    source: "email",
  },
  {
    id: "f-003",
    title: "Duplicate vendor onboarding across regions",
    score: 0.81,
    lane: "cost",
    summary:
      "Same vendor paperwork restarted per region — estimated rework ~$18k/qtr.",
    evidenceCount: 22,
    source: "email",
  },
  {
    id: "f-004",
    title: "Shift handoff questions pile up overnight",
    score: 0.76,
    lane: "efficiency",
    summary:
      "Overnight chat threads re-ask daytime decisions; no durable handoff note.",
    evidenceCount: 19,
    source: "chat",
  },
  {
    id: "f-005",
    title: "Insurance cert expiry chased manually",
    score: 0.71,
    lane: "risk",
    summary:
      "Compliance emails vendors for COI renewals with no calendar trigger.",
    evidenceCount: 15,
    source: "email",
  },
];

export async function connectSources(
  req: ConnectSourcesRequest
): Promise<ConnectSourcesResponse> {
  if (useLive) {
    return apiFetch<ConnectSourcesResponse>("/api/sources/connect", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }
  await delay();
  return { ok: true, connected: req.sources };
}

export async function startAnalysis(
  req: StartAnalysisRequest
): Promise<StartAnalysisResponse> {
  if (useLive) {
    return apiFetch<StartAnalysisResponse>("/api/analysis/start", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }
  await delay(600);
  return {
    ok: true,
    jobId: `job-${req.signalIds.join("-").slice(0, 24) || "default"}`,
  };
}

export async function listFindings(): Promise<Finding[]> {
  if (useLive) {
    return apiFetch<Finding[]>("/api/findings");
  }
  await delay();
  return [...MOCK_FINDINGS].sort((a, b) => b.score - a.score);
}

export async function getFinding(id: string): Promise<Finding | null> {
  if (useLive) {
    const res = await fetch(`${API_BASE}/api/findings/${encodeURIComponent(id)}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 404) return null;
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`API ${res.status}: ${text || res.statusText}`);
    }
    return res.json() as Promise<Finding>;
  }
  await delay(200);
  return MOCK_FINDINGS.find((f) => f.id === id) ?? null;
}
