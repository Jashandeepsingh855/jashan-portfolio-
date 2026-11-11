"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Eye, EyeOff, Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AdminLoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (!data.session || !data.user) {
        setAuthError("Invalid login credentials.");
        return;
      }

      const role = (
        data.user.app_metadata as { role?: string } | undefined
      )?.role;
      if (role !== "admin") {
        await supabase.auth.signOut();
        setAuthError("This account does not have administrator privileges.");
        return;
      }

      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : "Authentication failed."
      );
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-950 flex flex-col justify-between px-4 sm:px-8 py-8">
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-neutral-600">
            Private Studio Portal
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-[#FAFAFB] hover:border-neutral-400 px-4 py-2 text-xs font-medium text-neutral-800 transition-colors"
        >
          Back to Portfolio
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      <main className="w-full max-w-md mx-auto my-12">
        <div className="rounded-[2rem] bg-[#FAFAFB] border border-neutral-200/90 p-7 sm:p-9 shadow-sm space-y-7">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1D] text-white px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em]">
              <Lock className="w-3 h-3 text-emerald-400" />
              Supabase Auth Required
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tighter text-neutral-950 leading-none pt-1">
              /STUDIO CMS
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Authorized admin sign-in required to edit portfolio projects,
              video embeds, section headlines, and client inquiries.
            </p>
          </div>

          {authError && (
            <div
              role="alert"
              className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-medium text-red-700"
            >
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
              >
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full rounded-xl bg-white border border-neutral-200 px-4 py-3 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl bg-white border border-neutral-200 pl-4 pr-11 py-3 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full mt-2 rounded-full bg-[#111111] hover:bg-neutral-800 disabled:opacity-60 text-white py-3.5 px-6 text-sm font-semibold tracking-wide transition-colors cursor-pointer"
            >
              {loggingIn ? "Verifying Session..." : "Unlock Studio CMS"}
            </button>
          </form>
        </div>
      </main>

      <footer className="w-full max-w-6xl mx-auto flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400">
        <span>Encrypted JWT Cookie</span>
        <span>RLS Protected Database</span>
      </footer>
    </div>
  );
}
