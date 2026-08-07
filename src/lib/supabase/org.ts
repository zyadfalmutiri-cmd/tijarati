import type { SupabaseClient } from "@supabase/supabase-js";

/** Resolves the org_id of the signed-in user via org_members.
 * Returns null if there's no session yet (auth still loading) or the user
 * somehow has no membership row — callers should treat that as "no data". */
export async function getCurrentOrgId(supabase: SupabaseClient): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.org_id ?? null;
}
