"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, ImagePlus, RotateCcw, Sparkles } from "lucide-react";
import { AiClosingStatusBadge } from "@/components/ai-closing/ai-closing-status-badge";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import type { AiClosingStatus, ClosingZone } from "@/lib/ai-closing-data";

type CaptureStage = "READY" | "PHOTO_SELECTED" | "ANALYZING" | "SUBMITTED";

type PhotoCaptureMockProps = {
  zone: ClosingZone;
};

const stageStatus: Record<CaptureStage, AiClosingStatus> = {
  READY: "PHOTO_REQUIRED",
  PHOTO_SELECTED: "PHOTO_REQUIRED",
  ANALYZING: "ANALYZING",
  SUBMITTED: "PASS",
};

export function PhotoCaptureMock({ zone }: PhotoCaptureMockProps) {
  const [stage, setStage] = useState<CaptureStage>("READY");

  return (
    <DashboardCard
      title={`${zone.label} photo`}
      eyebrow={`${zone.owner} closing`}
      action={<AiClosingStatusBadge status={stageStatus[stage]} />}
    >
      <div className="space-y-5">
        <div className="rounded-md border border-border bg-surface-subtle p-4">
          <p className="text-sm font-semibold">Required evidence</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {zone.instruction}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {zone.evidenceHint}
          </p>
        </div>

        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface-subtle p-6 text-center">
          {stage === "READY" ? (
            <>
              <Camera aria-hidden="true" className="size-10 text-muted-foreground" />
              <p className="mt-4 text-sm font-semibold">No photo selected</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Camera integration is intentionally mocked. Use the action below
                to simulate a staff photo submission for this zone.
              </p>
            </>
          ) : null}

          {stage === "PHOTO_SELECTED" ? (
            <>
              <div className="grid h-36 w-full max-w-sm grid-cols-3 gap-2 rounded-md border border-border bg-surface-base p-2">
                <div className="rounded-sm bg-muted" />
                <div className="rounded-sm bg-muted/70" />
                <div className="rounded-sm bg-muted" />
                <div className="col-span-3 rounded-sm bg-muted/60" />
              </div>
              <p className="mt-4 text-sm font-semibold">Mock evidence ready</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                The photo reference is local UI state only. No image is uploaded
                and no backend call is made.
              </p>
            </>
          ) : null}

          {stage === "ANALYZING" ? (
            <>
              <Sparkles aria-hidden="true" className="size-10 text-ai" />
              <p className="mt-4 text-sm font-semibold">Mock AI inspection running</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                The interface is showing the async inspection state defined by
                the Vision Pipeline. The result is mocked locally.
              </p>
            </>
          ) : null}

          {stage === "SUBMITTED" ? (
            <>
              <CheckCircle2 aria-hidden="true" className="size-10 text-success" />
              <p className="mt-4 text-sm font-semibold">Photo submitted</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Mock evidence has been submitted and the local evaluation state
                is ready to review.
              </p>
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {stage === "READY" ? (
            <Button type="button" onClick={() => setStage("PHOTO_SELECTED")}>
              <ImagePlus aria-hidden="true" />
              Select mock photo
            </Button>
          ) : null}

          {stage === "PHOTO_SELECTED" ? (
            <Button type="button" onClick={() => setStage("ANALYZING")}>
              <Sparkles aria-hidden="true" />
              Submit for AI inspection
            </Button>
          ) : null}

          {stage === "ANALYZING" ? (
            <Button type="button" onClick={() => setStage("SUBMITTED")}>
              <CheckCircle2 aria-hidden="true" />
              Complete mock analysis
            </Button>
          ) : null}

          {stage === "SUBMITTED" ? (
            <Button asChild>
              <Link href={`/ai-closing/result/${zone.submissionId}`}>
                <CheckCircle2 aria-hidden="true" />
                View evaluation result
              </Link>
            </Button>
          ) : null}

          <Button type="button" variant="secondary" onClick={() => setStage("READY")}>
            <RotateCcw aria-hidden="true" />
            Reset mock
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
