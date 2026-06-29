import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AiClosingPageHeader } from "@/components/ai-closing/ai-closing-page-header";
import { PhotoCaptureMock } from "@/components/ai-closing/photo-capture-mock";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { aiClosingData, getZone } from "@/lib/ai-closing-data";

type CapturePageProps = {
  params: Promise<{
    zoneId: string;
  }>;
};

export function generateStaticParams() {
  return aiClosingData.zones.map((zone) => ({ zoneId: zone.id }));
}

export default async function CapturePage({ params }: CapturePageProps) {
  const { zoneId } = await params;
  const zone = getZone(zoneId);

  return (
    <AppShell activePath="/ai-closing">
      <AiClosingPageHeader
        eyebrow="Photo capture mock"
        title={zone ? `${zone.label} evidence` : "Unknown closing zone"}
        description="Capture is mocked for v1 frontend implementation. No camera, upload, backend, or storage integration is connected."
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
        <PhotoCaptureMock zone={zone} />
      ) : (
        <Card className="p-4">
          <p className="text-sm font-semibold">Zone not found</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            This mock route only supports the configured kitchen and hall
            closing zones.
          </p>
        </Card>
      )}
    </AppShell>
  );
}
