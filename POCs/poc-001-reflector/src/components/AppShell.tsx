import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const steps = [
  { to: "/", label: "Connect", step: 1 },
  { to: "/signals", label: "Signals", step: 2 },
  { to: "/findings", label: "Findings", step: 3 },
] as const;

export function AppShell() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold">
              R
            </div>
            <span className="text-lg font-semibold tracking-tight">Reflector</span>
          </div>
          <nav className="flex items-center gap-1" aria-label="Main">
            {steps.map((s) => (
              <NavLink
                key={s.to}
                to={s.to}
                end={s.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )
                }
              >
                <span className="mr-1.5 hidden text-xs text-muted-foreground sm:inline">
                  {s.step}.
                </span>
                {s.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
