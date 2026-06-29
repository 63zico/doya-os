import type { AiClosingStatus, ClosingZone } from "@/lib/ai-closing-data";
import { AI_CLOSING_PROMPT_VERSION } from "@/lib/ai-closing/evaluation-prompt";

export type VisionEvaluationStatus = Extract<
  AiClosingStatus,
  "PASS" | "FAIL" | "HUMAN_REVIEW"
>;

export type VisionEvaluation = {
  status: VisionEvaluationStatus;
  score: number;
  confidence: number;
  detected_issues: string[];
  explanation: string;
  recommended_actions: string[];
};

export type VisionEvaluationAuditMeta = {
  evaluated_at: string;
  model: string;
  prompt_version: string;
  zone_id: string;
  submission_id: string;
};

export type VisionEvaluationPersistenceMeta = {
  repository_mode: "supabase" | "mock";
  closing_session_id?: string;
  persisted_submission_id?: string;
  vision_review_id?: string;
  storage_bucket?: string;
  storage_path?: string;
  audit_log_ids?: string[];
};

export type VisionEvaluationResponse = VisionEvaluation &
  VisionEvaluationAuditMeta &
  Partial<VisionEvaluationPersistenceMeta>;

export const visionEvaluationJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "status",
    "score",
    "confidence",
    "detected_issues",
    "explanation",
    "recommended_actions",
  ],
  properties: {
    status: {
      type: "string",
      enum: ["PASS", "FAIL", "HUMAN_REVIEW"],
    },
    score: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    confidence: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    detected_issues: {
      type: "array",
      items: { type: "string" },
    },
    explanation: {
      type: "string",
      minLength: 1,
    },
    recommended_actions: {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    },
  },
} as const;

const LOW_CONFIDENCE_THRESHOLD = 70;

function isVisionEvaluation(value: unknown): value is VisionEvaluation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<VisionEvaluation>;

  return (
    (candidate.status === "PASS" ||
      candidate.status === "FAIL" ||
      candidate.status === "HUMAN_REVIEW") &&
    Number.isInteger(candidate.score) &&
    Number.isInteger(candidate.confidence) &&
    typeof candidate.explanation === "string" &&
    Array.isArray(candidate.detected_issues) &&
    Array.isArray(candidate.recommended_actions)
  );
}

export function normalizeVisionEvaluation(
  rawEvaluation: unknown,
  zone: ClosingZone,
  model: string,
): VisionEvaluationResponse {
  const evaluatedAt = new Date().toISOString();

  if (!isVisionEvaluation(rawEvaluation)) {
    return {
      status: "HUMAN_REVIEW",
      score: 0,
      confidence: 0,
      detected_issues: ["Evaluator returned an invalid or ambiguous response."],
      explanation:
        "The AI response could not be validated against the expected schema.",
      recommended_actions: [
        "Manager should review the submitted evidence manually.",
      ],
      evaluated_at: evaluatedAt,
      model,
      prompt_version: AI_CLOSING_PROMPT_VERSION,
      zone_id: zone.id,
      submission_id: zone.submissionId,
    };
  }

  const detectedIssues = rawEvaluation.detected_issues.filter(
    (issue): issue is string => typeof issue === "string" && issue.length > 0,
  );
  const recommendedActions = rawEvaluation.recommended_actions.filter(
    (action): action is string =>
      typeof action === "string" && action.length > 0,
  );
  const ambiguous =
    rawEvaluation.status !== "HUMAN_REVIEW" &&
    rawEvaluation.confidence < LOW_CONFIDENCE_THRESHOLD;

  return {
    status: ambiguous ? "HUMAN_REVIEW" : rawEvaluation.status,
    score: Math.min(100, Math.max(0, rawEvaluation.score)),
    confidence: Math.min(100, Math.max(0, rawEvaluation.confidence)),
    detected_issues: ambiguous
      ? [
          ...detectedIssues,
          `Confidence below ${LOW_CONFIDENCE_THRESHOLD}%. Routed to manager review.`,
        ]
      : detectedIssues,
    explanation: ambiguous
      ? `${rawEvaluation.explanation} Confidence is below the automatic decision threshold.`
      : rawEvaluation.explanation,
    recommended_actions:
      recommendedActions.length > 0
        ? recommendedActions
        : ["Manager should review the submitted evidence manually."],
    evaluated_at: evaluatedAt,
    model,
    prompt_version: AI_CLOSING_PROMPT_VERSION,
    zone_id: zone.id,
    submission_id: zone.submissionId,
  };
}

export function mapEvaluationToUiResult(
  evaluation: VisionEvaluationResponse,
  zone: ClosingZone,
) {
  return {
    submissionId: evaluation.persisted_submission_id ?? zone.submissionId,
    zoneId: zone.id,
    status: evaluation.status,
    score: evaluation.score,
    confidence: evaluation.confidence / 100,
    reason: evaluation.explanation,
    requiredAction: evaluation.recommended_actions.join(" "),
    timestamp: evaluation.evaluated_at,
    model: evaluation.model,
    policyVersion: evaluation.prompt_version,
    detectedIssues: evaluation.detected_issues,
    recommendedActions: evaluation.recommended_actions,
  };
}
