"use client";

import { useEffect, useState } from "react";
import { AiEvaluationCard } from "@/components/ai-closing/ai-evaluation-card";
import { Card } from "@/components/ui/card";
import type { AiEvaluationResult, ClosingZone } from "@/lib/ai-closing-data";

type AiEvaluationResultClientProps = {
  fallbackResult?: AiEvaluationResult;
  zone: ClosingZone;
};

export function AiEvaluationResultClient({
  fallbackResult,
  zone,
}: AiEvaluationResultClientProps) {
  const [sessionResult, setSessionResult] = useState<AiEvaluationResult>();

  useEffect(() => {
    const stored = sessionStorage.getItem(
      `doya-ai-closing-result:${zone.submissionId}`,
    );

    if (!stored) {
      return;
    }

    try {
      setSessionResult(JSON.parse(stored) as AiEvaluationResult);
    } catch {
      sessionStorage.removeItem(`doya-ai-closing-result:${zone.submissionId}`);
    }
  }, [zone.submissionId]);

  const result = sessionResult ?? fallbackResult;

  if (!result) {
    return (
      <Card className="p-4">
        <p className="text-sm font-semibold">Photo required</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          No evaluation exists for this submission in the current session.
          Submit zone evidence first, then return to this result screen.
        </p>
      </Card>
    );
  }

  return <AiEvaluationCard result={result} zone={zone} />;
}
