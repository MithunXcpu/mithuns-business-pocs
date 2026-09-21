import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { SIGNAL_OPTIONS, startAnalysis } from "@/api/client";

export function SignalsPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([
    "repeated-questions",
    "repeated-tasks",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setError(null);
  }

  async function handleStart() {
    if (selected.length === 0) {
      setError("Pick at least one signal.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await startAnalysis({ signalIds: selected });
      if (!res.ok) {
        setError("Analysis could not start.");
        return;
      }
      navigate("/findings");
    } catch {
      setError("Start failed (stub). Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <Badge variant="secondary">Step 2 of 3</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          What to look for
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Choose the signals Reflector should score in your connected sources.
          Start with repeated questions and tasks — the discovery loop that
          proves value.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {SIGNAL_OPTIONS.map((opt) => (
          <Chip
            key={opt.id}
            selected={selected.includes(opt.id)}
            onClick={() => toggle(opt.id)}
          >
            {opt.label}
          </Chip>
        ))}
      </div>

      <div className="grid gap-3">
        {SIGNAL_OPTIONS.filter((o) => selected.includes(o.id)).map((opt) => (
          <Card key={opt.id}>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium">{opt.label}</CardTitle>
              <CardDescription>{opt.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
        {selected.length === 0 && (
          <Card>
            <CardHeader className="py-6">
              <CardDescription>
                No signals selected. Tap a chip above to add one, then start
                analysis.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={() => navigate("/")}>
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleStart}
          disabled={loading || selected.length === 0}
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Start analysis
        </Button>
      </div>
    </div>
  );
}
