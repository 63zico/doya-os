import { aiClosingData } from "@/lib/ai-closing-data";
import type {
  AiClosingContext,
  AiClosingRepositoryMode,
} from "@/lib/repositories/ai-closing-repository";
import { isSupabaseServiceConfigured } from "@/lib/supabase/config";

export type AiClosingRepositoryContext =
  | {
      mode: "supabase";
      context: AiClosingContext;
    }
  | {
      mode: "mock";
      reason: string;
    };

function optionalFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function resolveAiClosingRepositoryContext(
  formData?: FormData,
): AiClosingRepositoryContext {
  if (!isSupabaseServiceConfigured()) {
    return {
      mode: "mock",
      reason: "Supabase service credentials are not configured.",
    };
  }

  const organizationId =
    optionalFormValue(formData ?? new FormData(), "organizationId") ??
    process.env.SUPABASE_DEFAULT_ORGANIZATION_ID;
  const storeId =
    optionalFormValue(formData ?? new FormData(), "storeId") ??
    process.env.SUPABASE_DEFAULT_STORE_ID;
  const actorStaffId =
    optionalFormValue(formData ?? new FormData(), "actorStaffId") ??
    process.env.SUPABASE_DEFAULT_STAFF_ID;
  const businessDate =
    optionalFormValue(formData ?? new FormData(), "businessDate") ??
    process.env.SUPABASE_DEFAULT_BUSINESS_DATE ??
    aiClosingData.businessDate;

  if (!organizationId || !storeId) {
    return {
      mode: "mock",
      reason:
        "Supabase is configured, but SUPABASE_DEFAULT_ORGANIZATION_ID or SUPABASE_DEFAULT_STORE_ID is missing.",
    };
  }

  return {
    mode: "supabase",
    context: {
      organizationId,
      storeId,
      actorStaffId,
      businessDate,
    },
  };
}

export function repositoryModeLabel(
  context: AiClosingRepositoryContext,
): AiClosingRepositoryMode {
  return context.mode;
}
