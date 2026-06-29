import type { SupabaseClient } from "@supabase/supabase-js";
import type { VisionEvaluationResponse } from "@/lib/ai-closing/evaluation";

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

export type UploadClosingPhotoInput = {
  storeId: string;
  businessDate: string;
  category: string;
  file: File;
};

export class SupabaseAiClosingRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async uploadClosingPhoto(input: UploadClosingPhotoInput) {
    const storagePath = `stores/${input.storeId}/closing/${input.businessDate}/${input.category}/${crypto.randomUUID()}-${input.file.name}`;
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
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
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
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
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

    return data;
  }
}
