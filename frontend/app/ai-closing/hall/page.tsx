import { ClosingFlowScreen } from "@/components/ai-closing/closing-flow-screen";
import { AppShell } from "@/components/layout/app-shell";
import { getZonesByArea } from "@/lib/ai-closing-data";

export default function HallClosingPage() {
  return (
    <AppShell activePath="/ai-closing/hall">
      <ClosingFlowScreen
        area="hall"
        title="Hall Closing"
        description="Hall staff submit evidence for tables and chairs, hall floor, and counter or POS cleanup. AI inspects evidence and managers correct failed or uncertain submissions."
        zones={getZonesByArea("hall")}
      />
    </AppShell>
  );
}
