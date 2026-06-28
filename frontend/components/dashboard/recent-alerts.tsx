import { AlertTriangle, Archive, Clock3 } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import type { AlertItem, StatusTone } from "@/lib/mock-data";

type RecentAlertsProps = {
  alerts: AlertItem[];
};

const severityTone: Record<AlertItem["severity"], StatusTone> = {
  critical: "danger",
  warning: "warning",
  info: "neutral",
};

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <DashboardCard
      title="Recent Alerts"
      eyebrow="Role-scoped notifications"
      action={<StatusBadge tone="danger" label={`${alerts.length} open`} />}
      className="lg:col-span-4"
    >
      <div className="space-y-3">
        {alerts.map((alert) => (
          <article
            key={alert.id}
            className="rounded-md border border-border bg-surface-subtle p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    aria-hidden="true"
                    className="size-4 shrink-0 text-warning"
                  />
                  <h3 className="truncate text-sm font-semibold leading-5">
                    {alert.title}
                  </h3>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {alert.detail}
                </p>
              </div>
              <StatusBadge
                tone={severityTone[alert.severity]}
                label={alert.severity}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{alert.source}</span>
              <span className="flex items-center gap-1">
                <Clock3 aria-hidden="true" className="size-3.5" />
                {alert.time}
              </span>
            </div>
          </article>
        ))}
        <Button className="w-full" type="button" variant="secondary">
          <Archive aria-hidden="true" />
          Open alert center
        </Button>
      </div>
    </DashboardCard>
  );
}
