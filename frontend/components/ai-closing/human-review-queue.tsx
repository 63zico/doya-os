"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import type { HumanReviewItem } from "@/lib/ai-closing-data";

type HumanReviewQueueProps = {
  items: HumanReviewItem[];
};

type ReviewDecision = "APPROVED" | "REJECTED";

export function HumanReviewQueue({ items }: HumanReviewQueueProps) {
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>(
    {},
  );

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const decision = decisions[item.id];

        return (
          <DashboardCard
            key={item.id}
            title={item.title}
            eyebrow={`${item.area} review`}
            action={
              decision === "APPROVED" ? (
                <StatusBadge tone="success" label="Approved" />
              ) : decision === "REJECTED" ? (
                <StatusBadge tone="danger" label="Rejected" />
              ) : (
                <StatusBadge tone="warning" label="Manager review" />
              )
            }
          >
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="space-y-3">
                <div className="rounded-md border border-warning/30 bg-warning-subtle p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldAlert aria-hidden="true" className="size-4" />
                    Review reason
                  </div>
                  <p className="mt-2 text-sm leading-6">{item.reason}</p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.requiredAction}
                </p>
                <dl className="grid gap-2 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      Submitted by
                    </dt>
                    <dd className="mt-1">{item.submittedBy}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      Submitted
                    </dt>
                    <dd className="mt-1">{item.submittedAt}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-muted-foreground">
                      Confidence
                    </dt>
                    <dd className="mt-1 tabular-nums">
                      {Math.round(item.confidence * 100)}%
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-md border border-border bg-surface-subtle p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Mock manager action
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <Button
                    type="button"
                    onClick={() =>
                      setDecisions((current) => ({
                        ...current,
                        [item.id]: "APPROVED",
                      }))
                    }
                  >
                    <CheckCircle2 aria-hidden="true" />
                    Approve evidence
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() =>
                      setDecisions((current) => ({
                        ...current,
                        [item.id]: "REJECTED",
                      }))
                    }
                  >
                    <XCircle aria-hidden="true" />
                    Reject and re-clean
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href={`/ai-closing/result/${item.submissionId}`}>
                      View AI result
                    </Link>
                  </Button>
                </div>
                {decision ? (
                  <p className="mt-3 text-xs leading-5 text-muted-foreground">
                    This decision is local UI state only. In production it would
                    create audit and correction records.
                  </p>
                ) : null}
              </div>
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
}
