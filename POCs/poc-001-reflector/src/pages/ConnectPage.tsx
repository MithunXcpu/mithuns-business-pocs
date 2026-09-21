import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { connectSources, type SourceKind } from "@/api/client";

const SOURCES: {
  id: SourceKind;
  title: string;
  description: string;
  icon: typeof Mail;
}[] = [
  {
    id: "chat",
    title: "Chat",
    description: "Slack / Teams threads where work questions pile up",
    icon: MessageSquare,
  },
  {
    id: "email",
    title: "Email",
    description: "Mailbox threads for ops, compliance, and handoffs",
    icon: Mail,
  },
];

export function ConnectPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<SourceKind[]>(["chat", "email"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<SourceKind[] | null>(null);

  function toggle(id: SourceKind) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
    setError(null);
  }

  async function handleConnect() {
    if (selected.length === 0) {
      setError("Select at least one source to continue.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await connectSources({ sources: selected });
      if (!res.ok) {
        setError("Could not connect sources. Try again.");
        return;
      }
      setConnected(res.connected);
      navigate("/signals");
    } catch {
      setError("Connection failed (stub). Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <Badge variant="secondary">Step 1 of 3</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">
          Connect your sources
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Grant Reflector read access to chat and email so we can surface
          repeated questions and tasks. Nothing is automated until you choose
          signals and start analysis.
        </p>
      </div>

      <div className="grid gap-4">
        {SOURCES.map((source) => {
          const Icon = source.icon;
          const isOn = selected.includes(source.id);
          return (
            <Card
              key={source.id}
              className={
                isOn ? "border-primary/40 ring-1 ring-primary/20" : undefined
              }
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base">{source.title}</CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </div>
                <Checkbox
                  id={`source-${source.id}`}
                  checked={isOn}
                  onCheckedChange={() => toggle(source.id)}
                  aria-label={`Grant ${source.title} access`}
                />
              </CardHeader>
              <CardContent className="pt-0 pl-[4.5rem]">
                <p className="text-xs text-muted-foreground">
                  Contractor onboarding stub — OAuth / scopes wired later.
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {connected && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Connected: {connected.join(", ")}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          One clear next step: connect, then choose what to look for.
        </p>
        <Button
          size="lg"
          onClick={handleConnect}
          disabled={loading || selected.length === 0}
        >
          {loading && <Loader2 className="animate-spin" />}
          Connect sources
        </Button>
      </div>
    </div>
  );
}
