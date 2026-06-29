import type { AiClosingStatus } from "@/lib/ai-closing-data";
import { statusLabels } from "@/lib/ai-closing-data";
import type { StatusTone } from "@/lib/mock-data";
import { StatusBadge } from "@/components/dashboard/status-badge";

type AiClosingStatusBadgeProps = {
  status: AiClosingStatus;
};

export const statusTone: Record<AiClosingStatus, StatusTone> = {
  NOT_STARTED: "neutral",
  PHOTO_REQUIRED: "warning",
  ANALYZING: "ai",
  PASS: "success",
  FAIL: "danger",
  HUMAN_REVIEW: "warning",
};

export function AiClosingStatusBadge({ status }: AiClosingStatusBadgeProps) {
  return <StatusBadge tone={statusTone[status]} label={statusLabels[status]} />;
}
