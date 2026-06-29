import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceConfig } from "@/lib/supabase/config";

export function createSupabaseAdminClient() {
  const { url, serviceRoleKey } = getSupabaseServiceConfig();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
