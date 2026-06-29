import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ClipboardCheck,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { AiClosingStatusBadge } from "@/components/ai-closing/ai-closing-status-badge";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import type { ClosingZone } from "@/lib/ai-closing-data";

type ClosingZoneCardProps = {
  zone: ClosingZone;
};

function getPrimaryAction(zone: ClosingZone) {
  if (zone.status === "FAIL") {
    return {
      href: `/ai-closing/capture/${zone.id}`,
      label: "Resubmit",
      icon: RotateCcw,
      variant: "danger" as const,
    };
  }

  if (zone.status === "HUMAN_REVIEW") {
    return {
      href: "/ai-closing/review",
      label: "Manager review",
      icon: ShieldAlert,
      variant: "secondary" as const,
    };
  }

  if (zone.status === "PASS" || zone.status === "ANALYZING") {
    return {
      href: `/ai-closing/result/${zone.submissionId}`,
      label: "View result",
      icon: ClipboardCheck,
      variant: "secondary" as const,
    };
  }

  return {
    href: `/ai-closing/capture/${zone.id}`,
    label: "Submit photo",
    icon: Camera,
    variant: "default" as const,
  };
}

export function ClosingZoneCard({ zone }: ClosingZoneCardProps) {
  const primaryAction = getPrimaryAction(zone);
  const PrimaryIcon = primaryAction.icon;

  return (
    <DashboardCard
      title={zone.label}
      eyebrow={zone.owner}
      action={<AiClosingStatusBadge status={zone.status} />}
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">
          {zone.instruction}
        </p>

        <dl className="grid gap-2 rounded-md border border-border bg-surface-subtle p-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Evidence
            </dt>
            <dd className="mt-1 leading-5">{zone.evidenceHint}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-muted-foreground">
              Required photos
            </dt>
            <dd className="mt-1 tabular-nums leading-5">
              {zone.requiredPhotos}
            </dd>
          </div>
        </dl>

        {zone.status === "FAIL" ? (
          <div className="rounded-md border border-danger/30 bg-danger-subtle p-3 text-sm leading-5 text-foreground">
            Re-clean this zone, then submit a new photo. The failed evidence
            remains in manager review until the correction is accepted.
          </div>
        ) : null}

        {zone.status === "HUMAN_REVIEW" ? (
          <div className="rounded-md border border-warning/30 bg-warning-subtle p-3 text-sm leading-5 text-foreground">
            Manager review is required because AI could not confirm the result
            with sufficient confidence.
          </div>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant={primaryAction.variant}>
            <Link href={primaryAction.href}>
              <PrimaryIcon aria-hidden="true" />
              {primaryAction.label}
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href={`/ai-closing/result/${zone.submissionId}`}>
              Result detail
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
