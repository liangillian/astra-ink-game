
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./cloud-config.js";

export const cloudConfigured =
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_");

export const supabase = cloudConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    })
  : null;
