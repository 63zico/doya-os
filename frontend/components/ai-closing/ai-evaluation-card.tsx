import Link from "next/link";
import { Bot, CheckCircle2, ClipboardCheck, RotateCcw, ShieldAlert } from "lucide-react";
import { AiClosingStatusBadge } from "@/components/ai-closing/ai-closing-status-badge";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { AiEvaluationResult, ClosingZone } from "@/lib/ai-closing-data";

type AiEvaluationCardProps = {
  result: AiEvaluationResult;
  zone: ClosingZone;
};

export function AiEvaluationCard({ result, zone }: AiEvaluationCardProps) {
  const confidencePercent = Math.round(result.confidence * 100);
  const score = result.status === "ANALYZING" ? 0 : result.score;

  return (
    <DashboardCard
      title={`${zone.label} result`}
      eyebrow={`${zone.owner} closing`}
      action={<AiClosingStatusBadge status={result.status} />}
    >
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-border bg-surface-subtle p-3">
            <p className="text-xs font-medium text-muted-foreground">Score</p>
            <p className="mt-1 tabular-nums text-2xl font-semibold">
              {result.status === "ANALYZING" ? "Pending" : score}
            </p>
          </div>
          <div className="rounded-md border border-border bg-surface-subtle p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Confidence
            </p>
            <p className="mt-1 tabular-nums text-2xl font-semibold">
              {result.status === "ANALYZING" ? "Pending" : `${confidencePercent}%`}
            </p>
          </div>
          <div className="rounded-md border border-border bg-surface-subtle p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Timestamp
            </p>
            <p className="mt-1 text-sm font-semibold">
              {new Intl.DateTimeFormat("en", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }).format(new Date(result.timestamp))}
            </p>
          </div>
        </div>

        {result.status !== "ANALYZING" ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>AI confidence</span>
              <span className="tabular-nums">{confidencePercent}%</span>
            </div>
            <Progress value={confidencePercent} indicatorClassName="bg-ai" />
          </div>
        ) : null}

        <div className="rounded-md border border-border bg-surface-subtle p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Bot aria-hidden="true" className="size-4 text-ai" />
            AI reason
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {result.reason}
          </p>
        </div>

        <div className="rounded-md border border-border bg-surface-base p-4">
          <p className="text-sm font-semibold">Required action</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {result.requiredAction}
          </p>
        </div>

        {result.status === "FAIL" ? (
          <div className="rounded-md border border-danger/30 bg-danger-subtle p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <RotateCcw aria-hidden="true" className="size-4" />
              Re-clean instruction
            </div>
            <p className="mt-2 text-sm leading-6">
              Clean the visible problem area again, capture fresh evidence, and
              resubmit. The failed result remains auditable.
            </p>
            <Button asChild className="mt-3" variant="danger">
              <Link href={`/ai-closing/capture/${zone.id}`}>
                <RotateCcw aria-hidden="true" />
                Resubmit photo
              </Link>
            </Button>
          </div>
        ) : null}

        {result.status === "HUMAN_REVIEW" ? (
          <div className="rounded-md border border-warning/30 bg-warning-subtle p-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldAlert aria-hidden="true" className="size-4" />
              Manager review required
            </div>
            <p className="mt-2 text-sm leading-6">
              A manager must approve the evidence or reject it and assign
              re-cleaning. AI is not the final authority for this submission.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href="/ai-closing/review">
                  <CheckCircle2 aria-hidden="true" />
                  Approve in queue
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/ai-closing/review">
                  <ClipboardCheck aria-hidden="true" />
                  Reject in queue
                </Link>
              </Button>
            </div>
          </div>
        ) : null}

        <dl className="grid gap-2 border-t border-border pt-4 text-xs text-muted-foreground sm:grid-cols-2">
          <div>
            <dt className="font-medium">Model</dt>
            <dd className="mt-1 font-mono">{result.model}</dd>
          </div>
          <div>
            <dt className="font-medium">Policy version</dt>
            <dd className="mt-1 font-mono">{result.policyVersion}</dd>
          </div>
        </dl>
      </div>
    </DashboardCard>
  );
}
