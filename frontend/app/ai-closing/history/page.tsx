import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { AiClosingPageHeader } from "@/components/ai-closing/ai-closing-page-header";
import { ClosingHistoryList } from "@/components/ai-closing/closing-history-list";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { aiClosingData } from "@/lib/ai-closing-data";

export default function ClosingHistoryPage() {
  return (
    <AppShell activePath="/ai-closing/history">
      <AiClosingPageHeader
        eyebrow="Audit-oriented history"
        title="Closing History"
        description="Completed sessions are listed by business date, role, area, final status, completion time, and reviewer context."
        action={
          <>
            <Button asChild variant="secondary">
              <Link href="/ai-closing">
                <ArrowLeft aria-hidden="true" />
                Overview
              </Link>
            </Button>
            <Button asChild>
              <Link href="/ai-closing/review">
                <ShieldAlert aria-hidden="true" />
                Review queue
              </Link>
            </Button>
          </>
        }
      />

      <ClosingHistoryList items={aiClosingData.history} />
    </AppShell>
  );
}
