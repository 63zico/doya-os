import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { NavItem } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  navigation: NavItem[];
};

export function AppSidebar({ navigation }: AppSidebarProps) {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-border bg-surface-base lg:flex lg:flex-col">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-foreground text-sm font-bold text-background">
            DO
          </div>
          <div>
            <p className="text-sm font-semibold leading-5">DOYA OS</p>
            <p className="text-xs leading-4 text-muted-foreground">
              AI Restaurant Operating System
            </p>
          </div>
        </div>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Primary">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                item.active
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              type="button"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </span>
              {item.count ? (
                <Badge variant={item.count > 2 ? "warning" : "neutral"}>
                  {item.count}
                </Badge>
              ) : null}
            </button>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <div className="rounded-lg border border-border bg-surface-subtle p-3">
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            Operating loop
          </p>
          <p className="mt-1 text-sm leading-5 text-foreground">
            People execute. AI inspects. Managers correct. Owners decide.
          </p>
        </div>
      </div>
    </aside>
  );
}
