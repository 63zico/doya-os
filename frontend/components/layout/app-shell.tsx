import type { ReactNode } from "react";
import Link from "next/link";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { TopNav } from "@/components/dashboard/top-nav";
import { Badge } from "@/components/ui/badge";
import { dashboardData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type AppShellProps = {
  activePath: string;
  children: ReactNode;
};

function isActivePath(activePath: string, href: string) {
  if (href === "/") {
    return activePath === href;
  }

  return activePath === href || activePath.startsWith(`${href}/`);
}

export function AppShell({ activePath, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface-canvas">
      <div className="flex min-h-screen">
        <AppSidebar
          navigation={dashboardData.navigation}
          activePath={activePath}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav
            storeName={dashboardData.store.name}
            role={dashboardData.store.role}
            businessDate={dashboardData.store.businessDate}
            lastUpdated={dashboardData.store.lastUpdated}
          />
          <nav
            className="border-b border-border bg-surface-base px-4 py-2 lg:hidden"
            aria-label="Primary mobile"
          >
            <div className="flex gap-2 overflow-x-auto">
              {dashboardData.navigation.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(activePath, item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      active
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {item.label}
                    {item.count ? (
                      <Badge variant={item.count > 2 ? "warning" : "neutral"}>
                        {item.count}
                      </Badge>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </nav>
          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-5">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
