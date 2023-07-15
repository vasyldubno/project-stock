import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABSE_URL } from "./consts";
import { Database } from "@/types/supabase";

export const supabaseClient = createClient<Database>(
  SUPABSE_URL,
  SUPABASE_KEY,
  { auth: { persistSession: false } }
);
