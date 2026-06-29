import { NextResponse } from "next/server";
import { aiClosingData, type ClosingZone } from "@/lib/ai-closing-data";
import { resolveAiClosingRepositoryContext } from "@/lib/ai-closing/supabase-context";
import {
  overlaySupabaseClosingState,
  SupabaseAiClosingRepository,
} from "@/lib/repositories/ai-closing-repository";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function buildOverview(zones: ClosingZone[]) {
  const complete = zones.filter((zone) => zone.status === "PASS").length;
  const openReviews = zones.filter(
    (zone) => zone.status === "HUMAN_REVIEW",
  ).length;
  const failedItems = zones.filter((zone) => zone.status === "FAIL").length;
  const submittedPhotos = zones.filter(
    (zone) => zone.status !== "NOT_STARTED" && zone.status !== "PHOTO_REQUIRED",
  ).length;

  return {
    completion: Math.round((complete / zones.length) * 100),
    openReviews,
    failedItems,
    submittedPhotos,
    summary:
      openReviews > 0 || failedItems > 0
        ? "Closing evidence has exceptions that require manager action before the session can be confirmed."
        : "Closing evidence is ready for review. Staff can continue submitting any remaining required photos.",
  };
}

export async function GET() {
  const repositoryContext = resolveAiClosingRepositoryContext();

  if (repositoryContext.mode === "mock") {
    return NextResponse.json({
      mode: "mock",
      reason: repositoryContext.reason,
      ...aiClosingData,
    });
  }

  try {
    const repository = new SupabaseAiClosingRepository(
      createSupabaseAdminClient(),
    );
    const submissions = await repository.listClosingState(
      repositoryContext.context.storeId,
      repositoryContext.context.businessDate,
    );
    const zones = overlaySupabaseClosingState(aiClosingData.zones, submissions);

    return NextResponse.json({
      mode: "supabase",
      businessDate: repositoryContext.context.businessDate,
      storeName: aiClosingData.storeName,
      overview: buildOverview(zones),
      zones,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "ai_closing_state_read_failed",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );

    return NextResponse.json({
      mode: "mock",
      reason: "Supabase AI Closing state could not be read.",
      ...aiClosingData,
    });
  }
}
