"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, History, ShieldAlert } from "lucide-react";
import { AiClosingPageHeader } from "@/components/ai-closing/ai-closing-page-header";
import { ClosingZoneCard } from "@/components/ai-closing/closing-zone-card";
import { Button } from "@/components/ui/button";
import type { ClosingArea, ClosingZone } from "@/lib/ai-closing-data";
import { aiClosingData } from "@/lib/ai-closing-data";

type ClosingFlowScreenProps = {
  area: ClosingArea;
  title: string;
  description: string;
  zones: ClosingZone[];
};

const flowCopy: Record<ClosingArea, string> = {
  kitchen:
    "Kitchen staff should submit clean, visible evidence for every required kitchen zone before closing can be confirmed.",
  hall:
    "Hall staff should submit clean, visible evidence for every required hall zone and resolve failed inspections before final close.",
};

export function ClosingFlowScreen({
  area,
  title,
  description,
  zones,
}: ClosingFlowScreenProps) {
  return (
    <>
      <AiClosingPageHeader
        eyebrow={`${aiClosingData.businessDate} closing`}
        title={title}
        description={description}
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

      <section className="rounded-lg border border-border bg-surface-base p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-ai-subtle text-ai">
            <ShieldAlert aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Staff execution mode</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {flowCopy[area]} Staff see required actions and pass, fail, or
              review state. Detailed analytics remain on manager and owner
              surfaces.
            </p>
          </div>
        </div>
      </section>

      <motion.section
        className="grid gap-4 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.04 }}
        variants={{
          hidden: {},
          visible: {},
        }}
        aria-label={`${area} required zones`}
      >
        {zones.map((zone) => (
          <motion.div
            key={zone.id}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ClosingZoneCard zone={zone} />
          </motion.div>
        ))}
      </motion.section>
    </>
  );
}
