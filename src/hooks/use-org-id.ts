"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentOrgId } from "@/lib/supabase/org";

/** Cached org_id of the signed-in user. Every other data hook includes this
 * in its React Query key so that switching between organizations (or
 * signing out/in as a different user) can never show a stale cached page of
 * data that belonged to a previous org — see تدقيق الأمان/QA C2. */
export function useOrgId() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["org-id"],
    queryFn: () => (supabase ? getCurrentOrgId(supabase) : Promise.resolve(null)),
    staleTime: 5 * 60_000,
  });
}
