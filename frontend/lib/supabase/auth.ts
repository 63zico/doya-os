import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type DoyaRole = "OWNER" | "MANAGER" | "KITCHEN" | "HALL";

export async function signInWithPassword(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient();

  return supabase.auth.signOut();
}

export async function getCurrentSession() {
  const supabase = createSupabaseBrowserClient();

  return supabase.auth.getSession();
}
