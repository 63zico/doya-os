import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  AiClosingStatus,
  ClosingArea,
  ClosingZone,
  HumanReviewItem,
} from "@/lib/ai-closing-data";
import type { VisionEvaluationResponse } from "@/lib/ai-closing/evaluation";

export type AiClosingRepositoryMode = "supabase" | "mock";

export type AiClosingContext = {
  organizationId: string;
  storeId: string;
  businessDate: string;
  actorStaffId?: string;
};

export type ClosingSessionRecord = {
  id: string;
  organization_id: string;
  store_id: string;
  business_date: string;
  area: ClosingArea;
  status: string;
};

export type ClosingPhotoSubmissionRecord = {
  id: string;
  organization_id: string;
  store_id: string;
  closing_session_id: string;
  business_date: string;
  area: ClosingArea;
  category: string;
  status: string;
  storage_bucket: string;
  storage_path: string;
  content_type: string;
  image_sha256?: string | null;
  submitted_by?: string | null;
  submitted_at: string;
};

export type VisionReviewRecord = {
  id: string;
  closing_photo_submission_id: string;
  status: "PASS" | "FAIL" | "HUMAN_REVIEW";
  score: number;
  confidence: number;
  detected_issues: string[];
  explanation: string;
  recommended_actions: string[];
  model: string;
  prompt_version: string;
  manager_decision?: "approved" | "rejected" | "assigned_correction" | null;
  manager_notes?: string | null;
  reviewed_at?: string | null;
  created_at: string;
};

export type ClosingStateSubmission = ClosingPhotoSubmissionRecord & {
  vision_reviews?: VisionReviewRecord[];
};

export type CreateClosingSubmissionInput = {
  organizationId: string;
  storeId: string;
  closingSessionId: string;
  businessDate: string;
  area: "kitchen" | "hall";
  category: string;
  storagePath: string;
  contentType: string;
  imageSha256?: string;
  submittedBy?: string;
};

export type FindOrCreateClosingSessionInput = {
  organizationId: string;
  storeId: string;
  businessDate: string;
  area: ClosingArea;
};

export type UploadClosingPhotoInput = {
  storeId: string;
  businessDate: string;
  category: string;
  file: File;
};

export type WriteAuditLogInput = {
  organizationId: string;
  storeId?: string;
  actorStaffId?: string;
  action: string;
  targetTable: string;
  targetId?: string;
  beforeData?: unknown;
  afterData?: unknown;
  metadata?: Record<string, unknown>;
};

export type HumanReviewDecision = "approved" | "rejected";

const submissionStatusByEvaluation: Record<
  VisionEvaluationResponse["status"],
  "pass" | "fail" | "human_review"
> = {
  PASS: "pass",
  FAIL: "fail",
  HUMAN_REVIEW: "human_review",
};

function toStorageSafeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

function toUiStatus(status: string): AiClosingStatus {
  switch (status) {
    case "pass":
      return "PASS";
    case "fail":
      return "FAIL";
    case "human_review":
      return "HUMAN_REVIEW";
    case "submitted":
    case "analyzing":
      return "ANALYZING";
    case "photo_required":
      return "PHOTO_REQUIRED";
    default:
      return "NOT_STARTED";
  }
}

export class SupabaseAiClosingRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findOrCreateClosingSession(input: FindOrCreateClosingSessionInput) {
    const { data: existing, error: findError } = await this.supabase
      .from("closing_sessions")
      .select("*")
      .eq("store_id", input.storeId)
      .eq("business_date", input.businessDate)
      .eq("area", input.area)
      .maybeSingle();

    if (findError) {
      throw findError;
    }

    if (existing) {
      return existing as ClosingSessionRecord;
    }

