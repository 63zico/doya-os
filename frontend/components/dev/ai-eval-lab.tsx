"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  ImagePlus,
  Play,
  ShieldAlert,
  Upload,
  XCircle,
} from "lucide-react";
import { AiClosingStatusBadge } from "@/components/ai-closing/ai-closing-status-badge";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getZone } from "@/lib/ai-closing-data";
import {
  buildEvaluationReport,
  calibrationRules,
  classifyEvaluationOutcome,
  isScoreInRange,
  mapIssueSeverity,
  normalizeDecisionWithCalibration,
  type EvaluationOutcome,
  type FixtureEvaluationRun,
} from "@/lib/ai-closing/calibration";
import {
  aiEvaluationFixtures,
  type AiEvaluationFixture,
} from "@/lib/ai-closing/evaluation-fixtures";
import type { VisionEvaluationResponse } from "@/lib/ai-closing/evaluation";

type RunState = {
  fixture: AiEvaluationFixture;
  result?: VisionEvaluationResponse;
  error?: string;
  source: "fixture" | "upload";
};

const outcomeTone: Record<EvaluationOutcome, "success" | "warning" | "danger"> =
  {
    PASS: "success",
    FAIL: "danger",
    FALSE_FAIL: "warning",
    CRITICAL_FALSE_PASS: "danger",
    HUMAN_REVIEW: "warning",
  };

const outcomeLabel: Record<EvaluationOutcome, string> = {
  PASS: "Pass",
  FAIL: "Fail",
  FALSE_FAIL: "False fail",
  CRITICAL_FALSE_PASS: "Critical false pass",
  HUMAN_REVIEW: "Human review",
};

async function createFileFromFixture(fixture: AiEvaluationFixture) {
  const response = await fetch(fixture.image_placeholder);
  const blob = await response.blob();

  return new File([blob], `${fixture.id}.png`, { type: blob.type });
}

async function evaluateFixture(
  fixture: AiEvaluationFixture,
  imageFile: File,
): Promise<VisionEvaluationResponse> {
  const formData = new FormData();
  formData.append("zoneId", fixture.zoneId);
  formData.append("image", imageFile);

  const response = await fetch("/api/ai-closing/evaluate", {
    method: "POST",
    body: formData,
  });
  const body = (await response.json()) as
    | VisionEvaluationResponse
    | { error?: string };

  if (!response.ok) {
    throw new Error(
      "error" in body && body.error ? body.error : "Evaluation request failed.",
    );
  }

  return body as VisionEvaluationResponse;
}

function getRunOutcome(run: RunState): EvaluationOutcome | undefined {
  if (!run.result) {
    return undefined;
  }

  return classifyEvaluationOutcome(run.fixture, run.result);
}

