"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Film,
  Layers,
  Lock,
  LogOut,
  Mail,
  MessageSquareQuote,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  Sliders,
} from "lucide-react";
import type { Inquiry, Project, SiteContent } from "@/lib/data";
import ProjectsPanel from "@/components/admin/ProjectsPanel";
import InquiriesPanel from "@/components/admin/InquiriesPanel";
import {
  HeroCmsTab,
  ServicesCmsTab,
  SettingsCmsTab,
  TestimonialsCmsTab,
} from "@/components/admin/CmsTabEditors";

type AdminTab =
  | "projects"
  | "hero"
  | "services"
  | "testimonials"
  | "inquiries"
  | "settings";

export default function AdminDashboardPage() {
  const [authChecking, setAuthChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Login gate state — never prefill credentials before authentication
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // CMS state
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [uploadingAsset, setUploadingAsset] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Security password update state
  const [newPassword, setNewPassword] = useState("");

  const notify = useCallback((type: "success" | "error", text: string) => {
    setNotice({ type, text });
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const fetchContent = useCallback(async () => {
    setLoadingContent(true);
    try {
      const [contentRes, inquiriesRes] = await Promise.all([
        fetch("/api/content", { cache: "no-store" }),
        fetch("/api/contact", { cache: "no-store" }),
      ]);

      if (contentRes.status === 401) {
        setAuthenticated(false);
        return;
      }

      const contentData = await contentRes.json();
      if (!contentRes.ok) {
        throw new Error(contentData.error || "Failed to load CMS content");
      }

      let loadedInquiries: Inquiry[] = Array.isArray(contentData.inquiries)
        ? contentData.inquiries
        : [];
      if (inquiriesRes.ok) {
        const inqData = await inquiriesRes.json();
        if (Array.isArray(inqData.inquiries)) {
          loadedInquiries = inqData.inquiries;
        }
      }

      setContent({
        ...contentData,
        inquiries: loadedInquiries,
      });
      setHasUnsavedChanges(false);
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Could not load CMS data."
      );
    } finally {
      setLoadingContent(false);
    }
  }, [notify]);

  const checkSession = useCallback(async () => {
    setAuthChecking(true);
    try {
      const res = await fetch("/api/auth", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setAuthenticated(true);
        if (typeof data.email === "string" && data.email) {
          setEmail(data.email);
        }
        await fetchContent();
      } else {
        setAuthenticated(false);
        setEmail("");
      }
    } catch {
      setAuthenticated(false);
      setEmail("");
    } finally {
      setAuthChecking(false);
    }
  }, [fetchContent]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
        return;
      }
      setAuthenticated(true);
      setPassword("");
      await fetchContent();
      notify("success", "Signed in to Studio CMS.");
    } catch {
      setAuthError("Network error while verifying credentials.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } finally {
      setAuthenticated(false);
      setContent(null);
      setEmail("");
      setPassword("");
      setHasUnsavedChanges(false);
    }
  };

  const handleContentDraftChange = useCallback((next: SiteContent) => {
    setContent(next);
    setHasUnsavedChanges(true);
  }, []);

  const handleMediaUpload = async (
    file: File,
    folder: string,
    onDone: (url: string) => void
  ) => {
    setUploadingAsset(folder);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onDone(data.url);
      setHasUnsavedChanges(true);
      notify(
        "success",
        "Media uploaded to Supabase Storage. Click Save Site Changes to publish."
      );
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Could not upload asset."
      );
    } finally {
      setUploadingAsset(null);
    }
  };

  const handleSaveGlobalSettings = async () => {
    if (!content) return;
    setSavingGlobal(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteSettings: content.siteSettings,
          hero: content.hero,
          categories: content.categories,
          workSection: content.workSection,
          servicesSection: content.servicesSection,
          testimonialsSection: content.testimonialsSection,
          contactSection: content.contactSection,
          services: content.services,
          about: content.about,
          process: content.process,
          testimonials: content.testimonials,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save site settings");
      }

      setContent((prev) =>
        prev
          ? {
              ...prev,
              ...data.content,
              projects: prev.projects,
              inquiries: prev.inquiries,
            }
          : null
      );
      setHasUnsavedChanges(false);
      notify(
        "success",
        "All CMS sections synced live to Supabase Postgres."
      );
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Could not save changes."
      );
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        "Restore global site copy, services, and testimonials back to default presets? Portfolio projects and inquiries remain untouched."
      )
    ) {
      return;
    }

    setSavingGlobal(true);
    try {
      const res = await fetch("/api/content/reset", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset content");
      }
      await fetchContent();
      notify("success", "Global CMS settings restored to studio defaults.");
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Reset failed."
      );
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      notify("error", "New password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          newPassword: newPassword.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not update password");
      }
      setNewPassword("");
      notify("success", "Admin password updated in Supabase Auth.");
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Could not update password."
      );
    }
  };

  // Loading state during initial auth verification
  if (authChecking) {
    return (
      <div className="min-h-screen bg-white text-neutral-950 flex flex-col items-center justify-center px-6">
        <div className="rounded-3xl bg-[#FAFAFB] border border-neutral-200 px-8 py-7 flex flex-col items-center gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-black animate-spin" />
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-500">
            Verifying Studio Session
          </p>
        </div>
      </div>
    );
  }

  // Protected Login Gate — zero CMS data rendered or leaked prior to login
  if (!authenticated) {
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

  const newInquiriesCount =
    content?.inquiries.filter((inq) => inq.status === "new").length ?? 0;

  const tabs: {
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[] = [
    {
      id: "projects",
      label: "Videos & Projects",
      icon: Film,
      badge: content?.projects.length,
    },
    { id: "hero", label: "Hero & Metrics", icon: Sliders },
    {
      id: "services",
      label: "Services & Process",
      icon: Layers,
      badge: content?.services.length,
    },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: MessageSquareQuote,
      badge: content?.testimonials.length,
    },
    {
      id: "inquiries",
      label: "Client Inquiries",
      icon: Mail,
      badge: newInquiriesCount > 0 ? `${newInquiriesCount} new` : undefined,
    },
    { id: "settings", label: "Contact & Security", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      {/* Top Studio Header Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-500 leading-none mb-1">
                SUPABASE DYNAMIC CONTENT MANAGEMENT
              </p>
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tighter text-neutral-950">
                  /STUDIO CMS
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Postgres Live
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {hasUnsavedChanges && (
              <span className="hidden md:inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-amber-800">
                Unsaved Section Edits
              </span>
            )}

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 px-4 py-2 text-xs font-medium text-neutral-800 transition-colors"
            >
              View Live Site
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={savingGlobal || loadingContent}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-[#FAFAFB] hover:border-neutral-400 disabled:opacity-50 px-4 py-2 text-xs font-medium text-neutral-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSaveGlobalSettings}
              disabled={savingGlobal || !content}
              className="inline-flex items-center gap-2 rounded-full bg-[#111111] hover:bg-neutral-800 disabled:opacity-50 text-white px-5 py-2 text-xs font-semibold tracking-wide transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {savingGlobal ? "Saving..." : "Save Site Changes"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 px-3.5 py-2 text-xs font-medium text-neutral-600 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">
        {/* Toast feedback banner */}
        {notice && (
          <div
            role="status"
            className={`rounded-2xl px-4 py-3 text-sm font-medium flex items-center justify-between gap-4 border ${
              notice.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notice.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotice(null)}
              className="text-xs font-mono uppercase opacity-70 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Obsidian Studio Contrast Summary Pod */}
        <section className="rounded-3xl bg-[#1A1A1D] text-white p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authenticated Session{email ? ` · ${email}` : ""}
            </div>
            <p className="text-base sm:text-lg font-medium text-white">
              Edit headings, portfolio videos, services, client reviews, and
              contact copy without redeploying code.
            </p>
            <p className="text-xs text-neutral-400">
              Video cards & inquiries update immediately in Postgres; section
              copy & global settings save via{" "}
              <span className="text-white font-medium">Save Site Changes</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Projects
              </p>
              <p className="text-xl font-bold text-white mt-0.5">
                {content?.projects.length ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Services
              </p>
              <p className="text-xl font-bold text-white mt-0.5">
                {content?.services.length ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Reviews
              </p>
              <p className="text-xl font-bold text-white mt-0.5">
                {content?.testimonials.length ?? "—"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Inquiries
              </p>
              <p className="text-xl font-bold text-emerald-400 mt-0.5">
                {content
                  ? `${newInquiriesCount} / ${content.inquiries.length}`
                  : "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Pill Tab Navigation matching WorkSection filter UI */}
        <nav
          aria-label="CMS Sections"
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  active
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-[#FAFAFB] text-neutral-700 border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                      active
                        ? "bg-white/15 text-white"
                        : "bg-neutral-200/80 text-neutral-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Active CMS Panel */}
        {loadingContent || !content ? (
          <div className="rounded-3xl bg-[#FAFAFB] border border-neutral-200 p-12 text-center">
            <div className="w-7 h-7 mx-auto rounded-full border-2 border-neutral-300 border-t-black animate-spin mb-3" />
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
              Loading Studio Content from Supabase...
            </p>
          </div>
        ) : (
          <div className="pb-12">
            {activeTab === "projects" && (
              <ProjectsPanel
                projects={content.projects}
                categories={content.categories}
                workSection={content.workSection}
                onProjectsChange={(projects: Project[]) =>
                  setContent((prev) => (prev ? { ...prev, projects } : null))
                }
                onWorkMetaChange={(nextWorkSection, nextCategories) => {
                  setContent((prev) =>
                    prev
                      ? {
                          ...prev,
                          workSection: nextWorkSection,
                          categories: nextCategories,
                        }
                      : null
                  );
                  setHasUnsavedChanges(true);
                }}
                onNotify={notify}
              />
            )}

            {activeTab === "hero" && (
              <HeroCmsTab
                content={content}
                onChange={handleContentDraftChange}
                uploadingAsset={uploadingAsset}
                uploadMedia={handleMediaUpload}
              />
            )}

            {activeTab === "services" && (
              <ServicesCmsTab
                content={content}
                onChange={handleContentDraftChange}
                uploadingAsset={uploadingAsset}
                uploadMedia={handleMediaUpload}
              />
            )}

            {activeTab === "testimonials" && (
              <TestimonialsCmsTab
                content={content}
                onChange={handleContentDraftChange}
              />
            )}

            {activeTab === "inquiries" && (
              <InquiriesPanel
                inquiries={content.inquiries}
                onInquiriesChange={(inquiries: Inquiry[]) =>
                  setContent((prev) => (prev ? { ...prev, inquiries } : null))
                }
                onNotify={notify}
              />
            )}

            {activeTab === "settings" && (
              <SettingsCmsTab
                content={content}
                onChange={handleContentDraftChange}
                email={email}
                newPassword={newPassword}
                onNewPasswordChange={setNewPassword}
                onChangePassword={handleChangePassword}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
