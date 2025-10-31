"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn, signInWithGoogle, isLoading, error } = useAuth();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittingGoogle, setSubmittingGoogle] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setFormErrors({});

    const values: LoginFormValues = {
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };

    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setFormErrors(fieldErrors);
      return;
    }

    await signIn({ email: parsed.data.email, password: parsed.data.password });
  };

  const handleGoogle = async () => {
    setSubmittingGoogle(true);
    const authError = await signInWithGoogle();
    if (authError) {
      setSubmittingGoogle(false);
    }
  };

  return (
    <div className="space-y-5">
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm text-slate-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.email && (
            <p className="text-xs text-red-400">{formErrors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-slate-300" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.password && (
            <p className="text-xs text-red-400">{formErrors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            No account yet?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-400 hover:text-blue-300 underline-offset-4"
            >
              Create one
            </Link>
          </span>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-200"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-600 bg-red-900/30 px-4 py-3 text-sm text-red-200">
            {error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors py-2 font-medium disabled:cursor-not-allowed disabled:bg-blue-500/60"
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900/70 px-2 text-slate-500">
            or continue with
          </span>
        </div>
      </div>

      <button
        onClick={handleGoogle}
        disabled={submittingGoogle}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 py-2 font-medium transition-colors"
      >
        {submittingGoogle ? "Redirecting…" : "Continue with Google"}
      </button>
    </div>
  );
}

