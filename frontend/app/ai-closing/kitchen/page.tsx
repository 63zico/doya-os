import { ClosingFlowScreen } from "@/components/ai-closing/closing-flow-screen";
import { AppShell } from "@/components/layout/app-shell";
import { getZonesByArea } from "@/lib/ai-closing-data";

export default function KitchenClosingPage() {
  return (
    <AppShell activePath="/ai-closing/kitchen">
      <ClosingFlowScreen
        area="kitchen"
        title="Kitchen Closing"
        description="Kitchen staff submit evidence for floor and drain, refrigerator, and stove grease cleanup. AI inspects each submission and routes uncertain or failed items to manager review."
        zones={getZonesByArea("kitchen")}
      />
    </AppShell>
  );
}
