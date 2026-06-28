import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StatusTone } from "@/lib/mock-data";

type StatusBadgeProps = {
  tone: StatusTone;
  label: string;
};

const toneIcon = {
  success: CheckCircle2,
  warning: AlertCircle,
  danger: XCircle,
  ai: Bot,
  neutral: Clock3,
};

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const Icon = toneIcon[tone];

  return (
    <Badge variant={tone}>
      <Icon aria-hidden="true" className="size-3.5" />
      {label}
    </Badge>
  );
}
