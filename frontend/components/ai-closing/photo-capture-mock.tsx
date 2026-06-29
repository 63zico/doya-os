"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ImagePlus,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { AiClosingStatusBadge } from "@/components/ai-closing/ai-closing-status-badge";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import type { AiClosingStatus, ClosingZone } from "@/lib/ai-closing-data";
import {
  mapEvaluationToUiResult,
  type VisionEvaluationResponse,
} from "@/lib/ai-closing/evaluation";

type CaptureStage = "READY" | "PHOTO_SELECTED" | "ANALYZING" | "SUBMITTED" | "ERROR";

type PhotoCaptureMockProps = {
  zone: ClosingZone;
};

const stageStatus: Record<CaptureStage, AiClosingStatus> = {
  READY: "PHOTO_REQUIRED",
  PHOTO_SELECTED: "PHOTO_REQUIRED",
  ANALYZING: "ANALYZING",
  SUBMITTED: "PASS",
  ERROR: "HUMAN_REVIEW",
};

export function PhotoCaptureMock({ zone }: PhotoCaptureMockProps) {
  const [stage, setStage] = useState<CaptureStage>("READY");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [error, setError] = useState<string>();
  const [evaluation, setEvaluation] = useState<VisionEvaluationResponse>();

  async function submitForEvaluation() {
    if (!selectedFile) {
      setError("Select an image before submitting for AI evaluation.");
      setStage("ERROR");
      return;
    }

    setError(undefined);
    setStage("ANALYZING");

    const formData = new FormData();
    formData.append("zoneId", zone.id);
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/ai-closing/evaluate", {
        method: "POST",
        body: formData,
      });
      const body = (await response.json()) as
        | VisionEvaluationResponse
        | { error?: string };

      if (!response.ok) {
        throw new Error(
          "error" in body && body.error
            ? body.error
            : "AI evaluation failed.",
        );
      }

      const evaluationResponse = body as VisionEvaluationResponse;
      const uiResult = mapEvaluationToUiResult(evaluationResponse, zone);
      sessionStorage.setItem(
        `doya-ai-closing-result:${zone.submissionId}`,
        JSON.stringify(uiResult),
      );
      setEvaluation(evaluationResponse);
      setStage("SUBMITTED");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "AI evaluation could not be completed.",
      );
      setStage("ERROR");
    }
  }

  return (
    <DashboardCard
      title={`${zone.label} photo`}
      eyebrow={`${zone.owner} closing`}
      action={
        <AiClosingStatusBadge status={evaluation?.status ?? stageStatus[stage]} />
      }
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
                Choose a JPEG, PNG, or WEBP photo. The image will be sent to the
                DOYA OS AI Closing evaluation endpoint.
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
              <p className="mt-4 text-sm font-semibold">Evidence ready</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {selectedFile?.name} is ready for AI inspection.
              </p>
            </>
          ) : null}

          {stage === "ANALYZING" ? (
            <>
              <Sparkles aria-hidden="true" className="size-10 text-ai" />
              <p className="mt-4 text-sm font-semibold">AI inspection running</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                The image is being evaluated through the Responses API vision
                pipeline. Ambiguous output will route to human review.
              </p>
            </>
          ) : null}

          {stage === "SUBMITTED" ? (
            <>
              <CheckCircle2 aria-hidden="true" className="size-10 text-success" />
              <p className="mt-4 text-sm font-semibold">Evaluation complete</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                The AI result is stored locally for this session and is ready to
                review on the result screen.
              </p>
              {evaluation ? (
                <p className="mt-2 text-sm font-semibold">
                  Status: {evaluation.status}
                </p>
              ) : null}
            </>
          ) : null}

          {stage === "ERROR" ? (
            <>
              <AlertCircle aria-hidden="true" className="size-10 text-warning" />
              <p className="mt-4 text-sm font-semibold">Human review required</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {error}
              </p>
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {stage === "READY" ? (
            <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-surface-canvas">
              <ImagePlus aria-hidden="true" className="size-4" />
              Select image
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    setStage("PHOTO_SELECTED");
                  }
                }}
              />
            </label>
          ) : null}

          {stage === "PHOTO_SELECTED" ? (
            <Button type="button" onClick={submitForEvaluation}>
              <Sparkles aria-hidden="true" />
              Submit for AI inspection
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

          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setStage("READY");
              setSelectedFile(undefined);
              setEvaluation(undefined);
              setError(undefined);
            }}
          >
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
