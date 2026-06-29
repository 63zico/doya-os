"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { HumanReviewItem } from "@/lib/ai-closing-data";

type HumanReviewQueueProps = {
  items: HumanReviewItem[];
};

type ReviewDecision = "APPROVED" | "REJECTED";

export function HumanReviewQueue({ items }: HumanReviewQueueProps) {
  const [queueItems, setQueueItems] = useState(items);
  const [decisions, setDecisions] = useState<Record<string, ReviewDecision>>(
    {},
  );
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;

    async function loadQueue() {
      try {
        const response = await fetch("/api/ai-closing/reviews", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const body = (await response.json()) as { items: HumanReviewItem[] };

        if (active) {
          setQueueItems(body.items);
        }
      } catch {
        // The initial queue is the mock fallback.
      }
    }

    void loadQueue();

    return () => {
      active = false;
    };
  }, []);

  async function saveDecision(itemId: string, decision: ReviewDecision) {
    setError(undefined);
    setDecisions((current) => ({
      ...current,
      [itemId]: decision,
    }));

    try {
      const response = await fetch("/api/ai-closing/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId: itemId,
          decision: decision === "APPROVED" ? "approved" : "rejected",
        }),
      });

      if (!response.ok) {
        throw new Error("Review decision could not be saved.");
      }
    } catch (decisionError) {
      setError(
        decisionError instanceof Error
          ? decisionError.message
          : "Review decision could not be saved.",
      );
    }
  }

  if (queueItems.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold">No reviews waiting</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          There are no failed or uncertain closing submissions for the current
          business date.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <Card className="border-danger/30 bg-danger-subtle p-3">
          <p className="text-sm font-medium">{error}</p>
        </Card>
      ) : null}

      {queueItems.map((item) => {
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
                  <Button type="button" onClick={() => saveDecision(item.id, "APPROVED")}>
                    <CheckCircle2 aria-hidden="true" />
                    Approve evidence
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => saveDecision(item.id, "REJECTED")}
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
                    This decision has been sent to the active repository. In
                    mock mode it remains local; in Supabase mode it is audited.
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
