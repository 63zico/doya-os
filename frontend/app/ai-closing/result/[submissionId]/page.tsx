import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { AiClosingPageHeader } from "@/components/ai-closing/ai-closing-page-header";
import { AiEvaluationResultClient } from "@/components/ai-closing/ai-evaluation-result-client";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { aiClosingData, getResult, getZone } from "@/lib/ai-closing-data";
import type { AiEvaluationResult } from "@/lib/ai-closing-data";
import { resolveAiClosingRepositoryContext } from "@/lib/ai-closing/supabase-context";
import { SupabaseAiClosingRepository } from "@/lib/repositories/ai-closing-repository";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ResultPageProps = {
  params: Promise<{
    submissionId: string;
  }>;
};

export function generateStaticParams() {
  return aiClosingData.zones.map((zone) => ({
    submissionId: zone.submissionId,
  }));
}

async function getSupabaseResult(submissionId: string) {
  const repositoryContext = resolveAiClosingRepositoryContext();

  if (repositoryContext.mode === "mock") {
    return undefined;
  }

  try {
    const repository = new SupabaseAiClosingRepository(
      createSupabaseAdminClient(),
    );
    const submissions = await repository.listClosingState(
      repositoryContext.context.storeId,
      repositoryContext.context.businessDate,
    );
    const submission = submissions.find((item) => item.id === submissionId);
    const review = submission?.vision_reviews?.[0];
    const zone = submission
      ? getZone(submission.category)
      : undefined;

    if (!submission || !review || !zone) {
      return undefined;
    }

    return {
      zone,
      result: {
        submissionId: submission.id,
        zoneId: zone.id,
        status: review.status,
        score: review.score,
        confidence: review.confidence / 100,
        reason: review.explanation,
        requiredAction: review.recommended_actions.join(" "),
        timestamp: review.created_at,
        model: review.model,
        policyVersion: review.prompt_version,
        detectedIssues: review.detected_issues,
        recommendedActions: review.recommended_actions,
      } satisfies AiEvaluationResult,
    };
  } catch {
    return undefined;
  }
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { submissionId } = await params;
  const persisted = await getSupabaseResult(submissionId);
  const result = persisted?.result ?? getResult(submissionId);
  const zone = persisted?.zone ?? (result ? getZone(result.zoneId) : undefined);

  return (
    <AppShell activePath="/ai-closing">
      <AiClosingPageHeader
        eyebrow="AI evaluation result"
        title={zone ? `${zone.label} inspection` : "No result available"}
        description="The result screen exposes AI status, confidence, reason, required action, timestamp, model, and policy metadata for manager review."
        action={
          <Button asChild variant="secondary">
            <Link href="/ai-closing">
              <ArrowLeft aria-hidden="true" />
              Back to AI Closing
            </Link>
          </Button>
        }
      />

      {zone ? (
        <AiEvaluationResultClient fallbackResult={result} zone={zone} />
      ) : (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-subtle text-muted-foreground">
              <Camera aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Photo required</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No evaluation exists for this submission yet. Submit zone
                evidence first, then return to the result screen.
              </p>
            </div>
          </div>
        </Card>
      )}
    </AppShell>
  );
}
