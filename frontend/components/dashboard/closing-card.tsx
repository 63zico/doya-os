import { Camera, ClipboardCheck } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { ClosingTask, dashboardData, StatusTone } from "@/lib/mock-data";

type ClosingCardProps = {
  closing: typeof dashboardData.closing;
};

const statusTone: Record<ClosingTask["status"], StatusTone> = {
  PASS: "success",
  FAIL: "danger",
  HUMAN_REVIEW: "warning",
  PENDING: "neutral",
};

const statusLabel: Record<ClosingTask["status"], string> = {
  PASS: "Pass",
  FAIL: "Fail",
  HUMAN_REVIEW: "Needs review",
  PENDING: "Pending",
};

export function ClosingCard({ closing }: ClosingCardProps) {
  return (
    <DashboardCard
      title={closing.title}
      eyebrow="AI Closing"
      action={<StatusBadge tone="warning" label={closing.status} />}
      className="lg:col-span-5"
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {closing.summary}
        </p>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Required categories complete</span>
            <span className="tabular-nums">{closing.completion}%</span>
          </div>
          <Progress value={closing.completion} indicatorClassName="bg-ai" />
        </div>
        <div className="space-y-2">
          {closing.tasks.map((task) => (
            <div
              key={task.label}
              className="flex items-start justify-between gap-3 rounded-md border border-border bg-surface-subtle px-3 py-2"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium leading-5">{task.label}</p>
                <p className="text-xs leading-4 text-muted-foreground">
                  {task.detail}
                </p>
              </div>
              <StatusBadge
                tone={statusTone[task.status]}
                label={statusLabel[task.status]}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button type="button">
            <ClipboardCheck aria-hidden="true" />
            Review queue
          </Button>
          <Button type="button" variant="secondary">
            <Camera aria-hidden="true" />
            Evidence
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
