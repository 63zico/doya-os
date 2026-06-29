import { NextResponse } from "next/server";
import { aiClosingData } from "@/lib/ai-closing-data";
import { resolveAiClosingRepositoryContext } from "@/lib/ai-closing/supabase-context";
import {
  mapSupabaseReviewQueue,
  SupabaseAiClosingRepository,
  type HumanReviewDecision,
} from "@/lib/repositories/ai-closing-repository";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const repositoryContext = resolveAiClosingRepositoryContext();

  if (repositoryContext.mode === "mock") {
    return NextResponse.json({
      mode: "mock",
      reason: repositoryContext.reason,
      items: aiClosingData.reviewQueue,
    });
  }

  try {
    const repository = new SupabaseAiClosingRepository(
      createSupabaseAdminClient(),
    );
    const submissions = await repository.listHumanReviewQueue(
      repositoryContext.context.storeId,
      repositoryContext.context.businessDate,
    );

    return NextResponse.json({
      mode: "supabase",
      items: mapSupabaseReviewQueue(submissions, aiClosingData.zones),
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "ai_closing_review_queue_read_failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );

    return NextResponse.json({
      mode: "mock",
      reason: "Supabase review queue could not be read.",
      items: aiClosingData.reviewQueue,
    });
  }
}

export async function POST(request: Request) {
  const repositoryContext = resolveAiClosingRepositoryContext();
  const body = (await request.json()) as {
    reviewId?: unknown;
    decision?: unknown;
    notes?: unknown;
  };
  const reviewId = typeof body.reviewId === "string" ? body.reviewId : "";
  const decision =
    body.decision === "approved" || body.decision === "rejected"
      ? (body.decision satisfies HumanReviewDecision)
      : undefined;
  const notes = typeof body.notes === "string" ? body.notes : undefined;

  if (!reviewId) {
    return jsonError("reviewId is required.", 400);
  }

  if (!decision) {
    return jsonError("decision must be approved or rejected.", 400);
  }

  if (repositoryContext.mode === "mock") {
    return NextResponse.json({
      mode: "mock",
      decision,
      reviewId,
    });
  }

  try {
    const repository = new SupabaseAiClosingRepository(
      createSupabaseAdminClient(),
    );
    const result = await repository.saveHumanReviewDecision({
      reviewId,
      decision,
      notes,
      reviewerStaffId: repositoryContext.context.actorStaffId,
    });
    const auditLog = await repository.writeAuditLog({
      organizationId: repositoryContext.context.organizationId,
      storeId: repositoryContext.context.storeId,
      actorStaffId: repositoryContext.context.actorStaffId,
      action:
        decision === "approved"
          ? "ai_closing.human_approved"
          : "ai_closing.human_rejected",
      targetTable: "vision_reviews",
      targetId: result.review.id,
      afterData: result,
      metadata: {
        decision,
        submission_id: result.submission.id,
      },
    });

    return NextResponse.json({
      mode: "supabase",
      decision,
      reviewId,
      auditLogId: auditLog.id,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "ai_closing_review_decision_failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );

    return jsonError("Human review decision could not be saved.", 502);
  }
}
