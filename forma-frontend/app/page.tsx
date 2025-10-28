"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

type AuthState = "idle" | "loading" | "authenticated" | "unauthenticated";

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setAuthState("authenticated");
        setUserEmail(data.user.email ?? null);
      } else {
        setAuthState("unauthenticated");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setAuthState("authenticated");
        setUserEmail(session.user.email ?? null);
      } else {
        setAuthState("unauthenticated");
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setError(null);
    setAuthState("loading");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setAuthState("unauthenticated");
    }
  };

  const handleSignOut = async () => {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-400">FORMA • Supabase Auth Test</p>
          <h1 className="text-3xl font-semibold">Google Sign-In</h1>
          <p className="text-gray-400">
            Use this minimal screen to verify Supabase OAuth with Google before
            integrating into the full app.
          </p>
        </div>

        <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-6 space-y-4">
          {authState === "authenticated" ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-400">Signed in as</p>
              <p className="text-lg font-medium">{userEmail}</p>
              <button
                onClick={handleSignOut}
                className="w-full rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors py-3"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={authState === "loading"}
                className="w-full rounded-lg bg-white text-gray-900 hover:bg-gray-200 transition-colors py-3 font-medium"
              >
                {authState === "loading"
                  ? "Redirecting to Google..."
                  : "Continue with Google"}
              </button>
              <p className="text-xs text-gray-500 text-center">
                Your browser will redirect to Google → Supabase → this page.
              </p>
            </div>
          )}

          {error ? (
            <div className="rounded-lg border border-red-700 bg-red-950/60 text-red-100 px-4 py-3 text-sm">
              {error}
            </div>
          ) : authState === "authenticated" ? (
            <div className="rounded-lg border border-emerald-700 bg-emerald-950/60 text-emerald-100 px-4 py-3 text-sm">
              Google OAuth successful. Session established.
            </div>
          ) : null}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            • Make sure `NEXT_PUBLIC_SUPABASE_URL` and
            `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set.
          </p>
          <p>• For local testing, Site URL can remain http://localhost:3000.</p>
        </div>
      </div>
    </div>
  );
}
