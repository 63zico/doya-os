import { AiClosingStatusBadge } from "@/components/ai-closing/ai-closing-status-badge";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import type { ClosingHistoryItem } from "@/lib/ai-closing-data";

type ClosingHistoryListProps = {
  items: ClosingHistoryItem[];
};

export function ClosingHistoryList({ items }: ClosingHistoryListProps) {
  return (
    <DashboardCard title="Completed closing sessions" eyebrow="History">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Role</th>
              <th className="py-2 pr-4 font-medium">Area</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Completed</th>
              <th className="py-2 font-medium">Reviewer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 pr-4 tabular-nums">{item.date}</td>
                <td className="py-3 pr-4">{item.role}</td>
                <td className="py-3 pr-4">{item.area}</td>
                <td className="py-3 pr-4">
                  <AiClosingStatusBadge status={item.status} />
                </td>
                <td className="py-3 pr-4 tabular-nums">{item.completedAt}</td>
                <td className="py-3 text-muted-foreground">{item.reviewer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  );
}
