"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  ClipboardList,
  History,
  ShieldAlert,
} from "lucide-react";
import { AiClosingPageHeader } from "@/components/ai-closing/ai-closing-page-header";
import { ClosingZoneCard } from "@/components/ai-closing/closing-zone-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  aiClosingData,
  type ClosingZone,
} from "@/lib/ai-closing-data";

const cardMotion = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function AiClosingOverview() {
  const [closingState, setClosingState] = useState({
    overview: aiClosingData.overview,
    zones: aiClosingData.zones as ClosingZone[],
    mode: "mock",
  });
  const kitchenZones = closingState.zones.filter(
    (zone) => zone.area === "kitchen",
  );
  const hallZones = closingState.zones.filter((zone) => zone.area === "hall");

  useEffect(() => {
    let active = true;

    async function loadClosingState() {
      try {
        const response = await fetch("/api/ai-closing/state", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const state = (await response.json()) as {
          overview: typeof aiClosingData.overview;
          zones: ClosingZone[];
          mode: string;
        };

        if (active) {
          setClosingState({
            overview: state.overview,
            zones: state.zones,
            mode: state.mode,
          });
        }
      } catch {
        // The mock state is the fallback repository.
      }
    }

    void loadClosingState();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <AiClosingPageHeader
        eyebrow={aiClosingData.storeName}
        title="AI Closing"
        description="Staff submit closing evidence, AI inspects photos, managers review exceptions, and the system records final closing state."
        action={
          <>
            <Button asChild variant="secondary">
              <Link href="/ai-closing/history">
                <History aria-hidden="true" />
                History
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

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="AI Closing status">
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Session completion
          </p>
          <p className="mt-2 tabular-nums text-2xl font-semibold">
            {closingState.overview.completion}%
          </p>
          <Progress
            className="mt-3"
            value={closingState.overview.completion}
            indicatorClassName="bg-ai"
          />
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Human reviews
          </p>
          <p className="mt-2 tabular-nums text-2xl font-semibold">
            {closingState.overview.openReviews}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Manager action required
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Failed items
          </p>
          <p className="mt-2 tabular-nums text-2xl font-semibold">
            {closingState.overview.failedItems}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Re-clean before final close
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium text-muted-foreground">
            Submitted photos
          </p>
          <p className="mt-2 tabular-nums text-2xl font-semibold">
            {closingState.overview.submittedPhotos}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {closingState.mode === "supabase"
              ? "Persisted evidence"
              : "Mock local evidence"}
          </p>
        </Card>
      </section>

      <DashboardCard
        title="Today's closing state"
        eyebrow="Operating loop"
        action={<StatusBadge tone="warning" label="Attention required" />}
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <p className="text-sm leading-6 text-muted-foreground">
            {closingState.overview.summary}
          </p>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            <Button asChild variant="secondary">
              <Link href="/ai-closing/kitchen">
                <ClipboardList aria-hidden="true" />
                Kitchen flow
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/ai-closing/hall">
                <Camera aria-hidden="true" />
                Hall flow
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/ai-closing/review">
                <ShieldAlert aria-hidden="true" />
                Review queue
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </DashboardCard>

      <motion.section
        className="grid gap-4 lg:grid-cols-2"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.04 }}
        aria-label="Required AI Closing zones"
      >
        <motion.div variants={cardMotion} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Kitchen closing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Required zones: Floor / Drain, Refrigerator, Stove Grease.
            </p>
          </div>
          {kitchenZones.map((zone) => (
            <ClosingZoneCard key={zone.id} zone={zone} />
          ))}
        </motion.div>

        <motion.div variants={cardMotion} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Hall closing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Required zones: Tables / Chairs, Floor, Counter / POS.
            </p>
          </div>
          {hallZones.map((zone) => (
            <ClosingZoneCard key={zone.id} zone={zone} />
          ))}
        </motion.div>
      </motion.section>
    </>
  );
}
