import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { AiClosingPageHeader } from "@/components/ai-closing/ai-closing-page-header";
import { AiEvaluationCard } from "@/components/ai-closing/ai-evaluation-card";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { aiClosingData, getResult, getZone } from "@/lib/ai-closing-data";

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

export default async function ResultPage({ params }: ResultPageProps) {
  const { submissionId } = await params;
  const result = getResult(submissionId);
  const zone = result ? getZone(result.zoneId) : undefined;

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

      {result && zone ? (
        <AiEvaluationCard result={result} zone={zone} />
      ) : (
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-subtle text-muted-foreground">
              <Camera aria-hidden="true" className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">Photo required</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No mock evaluation exists for this submission yet. Submit zone
                evidence first, then return to the result screen.
              </p>
            </div>
          </div>
        </Card>
      )}
    </AppShell>
  );
}
