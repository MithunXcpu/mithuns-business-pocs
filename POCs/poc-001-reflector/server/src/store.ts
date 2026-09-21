/**
 * In-memory store with optional JSON persistence under server/data/.
 * Seeded with the same MOCK_FINDINGS as src/api/client.ts.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

export type SourceKind = "chat" | "email";
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

export interface PersistShape {
  connected: SourceKind[];
  jobs: Record<string, { signalIds: string[]; createdAt: string }>;
  findingsReady: boolean;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const STATE_PATH = join(DATA_DIR, "state.json");

/** Same seed data as frontend MOCK_FINDINGS */
export const SEED_FINDINGS: Finding[] = [
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

const VALID_SOURCES = new Set<SourceKind>(["chat", "email"]);

let connected: SourceKind[] = [];
let jobs: Record<string, { signalIds: string[]; createdAt: string }> = {};
let findingsReady = true; // findings available from seed; startAnalysis ensures ready

function load(): void {
  if (!existsSync(STATE_PATH)) return;
  try {
    const raw = readFileSync(STATE_PATH, "utf8");
    const data = JSON.parse(raw) as PersistShape;
    connected = Array.isArray(data.connected)
      ? data.connected.filter((s): s is SourceKind => VALID_SOURCES.has(s as SourceKind))
      : [];
    jobs = data.jobs && typeof data.jobs === "object" ? data.jobs : {};
    findingsReady = data.findingsReady !== false;
  } catch {
    // corrupt file — start fresh
  }
}

function save(): void {
  mkdirSync(DATA_DIR, { recursive: true });
  const payload: PersistShape = { connected, jobs, findingsReady };
  writeFileSync(STATE_PATH, JSON.stringify(payload, null, 2) + "\n", "utf8");
}

load();

export function connectSources(sources: SourceKind[]): SourceKind[] {
  const next = new Set(connected);
  for (const s of sources) {
    if (VALID_SOURCES.has(s)) next.add(s);
  }
  connected = [...next];
  save();
  return [...connected];
}

export function getConnected(): SourceKind[] {
  return [...connected];
}

/** Stable jobId for the same signalIds set (order-independent). */
export function jobIdForSignals(signalIds: string[]): string {
  const key = [...signalIds].map(String).sort().join("|") || "default";
  const hash = createHash("sha256").update(key).digest("hex").slice(0, 12);
  return `job-${hash}`;
}

export function startAnalysis(signalIds: string[]): string {
  const jobId = jobIdForSignals(signalIds);
  if (!jobs[jobId]) {
    jobs[jobId] = {
      signalIds: [...signalIds],
      createdAt: new Date().toISOString(),
    };
  }
  findingsReady = true;
  save();
  return jobId;
}

export function listFindings(): Finding[] {
  if (!findingsReady) return [];
  return [...SEED_FINDINGS].sort((a, b) => b.score - a.score);
}

export function getFinding(id: string): Finding | null {
  if (!findingsReady) return null;
  return SEED_FINDINGS.find((f) => f.id === id) ?? null;
}
