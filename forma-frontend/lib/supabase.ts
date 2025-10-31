import { createClient, type SupabaseClientOptions } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

type SupabaseClientOptionsWithAuth = SupabaseClientOptions<"public">;

const BASE_STORAGE_KEY = "forma.auth.session";

const createOptions = (
  options?: SupabaseClientOptionsWithAuth,
): SupabaseClientOptionsWithAuth => {
  if (typeof window === "undefined") {
    return {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: BASE_STORAGE_KEY,
        flowType: "pkce",
      },
      ...options,
    } as SupabaseClientOptionsWithAuth;
  }

  const storage = window.localStorage;

  return {
    ...options,
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: options?.auth?.storageKey ?? BASE_STORAGE_KEY,
      storage: options?.auth?.storage ?? storage,
      flowType: options?.auth?.flowType ?? "pkce",
      ...options?.auth,
    },
  } as SupabaseClientOptionsWithAuth;
};

export const createSupabaseBrowserClient = (
  options?: SupabaseClientOptionsWithAuth,
) => createClient(supabaseUrl, supabaseAnonKey, createOptions(options));


