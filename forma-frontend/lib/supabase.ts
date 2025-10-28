import { createClient, type SupabaseClientOptions } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

type SupabaseClientOptionsWithAuth = SupabaseClientOptions<"public">;

const defaultOptions: SupabaseClientOptionsWithAuth = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
};

export const createSupabaseBrowserClient = (
  options?: SupabaseClientOptionsWithAuth,
) =>
  createClient(supabaseUrl, supabaseAnonKey, {
    ...defaultOptions,
    ...options,
    auth: {
      ...defaultOptions.auth,
      ...(options?.auth ?? {}),
    },
  });


