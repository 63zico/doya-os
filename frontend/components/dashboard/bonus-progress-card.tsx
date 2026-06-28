import { Gauge } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { dashboardData } from "@/lib/mock-data";

type BonusProgressCardProps = {
  bonus: typeof dashboardData.bonus;
};

export function BonusProgressCard({ bonus }: BonusProgressCardProps) {
  return (
    <DashboardCard
      title={bonus.title}
      eyebrow="Bonus Engine"
      action={<StatusBadge tone="danger" label={bonus.status} />}
      className="lg:col-span-4"
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {bonus.summary}
        </p>
        <div className="space-y-3">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Store Level</span>
              <span className="tabular-nums">{bonus.storeLevel}%</span>
            </div>
            <Progress value={bonus.storeLevel} indicatorClassName="bg-warning" />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Cooperation Score</span>
              <span className="tabular-nums">{bonus.cooperationScore}%</span>
            </div>
            <Progress
              value={bonus.cooperationScore}
              indicatorClassName="bg-success"
            />
          </div>
        </div>
        <div className="rounded-md border border-danger/20 bg-danger-subtle p-3 text-sm text-danger">
          Unlock status: {bonus.unlockStatus}. Owner decision remains blocked
          until manager confirmation.
        </div>
        <Button className="w-full" type="button" variant="secondary">
          <Gauge aria-hidden="true" />
          Review bonus blockers
        </Button>
      </div>
    </DashboardCard>
  );
}
