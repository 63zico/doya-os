import type {
  VisionEvaluationResponse,
  VisionEvaluationStatus,
} from "@/lib/ai-closing/evaluation";

export type ExpectedScoreRange = readonly [number, number];

export type EvaluationSeverity =
  | "none"
  | "cleanliness"
  | "evidence_quality"
  | "food_safety"
  | "operational_blocker";

export type EvaluationOutcome =
  | "PASS"
  | "FAIL"
  | "FALSE_FAIL"
  | "CRITICAL_FALSE_PASS"
  | "HUMAN_REVIEW";

export type FixtureExpectation = {
  expected_status: VisionEvaluationStatus;
  expected_score_range: ExpectedScoreRange;
  expected_detected_issues: string[];
};

export type FixtureEvaluationRun = {
  fixtureId: string;
  expected: FixtureExpectation;
  actual: VisionEvaluationResponse;
};

export type EvaluationReport = {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  accuracyPercentage: number;
  falsePassCount: number;
  falseFailCount: number;
  humanReviewCount: number;
};

export const calibrationRules = {
  passThreshold: 80,
  failThreshold: 55,
  humanReviewRange: [56, 79] as const,
  confidenceFloor: 70,
  ambiguousResultHandling: "Route to HUMAN_REVIEW before operational action.",
  issueSeverityMapping: {
    residue: "cleanliness",
    debris: "cleanliness",
    grease: "food_safety",
    spill: "food_safety",
    unclear: "evidence_quality",
    blurry: "evidence_quality",
    dark: "evidence_quality",
    cropped: "evidence_quality",
    obstruction: "evidence_quality",
    mismatch: "operational_blocker",
  } satisfies Record<string, Exclude<EvaluationSeverity, "none">>,
};

export function isScoreInRange(score: number, range: ExpectedScoreRange) {
  return score >= range[0] && score <= range[1];
}

export function mapIssueSeverity(issue: string): EvaluationSeverity {
  const normalizedIssue = issue.toLowerCase();

  for (const [keyword, severity] of Object.entries(
    calibrationRules.issueSeverityMapping,
  )) {
    if (normalizedIssue.includes(keyword)) {
      return severity;
    }
  }

  return issue.length > 0 ? "cleanliness" : "none";
}

export function normalizeDecisionWithCalibration(
  evaluation: VisionEvaluationResponse,
): VisionEvaluationStatus {
  if (evaluation.confidence < calibrationRules.confidenceFloor) {
    return "HUMAN_REVIEW";
  }

  if (
    evaluation.score >= calibrationRules.passThreshold &&
    evaluation.status === "PASS"
  ) {
    return "PASS";
  }

  if (
    evaluation.score <= calibrationRules.failThreshold &&
    evaluation.status === "FAIL"
  ) {
    return "FAIL";
  }

  return "HUMAN_REVIEW";
}

export function classifyEvaluationOutcome(
  expected: FixtureExpectation,
  actual: VisionEvaluationResponse,
): EvaluationOutcome {
  const normalizedActualStatus = normalizeDecisionWithCalibration(actual);

  if (normalizedActualStatus === "HUMAN_REVIEW") {
    return "HUMAN_REVIEW";
  }

  if (
    normalizedActualStatus === "PASS" &&
    expected.expected_status === "FAIL"
  ) {
    return "CRITICAL_FALSE_PASS";
  }

  if (
    normalizedActualStatus === "FAIL" &&
    expected.expected_status === "PASS"
  ) {
    return "FALSE_FAIL";
  }

  if (
    normalizedActualStatus === expected.expected_status &&
    isScoreInRange(actual.score, expected.expected_score_range)
  ) {
    return "PASS";
  }

  return "FAIL";
}

export function buildEvaluationReport(
  runs: FixtureEvaluationRun[],
): EvaluationReport {
  const outcomes = runs.map((run) =>
    classifyEvaluationOutcome(run.expected, run.actual),
  );
  const passedTests = outcomes.filter((outcome) => outcome === "PASS").length;
  const failedTests = outcomes.filter(
    (outcome) =>
      outcome === "FAIL" ||
      outcome === "FALSE_FAIL" ||
      outcome === "CRITICAL_FALSE_PASS",
  ).length;
  const falsePassCount = outcomes.filter(
    (outcome) => outcome === "CRITICAL_FALSE_PASS",
  ).length;
  const falseFailCount = outcomes.filter(
    (outcome) => outcome === "FALSE_FAIL",
  ).length;
  const humanReviewCount = outcomes.filter(
    (outcome) => outcome === "HUMAN_REVIEW",
  ).length;
  const totalTests = runs.length;

  return {
    totalTests,
    passedTests,
    failedTests,
    accuracyPercentage:
      totalTests === 0 ? 0 : Math.round((passedTests / totalTests) * 100),
    falsePassCount,
    falseFailCount,
    humanReviewCount,
  };
}
