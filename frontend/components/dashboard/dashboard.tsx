"use client";

import { motion } from "framer-motion";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { AiManagerCard } from "@/components/dashboard/ai-manager-card";
import { BonusProgressCard } from "@/components/dashboard/bonus-progress-card";
import { ClosingCard } from "@/components/dashboard/closing-card";
import { InventoryRiskCard } from "@/components/dashboard/inventory-risk-card";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { StoreHealthCard } from "@/components/dashboard/store-health-card";
import { TopNav } from "@/components/dashboard/top-nav";
import { Card } from "@/components/ui/card";
import { dashboardData } from "@/lib/mock-data";

const cardMotion = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function Dashboard() {
  return (
    <div className="min-h-screen bg-surface-canvas">
      <div className="flex min-h-screen">
        <AppSidebar navigation={dashboardData.navigation} />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav
            storeName={dashboardData.store.name}
            role={dashboardData.store.role}
            businessDate={dashboardData.store.businessDate}
            lastUpdated={dashboardData.store.lastUpdated}
          />
          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-5">
              <section
                className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                aria-labelledby="dashboard-title"
              >
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {dashboardData.store.location}
                  </p>
                  <h1
                    id="dashboard-title"
                    className="mt-1 text-2xl font-semibold tracking-normal text-foreground"
                  >
                    Dashboard
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Store health, AI review state, inventory risk, and bonus
                    blockers for today&apos;s operating loop.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {dashboardData.quickStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <Card
                        key={stat.label}
                        className="min-w-32 bg-surface-base px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <Icon
                            aria-hidden="true"
                            className="size-4 text-muted-foreground"
                          />
                          <p className="truncate text-xs text-muted-foreground">
                            {stat.label}
                          </p>
                        </div>
                        <p className="mt-1 tabular-nums text-sm font-semibold">
                          {stat.value}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              </section>

              <motion.section
                className="grid gap-4 lg:grid-cols-12"
                initial="hidden"
                animate="visible"
                transition={{ staggerChildren: 0.05 }}
                aria-label="Dashboard cards"
              >
                <motion.div variants={cardMotion} className="lg:col-span-7">
                  <StoreHealthCard health={dashboardData.storeHealth} />
                </motion.div>
                <motion.div variants={cardMotion} className="lg:col-span-5">
                  <ClosingCard closing={dashboardData.closing} />
                </motion.div>
                <motion.div variants={cardMotion} className="lg:col-span-4">
                  <InventoryRiskCard inventory={dashboardData.inventory} />
                </motion.div>
                <motion.div variants={cardMotion} className="lg:col-span-4">
                  <BonusProgressCard bonus={dashboardData.bonus} />
                </motion.div>
                <motion.div variants={cardMotion} className="lg:col-span-4">
                  <RecentAlerts alerts={dashboardData.alerts} />
                </motion.div>
                <motion.div variants={cardMotion} className="lg:col-span-8">
                  <AiManagerCard aiManager={dashboardData.aiManager} />
                </motion.div>
              </motion.section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
