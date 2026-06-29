import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getZone } from "@/lib/ai-closing-data";
import {
  normalizeVisionEvaluation,
  type VisionEvaluationResponse,
  visionEvaluationJsonSchema,
} from "@/lib/ai-closing/evaluation";
import { buildAiClosingEvaluationPrompt } from "@/lib/ai-closing/evaluation-prompt";
import { resolveAiClosingRepositoryContext } from "@/lib/ai-closing/supabase-context";
import { SupabaseAiClosingRepository } from "@/lib/repositories/ai-closing-repository";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_VISION_MODEL = "gpt-5.5";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type OpenAiResponsesRequest = {
  model: string;
  input: Array<{
    role: "user";
    content: Array<
      | {
          type: "input_text";
          text: string;
        }
      | {
          type: "input_image";
          image_url: string;
          detail: "high";
        }
    >;
  }>;
  text: {
    format: {
      type: "json_schema";
      name: string;
      schema: typeof visionEvaluationJsonSchema;
      strict: true;
    };
  };
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function extractOutputText(responseBody: unknown): string | undefined {
  if (!responseBody || typeof responseBody !== "object") {
    return undefined;
  }

  const candidate = responseBody as {
    output_text?: unknown;
    output?: Array<{
      content?: Array<{
        type?: string;
        text?: unknown;
      }>;
    }>;
  };

  if (typeof candidate.output_text === "string") {
    return candidate.output_text;
  }

  for (const outputItem of candidate.output ?? []) {
    for (const contentItem of outputItem.content ?? []) {
      if (
        (contentItem.type === "output_text" || contentItem.type === "text") &&
        typeof contentItem.text === "string"
      ) {
        return contentItem.text;
      }
    }
  }

  return undefined;
}

function safeParseJson(text: string) {
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

function auditVisionEvaluation(payload: {
  request: OpenAiResponsesRequest;
  response: unknown;
  status: "success" | "error";
  image: {
    sha256: string;
    size: number;
    type: string;
    name: string;
  };
}) {
  const redactedRequest = {
    ...payload.request,
    input: payload.request.input.map((inputItem) => ({
      ...inputItem,
      content: inputItem.content.map((contentItem) =>
        contentItem.type === "input_image"
          ? {
              ...contentItem,
              image_url: `[redacted:data-url:sha256:${payload.image.sha256}]`,
            }
          : contentItem,
      ),
    })),
  };

  console.info(
    JSON.stringify({
      event: "ai_closing_vision_evaluation",
      status: payload.status,
      image: payload.image,
      request: redactedRequest,
      response: payload.response,
    }),
  );
}

function withPersistenceMeta(
  evaluation: VisionEvaluationResponse,
  persistence: Partial<VisionEvaluationResponse>,
) {
  return {
    ...evaluation,
    ...persistence,
  } satisfies VisionEvaluationResponse;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return jsonError("OPENAI_API_KEY is not configured.", 503);
  }

  const formData = await request.formData();
  const zoneId = formData.get("zoneId");
  const image = formData.get("image");
  const isResubmission = formData.get("resubmission") === "true";

  if (typeof zoneId !== "string") {
    return jsonError("zoneId is required.", 400);
  }

  const zone = getZone(zoneId);

  if (!zone) {
    return jsonError("Unknown closing zone.", 404);
  }

  if (!(image instanceof File)) {
    return jsonError("image file is required.", 400);
  }

  if (!SUPPORTED_IMAGE_TYPES.has(image.type)) {
    return jsonError("Only JPEG, PNG, and WEBP images are supported.", 415);
  }

  if (image.size > MAX_IMAGE_BYTES) {
    return jsonError("Image must be 8 MB or smaller.", 413);
  }

  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const imageSha256 = createHash("sha256").update(imageBuffer).digest("hex");
  const imageDataUrl = `data:${image.type};base64,${imageBuffer.toString(
    "base64",
  )}`;
  const model = process.env.OPENAI_VISION_MODEL ?? DEFAULT_VISION_MODEL;
  const prompt = buildAiClosingEvaluationPrompt(zone);
  const repositoryContext = resolveAiClosingRepositoryContext(formData);
  const auditLogIds: string[] = [];
  let persistenceMeta: Partial<VisionEvaluationResponse> = {
    repository_mode: repositoryContext.mode,
  };
  let repository: SupabaseAiClosingRepository | undefined;
  let persistedSubmission:
    | Awaited<ReturnType<SupabaseAiClosingRepository["createSubmission"]>>
    | undefined;

  if (repositoryContext.mode === "supabase") {
    repository = new SupabaseAiClosingRepository(createSupabaseAdminClient());

    try {
      const session = await repository.findOrCreateClosingSession({
        organizationId: repositoryContext.context.organizationId,
        storeId: repositoryContext.context.storeId,
        businessDate: repositoryContext.context.businessDate,
        area: zone.area,
      });
      const uploaded = await repository.uploadClosingPhoto({
        storeId: repositoryContext.context.storeId,
        businessDate: repositoryContext.context.businessDate,
        category: zone.id,
        file: image,
      });

      persistedSubmission = await repository.createSubmission({
        organizationId: repositoryContext.context.organizationId,
        storeId: repositoryContext.context.storeId,
        closingSessionId: session.id,
        businessDate: repositoryContext.context.businessDate,
        area: zone.area,
        category: zone.id,
        storagePath: uploaded.path,
        contentType: image.type,
        imageSha256,
        submittedBy: repositoryContext.context.actorStaffId,
      });

      const auditLog = await repository.writeAuditLog({
        organizationId: repositoryContext.context.organizationId,
        storeId: repositoryContext.context.storeId,
        actorStaffId: repositoryContext.context.actorStaffId,
        action: isResubmission
          ? "ai_closing.photo_resubmitted"
          : "ai_closing.photo_submitted",
        targetTable: "closing_photo_submissions",
        targetId: persistedSubmission.id,
        afterData: persistedSubmission,
        metadata: {
          zone_id: zone.id,
          image_sha256: imageSha256,
          storage_bucket: "closing-photos",
          storage_path: uploaded.path,
        },
      });

      auditLogIds.push(auditLog.id);
      persistenceMeta = {
        repository_mode: "supabase",
        closing_session_id: session.id,
        persisted_submission_id: persistedSubmission.id,
        storage_bucket: "closing-photos",
        storage_path: uploaded.path,
        audit_log_ids: auditLogIds,
      };
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "ai_closing_supabase_persistence_failed",
          error: error instanceof Error ? error.message : "Unknown error",
          mode: repositoryContext.mode,
          zone_id: zone.id,
        }),
      );

      return jsonError("AI Closing evidence could not be persisted.", 502);
    }
  }

  const openAiRequest: OpenAiResponsesRequest = {
    model,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: prompt,
          },
          {
            type: "input_image",
            image_url: imageDataUrl,
            detail: "high",
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "ai_closing_evaluation",
        schema: visionEvaluationJsonSchema,
        strict: true,
      },
    },
  };

  const auditImage = {
    sha256: imageSha256,
    size: image.size,
    type: image.type,
    name: image.name,
  };

  try {
    const openAiResponse = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openAiRequest),
    });

    const responseBody = (await openAiResponse.json()) as unknown;

    if (!openAiResponse.ok) {
      auditVisionEvaluation({
        request: openAiRequest,
        response: responseBody,
        status: "error",
        image: auditImage,
      });

      return NextResponse.json(
        {
          error: "OpenAI vision evaluation failed.",
          details: responseBody,
        },
        { status: 502 },
      );
    }

    const outputText = extractOutputText(responseBody);
    const rawEvaluation = outputText ? safeParseJson(outputText) : undefined;
    const evaluation = normalizeVisionEvaluation(rawEvaluation, zone, model);
    const persistedEvaluation = persistedSubmission
      ? {
          ...evaluation,
          submission_id: persistedSubmission.id,
        }
      : evaluation;

    auditVisionEvaluation({
      request: openAiRequest,
      response: responseBody,
      status: "success",
      image: auditImage,
    });

    if (
      repository &&
      repositoryContext.mode === "supabase" &&
      persistedSubmission
    ) {
      const { review, submission } = await repository.persistEvaluation(
        persistedSubmission.id,
        repositoryContext.context.organizationId,
        repositoryContext.context.storeId,
        persistedEvaluation,
        responseBody,
      );
      const auditLog = await repository.writeAuditLog({
        organizationId: repositoryContext.context.organizationId,
        storeId: repositoryContext.context.storeId,
        actorStaffId: repositoryContext.context.actorStaffId,
        action: "ai_closing.ai_evaluated",
        targetTable: "vision_reviews",
        targetId: review.id,
        afterData: {
          review,
          submission,
        },
        metadata: {
          zone_id: zone.id,
          image_sha256: imageSha256,
          status: persistedEvaluation.status,
          score: persistedEvaluation.score,
          confidence: persistedEvaluation.confidence,
        },
      });

      auditLogIds.push(auditLog.id);
      persistenceMeta = {
        ...persistenceMeta,
        vision_review_id: review.id,
        audit_log_ids: auditLogIds,
      };
    }

    return NextResponse.json(
      withPersistenceMeta(persistedEvaluation, persistenceMeta),
    );
  } catch (error) {
    auditVisionEvaluation({
      request: openAiRequest,
      response: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      status: "error",
      image: auditImage,
    });

    if (
      repository &&
      repositoryContext.mode === "supabase" &&
      persistedSubmission
    ) {
      await repository.writeAuditLog({
        organizationId: repositoryContext.context.organizationId,
        storeId: repositoryContext.context.storeId,
        actorStaffId: repositoryContext.context.actorStaffId,
        action: "ai_closing.ai_evaluation_failed",
        targetTable: "closing_photo_submissions",
        targetId: persistedSubmission.id,
        metadata: {
          zone_id: zone.id,
          image_sha256: imageSha256,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
    }

    return jsonError("AI vision evaluation could not be completed.", 502);
  }
}
