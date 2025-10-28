"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createSupabaseBrowserClient } from "@/lib/supabase";

function CallbackContent() {
  const router = useRouter();
  const [status, setStatus] = useState<"exchanging" | "success" | "error">(
    "exchanging",
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const handleCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const errorDescription = url.searchParams.get("error_description");

      const { data: activeSession, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        setStatus("error");
        setMessage(sessionError.message);
        return;
      }

      if (activeSession.session) {
        setStatus("success");
        setTimeout(() => router.replace("/"), 500);
        return;
      }

      if (!code) {
        if (errorDescription) {
          setStatus("error");
          setMessage(errorDescription);
        } else {
          setStatus("error");
          setMessage("Missing OAuth code.");
        }
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      if (!data.session) {
        setStatus("error");
        setMessage("No session returned from Supabase.");
        return;
      }

      setStatus("success");
      setTimeout(() => router.replace("/"), 500);
    };

    handleCallback();
  }, [router]);

  return (
    <div className="max-w-md w-full space-y-6 text-center">
      <h1 className="text-2xl font-semibold">Signing you in…</h1>
      {status === "exchanging" && (
        <p className="text-sm text-gray-400">
          Exchanging OAuth code with Supabase. You will be redirected in a
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
            onClick={() => router.replace("/")}
            className="rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2"
          >
            Return home
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

