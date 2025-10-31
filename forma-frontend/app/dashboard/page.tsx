"use client";

import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-gray-400">
          Welcome{currentUser?.email ? `, ${currentUser.email}` : " to FORMA"}.
        </p>
        <p className="text-sm text-gray-500">
          This is a placeholder view while we build the full experience.
        </p>
      </div>
    </div>
  );
}

