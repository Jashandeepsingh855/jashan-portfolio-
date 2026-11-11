"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle2,
  Film,
  Image as ImageIcon,
  Layers,
  Lock,
  LogOut,
  MessageSquare,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import type { SiteContent } from "@/lib/data";
import ProjectsPanel from "@/components/admin/ProjectsPanel";
import InquiriesPanel from "@/components/admin/InquiriesPanel";

type AdminTab =
  | "projects"
  | "inquiries"
  | "hero"
  | "services"
  | "testimonials"
  | "settings";

export default function AdminPortalPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("admin@jashandeepsingh.film");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [content, setContent] = useState<SiteContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [uploadingAsset, setUploadingAsset] = useState<string | null>(null);

  const notify = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  }, []);

  const loadContent = useCallback(async () => {
    setLoadingContent(true);
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load studio content.");
      const data = (await res.json()) as SiteContent;
      setContent(data);
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Could not load content."
      );
    } finally {
      setLoadingContent(false);
    }
  }, [notify]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth", { cache: "no-store" });
        const data = await res.json();
        if (data.defaultEmail) setEmail(data.defaultEmail);
        if (data.authenticated) {
          setAuthenticated(true);
          loadContent();
        }
      } catch {
        setAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, [loadContent]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Invalid credentials");
        return;
      }

      setAuthenticated(true);
      setPassword("");
      await loadContent();
    } catch {
      setLoginError("Unable to reach authentication service.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setAuthenticated(false);
    setContent(null);
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
          services: content.services,
          about: content.about,
          process: content.process,
          testimonials: content.testimonials,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setContent(data.content);
      notify(
        "success",
        "All portfolio settings saved to Supabase & live site updated."
      );
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Failed to save site settings."
      );
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        "Reset portfolio settings and projects back to the default template?"
      )
    ) {
      return;
    }

    setSavingGlobal(true);
    try {
      const res = await fetch("/api/content/reset", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setContent(data.content);
      notify("success", "Portfolio reset to factory template defaults.");
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Failed to reset content."
      );
    } finally {
      setSavingGlobal(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");

      setNewPassword("");
      notify("success", "Supabase Auth administrator password updated.");
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Password update failed."
      );
    }
  };

  const uploadMedia = async (
    file: File,
    folder: string,
    onDone: (url: string) => void
  ) => {
    setUploadingAsset(folder);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      onDone(data.url);
      notify("success", `Uploaded ${file.name} to Supabase Storage.`);
    } catch (err) {
      notify(
        "error",
        err instanceof Error ? err.message : "Failed to upload asset."
      );
    } finally {
      setUploadingAsset(null);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-400 flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Verifying Studio Session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#f4f4f5] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-[#0e0e12] border border-white/10 p-7 sm:p-9 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-black flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Studio CMS</h1>
                <p className="text-[11px] font-mono text-zinc-400">
                  SUPABASE AUTH PROTECTED
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="text-xs font-mono text-zinc-400 hover:text-white inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Site</span>
            </Link>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter studio password"
                className="w-full rounded-xl bg-black/60 border border-white/15 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white"
              />
            </div>

            {loginError && (
              <p className="text-xs font-mono text-red-400">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-white text-black font-bold text-xs uppercase tracking-wider py-3.5 rounded-full hover:bg-zinc-200 transition-colors disabled:opacity-60"
            >
              {loggingIn ? "Authenticating..." : "Unlock Admin Studio"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: typeof Film; badge?: number }[] = [
    {
      id: "projects",
      label: "Projects",
      icon: Film,
      badge: content?.projects.length,
    },
    {
      id: "inquiries",
      label: "Inquiries",
      icon: MessageSquare,
      badge: content?.inquiries.filter((i) => i.status === "new").length,
    },
    { id: "hero", label: "Hero & Showreel", icon: Layers },
    { id: "services", label: "Services & Track", icon: Briefcase },
    { id: "testimonials", label: "Reviews", icon: Award },
    { id: "settings", label: "Settings & Auth", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5]">
      {/* Top Studio Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white">
                Studio CMS Portal
              </h1>
              <p className="text-[11px] font-mono text-zinc-500 hidden sm:block">
                Connected to Supabase PostgreSQL · {email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              disabled={savingGlobal || !content}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/15 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/30 disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSaveGlobalSettings}
              disabled={savingGlobal || !content}
              className="inline-flex items-center gap-1.5 bg-white text-black px-4 sm:px-5 py-2 rounded-full text-xs font-bold hover:bg-zinc-200 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingGlobal ? "Saving..." : "Save Site Changes"}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl px-4 py-3 text-xs font-medium shadow-2xl border flex items-center gap-2.5 bg-[#121216] border-white/15 text-white">
          <CheckCircle2
            className={`w-4 h-4 shrink-0 ${
              toast.type === "success" ? "text-accentGreen" : "text-red-400"
            }`}
          />
          <span>{toast.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Tab Strip */}
        <nav className="flex flex-wrap gap-2 pb-4 border-b border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "bg-[#111115] text-zinc-400 border border-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                      active
                        ? "bg-black/15 text-black"
                        : "bg-white/10 text-zinc-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {loadingContent || !content ? (
          <div className="py-20 text-center text-xs font-mono uppercase tracking-widest text-zinc-500">
            Loading portfolio data from Supabase...
          </div>
        ) : (
          <>
            {activeTab === "projects" && (
              <ProjectsPanel
                projects={content.projects}
                categories={content.categories}
                onProjectsChange={(projects) =>
                  setContent({ ...content, projects })
                }
                onNotify={notify}
              />
            )}

            {activeTab === "inquiries" && (
              <InquiriesPanel
                inquiries={content.inquiries}
                onInquiriesChange={(inquiries) =>
                  setContent({ ...content, inquiries })
                }
                onNotify={notify}
              />
            )}

            {activeTab === "hero" && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-[#101014] border border-white/10 p-6 space-y-5">
                  <h2 className="text-lg font-bold text-white">
                    Hero Wordmark, Copy &amp; Portrait Cutout
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Background Outlined Wordmark
                      </label>
                      <input
                        type="text"
                        value={content.siteSettings.wordmark}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            siteSettings: {
                              ...content.siteSettings,
                              wordmark: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Role Heading
                      </label>
                      <input
                        type="text"
                        value={content.siteSettings.role}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            siteSettings: {
                              ...content.siteSettings,
                              role: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Hero Badge
                      </label>
                      <input
                        type="text"
                        value={content.hero.badge}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: { ...content.hero, badge: e.target.value },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Portrait Cutout Image
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={content.hero.portraitImage}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              hero: {
                                ...content.hero,
                                portraitImage: e.target.value,
                              },
                            })
                          }
                          className="flex-1 rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                        />
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>
                            {uploadingAsset === "portrait" ? "..." : "Upload"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                uploadMedia(file, "portrait", (url) =>
                                  setContent((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          hero: {
                                            ...prev.hero,
                                            portraitImage: url,
                                          },
                                        }
                                      : prev
                                  )
                                );
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                      Hero Bio / Mission Copy
                    </label>
                    <textarea
                      rows={2}
                      value={content.hero.description}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, description: e.target.value },
                        })
                      }
                      className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="rounded-3xl bg-[#101014] border border-white/10 p-6 space-y-5">
                  <h2 className="text-lg font-bold text-white">
                    Showreel Master &amp; Metrics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Showreel Title
                      </label>
                      <input
                        type="text"
                        value={content.hero.showreelTitle}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              showreelTitle: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Showreel Video URL
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={content.hero.showreelVideoUrl}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              hero: {
                                ...content.hero,
                                showreelVideoUrl: e.target.value,
                              },
                            })
                          }
                          className="flex-1 rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                        />
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white">
                          <Upload className="w-3.5 h-3.5" />
                          <span>
                            {uploadingAsset === "showreel" ? "..." : "Upload"}
                          </span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file)
                                uploadMedia(file, "showreel", (url) =>
                                  setContent((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          hero: {
                                            ...prev.hero,
                                            showreelVideoUrl: url,
                                          },
                                        }
                                      : prev
                                  )
                                );
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Showreel Cover Image
                      </label>
                      <input
                        type="text"
                        value={content.hero.showreelCoverImage}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              showreelCoverImage: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Production Stack Tools (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={content.hero.hardwarePipeline.join(", ")}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            hero: {
                              ...content.hero,
                              hardwarePipeline: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400">
                    Remember to click &ldquo;Save Site Changes&rdquo; above to
                    persist Hero edits.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div className="space-y-8">
                {/* Services Editor */}
                <div className="rounded-3xl bg-[#101014] border border-white/10 p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">
                      Services Offerings
                    </h2>
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          services: [
                            ...content.services,
                            {
                              id: `service-${Date.now()}`,
                              number: `0${content.services.length + 1}`,
                              badge: `0${content.services.length + 1} / SERVICE`,
                              title: "NEW POST-PRODUCTION SERVICE",
                              description: "Describe deliverables and pacing.",
                              deliverables: ["4K Delivery", "Color Pass"],
                              turnaround: "Turnaround: 48h",
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {content.services.map((svc, idx) => (
                      <div
                        key={svc.id}
                        className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={svc.title}
                            onChange={(e) => {
                              const next = [...content.services];
                              next[idx] = { ...svc, title: e.target.value };
                              setContent({ ...content, services: next });
                            }}
                            placeholder="Service Title"
                            className="md:col-span-2 rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white"
                          />
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={svc.turnaround}
                              onChange={(e) => {
                                const next = [...content.services];
                                next[idx] = {
                                  ...svc,
                                  turnaround: e.target.value,
                                };
                                setContent({ ...content, services: next });
                              }}
                              placeholder="Turnaround: 48h"
                              className="flex-1 rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setContent({
                                  ...content,
                                  services: content.services.filter(
                                    (s) => s.id !== svc.id
                                  ),
                                })
                              }
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={svc.description}
                          onChange={(e) => {
                            const next = [...content.services];
                            next[idx] = { ...svc, description: e.target.value };
                            setContent({ ...content, services: next });
                          }}
                          className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-xs text-zinc-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Track Record Experience Rows */}
                <div className="rounded-3xl bg-[#101014] border border-white/10 p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">
                      Experience Track Record
                    </h2>
                    <button
                      type="button"
                      onClick={() =>
                        setContent({
                          ...content,
                          process: {
                            ...content.process,
                            experiences: [
                              {
                                company: "New Studio / Agency",
                                role: "Senior Video Editor",
                                period: "2025 — Present",
                              },
                              ...content.process.experiences,
                            ],
                          },
                        })
                      }
                      className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Role</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {content.process.experiences.map((exp, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-2xl bg-black/40 border border-white/10 p-3.5 items-center"
                      >
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const next = [...content.process.experiences];
                            next[idx] = { ...exp, company: e.target.value };
                            setContent({
                              ...content,
                              process: { ...content.process, experiences: next },
                            });
                          }}
                          placeholder="Company"
                          className="md:col-span-4 rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white"
                        />
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const next = [...content.process.experiences];
                            next[idx] = { ...exp, role: e.target.value };
                            setContent({
                              ...content,
                              process: { ...content.process, experiences: next },
                            });
                          }}
                          placeholder="Role"
                          className="md:col-span-5 rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white"
                        />
                        <div className="md:col-span-3 flex gap-2">
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              const next = [...content.process.experiences];
                              next[idx] = { ...exp, period: e.target.value };
                              setContent({
                                ...content,
                                process: {
                                  ...content.process,
                                  experiences: next,
                                },
                              });
                            }}
                            placeholder="Jan 2023 — Present"
                            className="flex-1 rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-xs font-mono text-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setContent({
                                ...content,
                                process: {
                                  ...content.process,
                                  experiences:
                                    content.process.experiences.filter(
                                      (_, i) => i !== idx
                                    ),
                                },
                              })
                            }
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "testimonials" && (
              <div className="rounded-3xl bg-[#101014] border border-white/10 p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    Client Testimonials
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        testimonials: [
                          ...content.testimonials,
                          {
                            id: `t-${Date.now()}`,
                            author: "Client Name",
                            role: "Creative Director",
                            company: "Studio",
                            rating: 5,
                            quote: "Exceptional turnaround and retention impact.",
                          },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {content.testimonials.map((t, idx) => (
                    <div
                      key={t.id}
                      className="rounded-2xl bg-black/40 border border-white/10 p-4 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={t.author}
                          onChange={(e) => {
                            const next = [...content.testimonials];
                            next[idx] = { ...t, author: e.target.value };
                            setContent({ ...content, testimonials: next });
                          }}
                          placeholder="Author"
                          className="rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white"
                        />
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) => {
                            const next = [...content.testimonials];
                            next[idx] = { ...t, role: e.target.value };
                            setContent({ ...content, testimonials: next });
                          }}
                          placeholder="Role"
                          className="rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={t.company}
                            onChange={(e) => {
                              const next = [...content.testimonials];
                              next[idx] = { ...t, company: e.target.value };
                              setContent({ ...content, testimonials: next });
                            }}
                            placeholder="Company"
                            className="flex-1 rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-sm text-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setContent({
                                ...content,
                                testimonials: content.testimonials.filter(
                                  (item) => item.id !== t.id
                                ),
                              })
                            }
                            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={t.quote}
                        onChange={(e) => {
                          const next = [...content.testimonials];
                          next[idx] = { ...t, quote: e.target.value };
                          setContent({ ...content, testimonials: next });
                        }}
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3 py-2 text-xs text-zinc-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="rounded-3xl bg-[#101014] border border-white/10 p-6 space-y-4">
                  <h2 className="text-lg font-bold text-white">
                    Global Contact &amp; Availability
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Header Availability Pill
                      </label>
                      <input
                        type="text"
                        value={content.siteSettings.availabilityStatus}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            siteSettings: {
                              ...content.siteSettings,
                              availabilityStatus: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Contact Card Availability Subtext
                      </label>
                      <input
                        type="text"
                        value={content.siteSettings.availabilitySubtext}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            siteSettings: {
                              ...content.siteSettings,
                              availabilitySubtext: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Public Studio Email
                      </label>
                      <input
                        type="email"
                        value={content.siteSettings.email}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            siteSettings: {
                              ...content.siteSettings,
                              email: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Calendar / Booking URL
                      </label>
                      <input
                        type="url"
                        value={content.siteSettings.calendarLink}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            siteSettings: {
                              ...content.siteSettings,
                              calendarLink: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        YouTube URL
                      </label>
                      <input
                        type="url"
                        value={content.siteSettings.socials.youtube || ""}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            siteSettings: {
                              ...content.siteSettings,
                              socials: {
                                ...content.siteSettings.socials,
                                youtube: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                        Instagram URL
                      </label>
                      <input
                        type="url"
                        value={content.siteSettings.socials.instagram || ""}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            siteSettings: {
                              ...content.siteSettings,
                              socials: {
                                ...content.siteSettings.socials,
                                instagram: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                      />
                    </div>
                  </div>
                </div>

                <form
                  onSubmit={handleChangePassword}
                  className="rounded-3xl bg-[#101014] border border-white/10 p-6 space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-accentGreen" />
                    <h2 className="text-lg font-bold text-white">
                      Supabase Auth Security
                    </h2>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Update the administrator login password for{" "}
                    <span className="font-mono text-zinc-200">{email}</span>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input
                      type="password"
                      minLength={6}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      className="flex-1 rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white"
                    />
                    <button
                      type="submit"
                      className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-200"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
