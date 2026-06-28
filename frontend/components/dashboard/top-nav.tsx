import { Bell, Menu, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type TopNavProps = {
  storeName: string;
  role: string;
  businessDate: string;
  lastUpdated: string;
};

export function TopNav({
  storeName,
  role,
  businessDate,
  lastUpdated,
}: TopNavProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface-canvas/90 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            className="lg:hidden"
            size="icon"
            type="button"
            variant="secondary"
            aria-label="Open navigation"
          >
            <Menu aria-hidden="true" />
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-5">
              {storeName}
            </p>
            <p className="truncate text-xs leading-4 text-muted-foreground">
              {role} · Business date {businessDate} · Updated {lastUpdated}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="hidden sm:inline-flex"
            type="button"
            variant="secondary"
            aria-label="Search operations"
          >
            <Search aria-hidden="true" />
            Search
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            aria-label="Open notifications"
          >
            <Bell aria-hidden="true" />
          </Button>
          <Avatar aria-label="Owner profile">O</Avatar>
        </div>
      </div>
    </header>
  );
}
