import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { MetricList } from "@/components/dashboard/metric-list";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { dashboardData } from "@/lib/mock-data";

type StoreHealthCardProps = {
  health: typeof dashboardData.storeHealth;
};

export function StoreHealthCard({ health }: StoreHealthCardProps) {
  return (
    <DashboardCard
      title={health.title}
      eyebrow="Owner decision surface"
      action={<StatusBadge tone="warning" label={health.status} />}
      className="lg:col-span-7"
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="tabular-nums text-4xl font-semibold tracking-normal">
                {health.score}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                / 100
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {health.summary}
            </p>
          </div>
          <Button type="button" variant="secondary">
            <ShieldCheck aria-hidden="true" />
            View health
          </Button>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Store health score</span>
            <span className="flex items-center gap-1 text-success">
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
              {health.trend}
            </span>
          </div>
          <Progress value={health.score} indicatorClassName="bg-warning" />
        </div>
        <MetricList items={health.metrics} />
      </div>
    </DashboardCard>
  );
}
