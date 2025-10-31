"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase";

const cleanAuthParams = () => {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  window.history.replaceState({}, document.title, url.pathname);
};

type VerifyType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change";

function CallbackContent() {
  const router = useRouter();
  const [status, setStatus] = useState<"exchanging" | "success" | "error">(
    "exchanging",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelled = false;

    const redirectToDashboard = () => {
      cleanAuthParams();
      setStatus("success");
      setTimeout(() => router.replace("/dashboard"), 500);
    };

    const handleCallback = async () => {
      const { data: existingSession, error: existingError } =
        await supabase.auth.getSession();

      if (cancelled) return;

      if (existingError) {
        setStatus("error");
        setMessage(existingError.message);
        return;
      }

      if (existingSession.session) {
        redirectToDashboard();
        return;
      }

      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { data: tokenSession, error: tokenError } =
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

        if (cancelled) return;

        if (tokenError || !tokenSession.session) {
          setStatus("error");
          setMessage(tokenError?.message ?? "Unable to establish a session.");
          return;
        }

        redirectToDashboard();
        return;
      }

      const currentUrl = new URL(window.location.href);
      const token = currentUrl.searchParams.get("token");
      const email = currentUrl.searchParams.get("email");
      const typeParam = currentUrl.searchParams.get("type");
      const code = currentUrl.searchParams.get("code");
      const errorDescription = currentUrl.searchParams.get(
        "error_description",
      );

      if (token && typeParam) {
        if (!email) {
          setStatus("error");
          setMessage("Missing email for verification.");
          return;
        }

        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: typeParam as VerifyType,
        });

        if (cancelled) return;

        if (error || !data.session) {
          setStatus("error");
          setMessage(error?.message ?? "Unable to verify email.");
          return;
        }

        redirectToDashboard();
        return;
      }

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (cancelled) return;

        if (error || !data.session) {
          setStatus("error");
          setMessage(error?.message ?? "Unable to complete sign-in.");
          return;
        }

        redirectToDashboard();
        return;
      }

      if (errorDescription) {
        setStatus("error");
        setMessage(errorDescription);
        return;
      }

      setStatus("error");
      setMessage("No active session. Please try signing in again.");
    };

    handleCallback();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="max-w-md w-full space-y-6 text-center">
      <h1 className="text-2xl font-semibold">Signing you in…</h1>
      {status === "exchanging" && (
        <p className="text-sm text-gray-400">
          Exchanging credentials with Supabase. You will be redirected in a
          moment.
        </p>
      )}
      {status === "success" && (
        <p className="text-sm text-emerald-300">
          Authentication successful. Redirecting…
        </p>
      )}
      {status === "error" && (
        <div className="space-y-3">
          <p className="text-sm text-red-300">
            We couldn’t complete the sign-in. {message}
          </p>
          <button
            onClick={() => router.replace("/auth/login")}
            className="rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2"
          >
            Back to login
          </button>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">Processing sign-in…</h1>
            <p className="text-sm text-gray-400">
              Redirecting to Supabase to complete authentication.
            </p>
          </div>
        </div>
      }
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
        <CallbackContent />
      </div>
    </Suspense>
  );
}

