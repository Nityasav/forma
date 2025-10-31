import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FORMA • Authenticate",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Forma
          </p>
          <h1 className="text-3xl font-semibold">Welcome</h1>
          <p className="text-sm text-slate-400">
            Sign in or create an account to continue.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/60 backdrop-blur p-6 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

