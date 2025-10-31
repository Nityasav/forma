"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";

const COUNTDOWN_SECONDS = 5 * 60;

export default function VerifyPage() {
  const { supabase, currentUser } = useAuth();
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [resendError, setResendError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const handleResend = async () => {
    if (!currentUser?.email) return;
    setResendStatus("sending");
    setResendError(null);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: currentUser.email,
    });

    if (error) {
      setResendStatus("error");
      setResendError(error.message);
      return;
    }

    setResendStatus("sent");
    setSecondsLeft(COUNTDOWN_SECONDS);
  };

  return (
    <div className="space-y-5 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Verify your email</h2>
        <p className="text-sm text-slate-400">
          We sent a verification link to {currentUser?.email ?? "your email"}.
          Please confirm your address to continue.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-5 space-y-2">
        <p className="text-sm text-slate-300">Link expires in</p>
        <p className="text-3xl font-mono tracking-widest text-blue-400">
          {formattedTime}
        </p>
      </div>

      {resendError && (
        <p className="text-xs text-red-400">{resendError}</p>
      )}

      <button
        onClick={handleResend}
        disabled={resendStatus === "sending" || secondsLeft > 0}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 py-2 font-medium transition-colors disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-600"
      >
        {resendStatus === "sending"
          ? "Resending…"
          : secondsLeft > 0
            ? `Resend available in ${formattedTime}`
            : "Resend email"}
      </button>

      <div className="text-xs text-slate-500 space-y-2">
        <p>
          Once you click the link in your inbox, return here and continue to the
          dashboard.
        </p>
        <p>
          Already verified?{" "}
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            Go to your dashboard
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