export function AiEvalLab() {
  const [selectedFixtureId, setSelectedFixtureId] = useState(
    aiEvaluationFixtures[0].id,
  );
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [runs, setRuns] = useState<RunState[]>([]);
  const [running, setRunning] = useState(false);

  const selectedFixture =
    aiEvaluationFixtures.find((fixture) => fixture.id === selectedFixtureId) ??
    aiEvaluationFixtures[0];
  const selectedZone = getZone(selectedFixture.zoneId);
  const successfulRuns: FixtureEvaluationRun[] = runs
    .filter((run): run is RunState & { result: VisionEvaluationResponse } =>
      Boolean(run.result),
    )
    .map((run) => ({
      fixtureId: run.fixture.id,
      expected: run.fixture,
      actual: run.result,
    }));
  const report = useMemo(
    () => buildEvaluationReport(successfulRuns),
    [successfulRuns],
  );
  const selectedRun = runs.find((run) => run.fixture.id === selectedFixture.id);
  const selectedOutcome = selectedRun ? getRunOutcome(selectedRun) : undefined;

  async function runFixture(fixture: AiEvaluationFixture, useUpload: boolean) {
    const imageFile =
      useUpload && uploadedFile
        ? uploadedFile
        : await createFileFromFixture(fixture);
    const source = useUpload && uploadedFile ? "upload" : "fixture";

    try {
      const result = await evaluateFixture(fixture, imageFile);
      setRuns((currentRuns) => [
        { fixture, result, source },
        ...currentRuns.filter((run) => run.fixture.id !== fixture.id),
      ]);
    } catch (error) {
      setRuns((currentRuns) => [
        {
          fixture,
          error:
            error instanceof Error
              ? error.message
              : "Evaluation failed with an unknown error.",
          source,
        },
        ...currentRuns.filter((run) => run.fixture.id !== fixture.id),
      ]);
    }
  }

  async function runSelectedFixture(useUpload = false) {
    setRunning(true);
    await runFixture(selectedFixture, useUpload);
    setRunning(false);
  }

  async function runAllFixtures() {
    setRunning(true);
    for (const fixture of aiEvaluationFixtures) {
      await runFixture(fixture, false);
    }
    setRunning(false);
  }

  return (
    <div className="min-h-screen bg-surface-canvas px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Developer-only tool
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">
              AI Closing Evaluation Lab
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Run labeled fixture images through the Vision evaluator, compare
              the response with expected outcomes, and calibrate false pass,
              false fail, and human review behavior before restaurant use.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="secondary"
              onClick={() => void runSelectedFixture(false)}
              disabled={running}
            >
              <Play aria-hidden="true" />
              Run fixture sample
            </Button>
            <Button type="button" onClick={() => void runAllFixtures()} disabled={running}>
              <FlaskConical aria-hidden="true" />
              Run all fixtures
            </Button>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Total tests
            </p>
            <p className="mt-2 tabular-nums text-2xl font-semibold">
              {report.totalTests}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Passed
            </p>
            <p className="mt-2 tabular-nums text-2xl font-semibold">
              {report.passedTests}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Failed
            </p>
            <p className="mt-2 tabular-nums text-2xl font-semibold">
              {report.failedTests}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Accuracy
            </p>
            <p className="mt-2 tabular-nums text-2xl font-semibold">
              {report.accuracyPercentage}%
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              False pass
            </p>
            <p className="mt-2 tabular-nums text-2xl font-semibold">
              {report.falsePassCount}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-medium text-muted-foreground">
              False fail / review
            </p>
            <p className="mt-2 tabular-nums text-2xl font-semibold">
              {report.falseFailCount} / {report.humanReviewCount}
            </p>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <DashboardCard title="Fixture" eyebrow="Dataset">
            <div className="space-y-4">
              <label className="block text-sm font-medium" htmlFor="fixture">
                Test case
              </label>
              <select
                id="fixture"
                className="h-10 w-full rounded-md border border-border bg-surface-base px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedFixtureId}
                onChange={(event) => setSelectedFixtureId(event.target.value)}
              >
                {aiEvaluationFixtures.map((fixture) => (
                  <option key={fixture.id} value={fixture.id}>
                    {fixture.label}
                  </option>
                ))}
              </select>

              <div className="overflow-hidden rounded-md border border-border bg-surface-subtle">
                <Image
                  src={selectedFixture.image_placeholder}
                  alt={`${selectedFixture.label} fixture placeholder`}
                  width={900}
                  height={620}
                  className="h-auto w-full"
                  priority={false}
                />
              </div>

              <dl className="grid gap-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Expected status</dt>
                  <dd>
                    <AiClosingStatusBadge
                      status={selectedFixture.expected_status}
                    />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Expected score</dt>
                  <dd className="tabular-nums">
                    {selectedFixture.expected_score_range[0]}-
                    {selectedFixture.expected_score_range[1]}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Expected issues</dt>
                  <dd className="mt-1 leading-6">
                    {selectedFixture.expected_detected_issues.length > 0
                      ? selectedFixture.expected_detected_issues.join(", ")
                      : "None"}
                  </dd>
                </div>
              </dl>

              <p className="text-sm leading-6 text-muted-foreground">
                {selectedFixture.notes}
              </p>

              <label className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-surface-base px-4 py-2 text-sm font-medium outline-none transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring">
                <Upload aria-hidden="true" className="size-4" />
                Upload override image
                <input
                  className="sr-only"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => {
                    setUploadedFile(event.target.files?.[0]);
                  }}
                />
              </label>
              {uploadedFile ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void runSelectedFixture(true)}
                  disabled={running}
                >
                  <ImagePlus aria-hidden="true" />
                  Run uploaded image
                </Button>
              ) : null}
            </div>
          </DashboardCard>

          <div className="space-y-4">
            <DashboardCard
              title="Calibration"
              eyebrow="Rules"
              action={<StatusBadge tone="ai" label="Developer lab" />}
            >
              <div className="grid gap-4 lg:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold">Thresholds</p>
                  <dl className="mt-3 grid gap-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">PASS threshold</dt>
                      <dd className="tabular-nums">
                        {calibrationRules.passThreshold}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">FAIL threshold</dt>
                      <dd className="tabular-nums">
                        {calibrationRules.failThreshold}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">
                        HUMAN_REVIEW range
                      </dt>
                      <dd className="tabular-nums">
                        {calibrationRules.humanReviewRange[0]}-
                        {calibrationRules.humanReviewRange[1]}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">
                        Confidence floor
                      </dt>
                      <dd className="tabular-nums">
                        {calibrationRules.confidenceFloor}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <p className="text-sm font-semibold">Ambiguity rule</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {calibrationRules.ambiguousResultHandling}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    False pass is treated as the highest-risk evaluation failure
                    because it can allow a dirty area to close as clean.
                  </p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard title="Selected result" eyebrow="Comparison">
              {selectedRun?.result ? (
                <div className="space-y-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      {selectedOutcome === "PASS" ? (
                        <CheckCircle2
                          aria-hidden="true"
                          className="size-5 text-success"
                        />
                      ) : selectedOutcome === "CRITICAL_FALSE_PASS" ? (
                        <AlertTriangle
                          aria-hidden="true"
                          className="size-5 text-danger"
                        />
                      ) : selectedOutcome === "HUMAN_REVIEW" ? (
                        <ShieldAlert
                          aria-hidden="true"
                          className="size-5 text-warning"
                        />
                      ) : (
                        <XCircle
                          aria-hidden="true"
                          className="size-5 text-danger"
                        />
                      )}
                      <p className="text-sm font-semibold">
                        {selectedOutcome
                          ? outcomeLabel[selectedOutcome]
                          : "Not evaluated"}
                      </p>
                    </div>
                    {selectedOutcome ? (
                      <StatusBadge
                        tone={outcomeTone[selectedOutcome]}
                        label={outcomeLabel[selectedOutcome]}
                      />
                    ) : null}
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                      <span>Score</span>
                      <span className="tabular-nums">
                        {selectedRun.result.score}
                      </span>
                    </div>
                    <Progress
                      value={selectedRun.result.score}
                      indicatorClassName="bg-ai"
                    />
                  </div>

                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div className="rounded-md border border-border bg-surface-subtle p-3">
                      <dt className="text-xs text-muted-foreground">
                        AI status
                      </dt>
                      <dd className="mt-1">
                        <AiClosingStatusBadge status={selectedRun.result.status} />
                      </dd>
                    </div>
                    <div className="rounded-md border border-border bg-surface-subtle p-3">
                      <dt className="text-xs text-muted-foreground">
                        Normalized decision
                      </dt>
                      <dd className="mt-1">
                        <AiClosingStatusBadge
                          status={normalizeDecisionWithCalibration(
                            selectedRun.result,
                          )}
                        />
                      </dd>
                    </div>
                    <div className="rounded-md border border-border bg-surface-subtle p-3">
                      <dt className="text-xs text-muted-foreground">
                        Score in expected range
                      </dt>
                      <dd className="mt-1 font-medium">
                        {isScoreInRange(
                          selectedRun.result.score,
                          selectedFixture.expected_score_range,
                        )
                          ? "Yes"
                          : "No"}
                      </dd>
                    </div>
                    <div className="rounded-md border border-border bg-surface-subtle p-3">
                      <dt className="text-xs text-muted-foreground">
                        Source
                      </dt>
                      <dd className="mt-1 font-medium">{selectedRun.source}</dd>
                    </div>
                  </dl>

                  <div className="rounded-md border border-border bg-surface-subtle p-3">
                    <p className="text-sm font-semibold">Issue severity</p>
                    <ul className="mt-2 space-y-1 text-sm leading-6 text-muted-foreground">
                      {selectedRun.result.detected_issues.length > 0 ? (
                        selectedRun.result.detected_issues.map((issue) => (
                          <li key={issue}>
                            {issue} - {mapIssueSeverity(issue)}
                          </li>
                        ))
                      ) : (
                        <li>No issues returned.</li>
                      )}
                    </ul>
                  </div>

                  <div className="rounded-md border border-border bg-surface-subtle p-3">
                    <p className="text-sm font-semibold">
                      Raw structured JSON response
                    </p>
                    <pre className="mt-3 max-h-96 overflow-auto rounded-md bg-background p-3 text-xs leading-5 text-muted-foreground">
                      {JSON.stringify(selectedRun.result, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : selectedRun?.error ? (
                <div className="rounded-md border border-warning/30 bg-warning-subtle p-4">
                  <p className="text-sm font-semibold">Evaluation unavailable</p>
                  <p className="mt-2 text-sm leading-6">{selectedRun.error}</p>
                </div>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  Run the selected fixture to compare AI output against the
                  expected result.
                </p>
              )}
            </DashboardCard>
          </div>
        </section>
      </div>
    </div>
  );
}
