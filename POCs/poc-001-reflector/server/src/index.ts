/**
 * Thin Reflector POC API — node:http + CORS for Vite.
 * Port: PORT env or 8787.
 */

import http from "node:http";
import { URL } from "node:url";
import {
  connectSources,
  startAnalysis,
  listFindings,
  getFinding,
  type SourceKind,
} from "./store.js";

const PORT = Number(process.env.PORT) || 8787;
const VALID_SOURCES = new Set(["chat", "email"]);

function setCors(res: http.ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function json(
  res: http.ServerResponse,
  status: number,
  body: unknown
): void {
  setCors(res);
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function parseJson(
  req: http.IncomingMessage
): Promise<unknown> {
  const raw = await readBody(req);
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const host = req.headers.host ?? `localhost:${PORT}`;
  const url = new URL(req.url ?? "/", `http://${host}`);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  try {
    if (req.method === "POST" && path === "/api/sources/connect") {
      const body = (await parseJson(req)) as { sources?: unknown };
      if (!Array.isArray(body.sources)) {
        json(res, 400, { ok: false, error: "sources must be an array" });
        return;
      }
      const sources = body.sources.filter(
        (s): s is SourceKind =>
          typeof s === "string" && VALID_SOURCES.has(s)
      );
      const connected = connectSources(sources);
      json(res, 200, { ok: true, connected });
      return;
    }

    if (req.method === "POST" && path === "/api/analysis/start") {
      const body = (await parseJson(req)) as { signalIds?: unknown };
      if (!Array.isArray(body.signalIds)) {
        json(res, 400, { ok: false, error: "signalIds must be an array" });
        return;
      }
      const signalIds = body.signalIds.map(String);
      const jobId = startAnalysis(signalIds);
      json(res, 200, { ok: true, jobId });
      return;
    }

    if (req.method === "GET" && path === "/api/findings") {
      json(res, 200, listFindings());
      return;
    }

    const findingMatch = path.match(/^\/api\/findings\/([^/]+)$/);
    if (req.method === "GET" && findingMatch) {
      const id = decodeURIComponent(findingMatch[1]);
      const finding = getFinding(id);
      if (!finding) {
        json(res, 404, { error: "not found" });
        return;
      }
      json(res, 200, finding);
      return;
    }

    if (req.method === "GET" && (path === "/" || path === "/health")) {
      json(res, 200, { ok: true, service: "reflector-poc-api" });
      return;
    }

    json(res, 404, { error: "not found" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "server error";
    json(res, 500, { error: message });
  }
});

server.listen(PORT, () => {
  console.log(`Reflector POC API listening on http://localhost:${PORT}`);
});
