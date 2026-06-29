import { AiClosingOverview } from "@/components/ai-closing/ai-closing-overview";
import { AppShell } from "@/components/layout/app-shell";

export default function AiClosingPage() {
  return (
    <AppShell activePath="/ai-closing">
      <AiClosingOverview />
    </AppShell>
  );
}
