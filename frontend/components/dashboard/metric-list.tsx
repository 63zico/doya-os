import { StatusBadge } from "@/components/dashboard/status-badge";
import type { DashboardMetric } from "@/lib/mock-data";

type MetricListProps = {
  items: DashboardMetric[];
};

const toneLabels = {
  success: "Healthy",
  warning: "Attention",
  danger: "Critical",
  ai: "AI review",
  neutral: "Info",
} satisfies Record<DashboardMetric["tone"], string>;

export function MetricList({ items }: MetricListProps) {
  return (
    <div className="grid gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface-subtle px-3 py-2"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium leading-5 text-foreground">
              {item.label}
            </p>
            <p className="text-xs leading-4 text-muted-foreground">
              {item.detail}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="tabular-nums text-sm font-semibold">
              {item.value}
            </span>
            <StatusBadge tone={item.tone} label={toneLabels[item.tone]} />
          </div>
        </div>
      ))}
    </div>
  );
}
