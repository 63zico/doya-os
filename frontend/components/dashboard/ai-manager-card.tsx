import { Bot, CheckCircle2, Sparkles } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import type { dashboardData } from "@/lib/mock-data";

type AiManagerCardProps = {
  aiManager: typeof dashboardData.aiManager;
};

export function AiManagerCard({ aiManager }: AiManagerCardProps) {
  return (
    <DashboardCard
      title={aiManager.title}
      eyebrow="AI Manager"
      action={<StatusBadge tone="ai" label={aiManager.status} />}
      className="lg:col-span-8"
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-ai/20 bg-ai-subtle p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ai">
            <Bot aria-hidden="true" className="size-4" />
            Evidence-linked report · {aiManager.generatedAt} · Confidence{" "}
            {aiManager.confidence}
          </div>
          <p className="mt-2 text-sm leading-6 text-foreground">
            {aiManager.summary}
          </p>
        </div>
        <div className="grid gap-2">
          {aiManager.recommendations.map((recommendation) => (
            <div
              key={recommendation}
              className="flex items-start gap-3 rounded-md border border-border bg-surface-subtle px-3 py-2"
            >
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-ai"
              />
              <p className="text-sm leading-5">{recommendation}</p>
            </div>
          ))}
        </div>
        <Button type="button">
          <Sparkles aria-hidden="true" />
          Open AI Manager report
        </Button>
      </div>
    </DashboardCard>
  );
}
