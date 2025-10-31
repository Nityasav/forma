"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";

const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(50),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(50),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Use mixed case and numbers",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const { signUp, isLoading, error } = useAuth();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setFormErrors({});
    setSuccessMessage(null);

    const values: SignUpFormValues = {
      firstName: formData.get("first_name")?.toString() ?? "",
      lastName: formData.get("last_name")?.toString() ?? "",
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
      confirmPassword: formData.get("confirm_password")?.toString() ?? "",
    };

    const parsed = signUpSchema.safeParse(values);

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

    const authError = await signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
    });

    if (!authError) {
      setSuccessMessage(
        "Account created. Check your email to verify before logging in.",
      );
    }
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-sm text-slate-300" htmlFor="first_name">
            First name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.firstName && (
            <p className="text-xs text-red-400">{formErrors.firstName}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-sm text-slate-300" htmlFor="last_name">
            Last name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formErrors.lastName && (
            <p className="text-xs text-red-400">{formErrors.lastName}</p>
          )}
        </div>
      </div>

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
          autoComplete="new-password"
          className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {formErrors.password && (
          <p className="text-xs text-red-400">{formErrors.password}</p>
        )}
      </div>

      <div className="space-y-1">
        <label
          className="block text-sm text-slate-300"
          htmlFor="confirm_password"
        >
          Confirm password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {formErrors.confirmPassword && (
          <p className="text-xs text-red-400">
            {formErrors.confirmPassword}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-600 bg-red-900/30 px-4 py-3 text-sm text-red-200">
          {error.message}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-600 bg-emerald-900/30 px-4 py-3 text-sm text-emerald-200">
          {successMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors py-2 font-medium disabled:cursor-not-allowed disabled:bg-blue-500/60"
      >
        {isLoading ? "Creating account…" : "Create account"}
      </button>

      <p className="text-xs text-center text-slate-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="text-blue-400 hover:text-blue-300 underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

