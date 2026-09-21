import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listFindings, type Finding, type FindingLane } from "@/api/client";

const laneLabel: Record<FindingLane, string> = {
  risk: "Risk & Compliance",
  efficiency: "Efficiency",
  cost: "Cost",
};

const laneVariant: Record<
  FindingLane,
  "default" | "secondary" | "outline" | "destructive"
> = {
  risk: "destructive",
  efficiency: "secondary",
  cost: "outline",
};

export function FindingsPage() {
  const navigate = useNavigate();
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openedId, setOpenedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listFindings();
        if (!cancelled) setFindings(data);
      } catch {
        if (!cancelled) setError("Could not load findings (stub).");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function openFinding(id: string) {
    setOpenedId(id);
    // Detail screen is out of v1 ship (screens 1→3); stub open.
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary">Step 3 of 3</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Findings</h1>
          <p className="max-w-xl text-muted-foreground text-base leading-relaxed">
            Sorted and scored hits from your sources. Open a finding to review
            evidence — detail trail ships next.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/signals")}>
          Adjust signals
        </Button>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Scoring hits…
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && findings.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">No findings yet</CardTitle>
            <CardDescription>
              Connect sources and start analysis to populate this hub.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")}>Connect sources</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {findings.map((f) => (
          <Card
            key={f.id}
            className="transition-colors hover:bg-accent/30"
          >
            <CardHeader className="flex flex-col gap-3 space-y-0 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={laneVariant[f.lane]}>
                    {laneLabel[f.lane]}
                  </Badge>
                  <Badge variant="outline">
                    Score {(f.score * 100).toFixed(0)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {f.evidenceCount} evidence · {f.source}
                  </span>
                </div>
                <CardTitle className="text-base leading-snug">
                  {f.title}
                </CardTitle>
                <CardDescription className="max-w-2xl">
                  {f.summary}
                </CardDescription>
              </div>
              <Button
                size="sm"
                className="shrink-0"
                onClick={() => openFinding(f.id)}
              >
                Open finding
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardHeader>
            {openedId === f.id && (
              <CardContent className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Finding detail is a stub (screen 4). Evidence trail and
                  “propose fix” ship next. Selected:{" "}
                  <span className="font-medium text-foreground">{f.id}</span>
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
