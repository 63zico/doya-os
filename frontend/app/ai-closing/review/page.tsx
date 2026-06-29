import Link from "next/link";
import { ArrowLeft, History } from "lucide-react";
import { AiClosingPageHeader } from "@/components/ai-closing/ai-closing-page-header";
import { HumanReviewQueue } from "@/components/ai-closing/human-review-queue";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { aiClosingData } from "@/lib/ai-closing-data";

export default function HumanReviewPage() {
  return (
    <AppShell activePath="/ai-closing/review">
      <AiClosingPageHeader
        eyebrow="Manager surface"
        title="Human Review Queue"
        description="Only submissions requiring human judgment appear here. Managers approve acceptable exceptions or reject evidence and assign re-cleaning."
        action={
          <>
            <Button asChild variant="secondary">
              <Link href="/ai-closing">
                <ArrowLeft aria-hidden="true" />
                Overview
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/ai-closing/history">
                <History aria-hidden="true" />
                History
              </Link>
            </Button>
          </>
        }
      />

      {aiClosingData.reviewQueue.length > 0 ? (
        <HumanReviewQueue items={aiClosingData.reviewQueue} />
      ) : (
        <Card className="p-4">
          <p className="text-sm font-semibold">No reviews waiting</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            There are no failed or uncertain closing submissions for the current
            business date.
          </p>
        </Card>
      )}
    </AppShell>
  );
}
