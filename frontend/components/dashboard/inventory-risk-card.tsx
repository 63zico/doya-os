import { PackageSearch } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { MetricList } from "@/components/dashboard/metric-list";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import type { dashboardData } from "@/lib/mock-data";

type InventoryRiskCardProps = {
  inventory: typeof dashboardData.inventory;
};

export function InventoryRiskCard({ inventory }: InventoryRiskCardProps) {
  return (
    <DashboardCard
      title={inventory.title}
      eyebrow="Inventory Intelligence"
      action={<StatusBadge tone="warning" label={inventory.status} />}
      className="lg:col-span-4"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm leading-6 text-muted-foreground">
            {inventory.summary}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-md border border-border bg-surface-subtle p-3">
              <p className="text-xs text-muted-foreground">Risk level</p>
              <p className="mt-1 text-lg font-semibold">
                {inventory.riskLevel}
              </p>
            </div>
            <div className="rounded-md border border-border bg-surface-subtle p-3">
              <p className="text-xs text-muted-foreground">Runout</p>
              <p className="mt-1 text-lg font-semibold">
                {inventory.projectedRunout}
              </p>
            </div>
          </div>
        </div>
        <MetricList items={inventory.items} />
        <Button className="w-full" type="button" variant="secondary">
          <PackageSearch aria-hidden="true" />
          Open inventory risk
        </Button>
      </div>
    </DashboardCard>
  );
}