    const { data, error } = await this.supabase
      .from("closing_sessions")
      .insert({
        organization_id: input.organizationId,
        store_id: input.storeId,
        business_date: input.businessDate,
        area: input.area,
        status: "in_progress",
        opened_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as ClosingSessionRecord;
  }

  async uploadClosingPhoto(input: UploadClosingPhotoInput) {
    const storagePath = `stores/${input.storeId}/closing/${input.businessDate}/${input.category}/${crypto.randomUUID()}-${toStorageSafeFileName(input.file.name)}`;
    const { data, error } = await this.supabase.storage
      .from("closing-photos")
      .upload(storagePath, input.file, {
        contentType: input.file.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return data;
  }

  async createSubmission(input: CreateClosingSubmissionInput) {
    const { data, error } = await this.supabase
      .from("closing_photo_submissions")
      .insert({
        organization_id: input.organizationId,
        store_id: input.storeId,
        closing_session_id: input.closingSessionId,
        business_date: input.businessDate,
        area: input.area,
        category: input.category,
        status: "submitted",
        storage_bucket: "closing-photos",
        storage_path: input.storagePath,
        content_type: input.contentType,
        image_sha256: input.imageSha256,
        submitted_by: input.submittedBy,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as ClosingPhotoSubmissionRecord;
  }

  async updateSubmissionStatus(
    submissionId: string,
    status: ClosingPhotoSubmissionRecord["status"],
  ) {
    const { data, error } = await this.supabase
      .from("closing_photo_submissions")
      .update({ status })
      .eq("id", submissionId)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as ClosingPhotoSubmissionRecord;
  }

  async saveVisionReview(
    submissionId: string,
    organizationId: string,
    storeId: string,
    evaluation: VisionEvaluationResponse,
    rawResponse: unknown,
  ) {
    const { data, error } = await this.supabase
      .from("vision_reviews")
      .insert({
        organization_id: organizationId,
        store_id: storeId,
        closing_photo_submission_id: submissionId,
        status: evaluation.status,
        score: evaluation.score,
        confidence: evaluation.confidence,
        detected_issues: evaluation.detected_issues,
        explanation: evaluation.explanation,
        recommended_actions: evaluation.recommended_actions,
        model: evaluation.model,
        prompt_version: evaluation.prompt_version,
        raw_response: rawResponse,
      })
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return data as VisionReviewRecord;
  }

  async persistEvaluation(
    submissionId: string,
    organizationId: string,
    storeId: string,
    evaluation: VisionEvaluationResponse,
    rawResponse: unknown,
  ) {
    const review = await this.saveVisionReview(
      submissionId,
      organizationId,
      storeId,
      evaluation,
      rawResponse,
    );
    const submission = await this.updateSubmissionStatus(
      submissionId,
      submissionStatusByEvaluation[evaluation.status],
    );

    return { review, submission };
  }

  async listClosingState(storeId: string, businessDate: string) {
    const { data, error } = await this.supabase
      .from("closing_photo_submissions")
      .select("*, vision_reviews(*)")
      .eq("store_id", storeId)
      .eq("business_date", businessDate)
      .order("submitted_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as ClosingStateSubmission[];
  }

  async listHumanReviewQueue(storeId: string, businessDate: string) {
    const { data, error } = await this.supabase
      .from("closing_photo_submissions")
      .select("*, vision_reviews(*)")
      .eq("store_id", storeId)
      .eq("business_date", businessDate)
      .in("status", ["fail", "human_review"])
      .order("submitted_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as ClosingStateSubmission[];
  }

  async saveHumanReviewDecision(input: {
    reviewId: string;
    decision: HumanReviewDecision;
    notes?: string;
    reviewerStaffId?: string;
  }) {
    const { data: review, error: reviewError } = await this.supabase
      .from("vision_reviews")
      .update({
        manager_decision: input.decision,
        manager_notes: input.notes,
        reviewer_staff_id: input.reviewerStaffId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", input.reviewId)
      .select("*")
      .single();

    if (reviewError) {
      throw reviewError;
    }

    const typedReview = review as VisionReviewRecord;
    const nextStatus = input.decision === "approved" ? "pass" : "fail";
    const submission = await this.updateSubmissionStatus(
      typedReview.closing_photo_submission_id,
      nextStatus,
    );

    return { review: typedReview, submission };
  }

  async writeAuditLog(input: WriteAuditLogInput) {
    const { data, error } = await this.supabase
      .from("audit_logs")
      .insert({
        organization_id: input.organizationId,
        store_id: input.storeId,
        actor_staff_id: input.actorStaffId,
        action: input.action,
        target_table: input.targetTable,
        target_id: input.targetId,
        before_data: input.beforeData,
        after_data: input.afterData,
        metadata: input.metadata ?? {},
      })
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return data as { id: string };
  }
}

export function overlaySupabaseClosingState(
  zones: ClosingZone[],
  submissions: ClosingStateSubmission[],
) {
  const latestByZone = new Map<string, ClosingStateSubmission>();

  for (const submission of submissions) {
    if (!latestByZone.has(submission.category)) {
      latestByZone.set(submission.category, submission);
    }
  }

  return zones.map((zone) => {
    const submission = latestByZone.get(zone.id);

    if (!submission) {
      return zone;
    }

    return {
      ...zone,
      status: toUiStatus(submission.status),
      submissionId: submission.id,
      lastSubmittedAt: new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(submission.submitted_at)),
    };
  });
}

export function mapSupabaseReviewQueue(
  submissions: ClosingStateSubmission[],
  fallbackZones: ClosingZone[],
): HumanReviewItem[] {
  return submissions
    .map((submission) => {
      const review = submission.vision_reviews?.[0];
      const zone = fallbackZones.find((candidate) => candidate.id === submission.category);

      if (!review || !zone || review.manager_decision) {
        return undefined;
      }

      return {
        id: review.id,
        submissionId: submission.id,
        zoneId: zone.id,
        area: zone.area,
        title: `${zone.owner} ${zone.shortLabel}`.trim(),
        submittedBy: "Supabase staff",
        submittedAt: new Intl.DateTimeFormat("en", {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(submission.submitted_at)),
        reason: review.explanation,
        confidence: review.confidence / 100,
        requiredAction: review.recommended_actions.join(" "),
      } satisfies HumanReviewItem;
    })
    .filter((item): item is HumanReviewItem => Boolean(item));
}
