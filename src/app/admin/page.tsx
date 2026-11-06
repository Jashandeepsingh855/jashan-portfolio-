"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Film,
  Layers,
  User,
  Settings,
  Mail,
  Plus,
  Trash2,
  Save,
  LogOut,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Star,
  Eye,
  Edit2,
  KeyRound,
  FileVideo,
  ListOrdered
} from "lucide-react";
import { SiteContent, Project, Service, Testimonial, Inquiry, ProcessStep, AboutStat, SoftwareSkill } from "@/lib/data";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Content state
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<
    "projects" | "hero" | "services" | "about" | "process" | "testimonials" | "inquiries" | "settings" | "upload"
  >("projects");

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Upload state
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  // Project editing modal / inline state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);

  // Check auth and load content on mount
  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    try {
      const authRes = await fetch("/api/auth");
      const authData = await authRes.json();
      setIsAuthenticated(authData.authenticated);

      if (authData.authenticated) {
        loadContent();
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
    }
  };

  const loadContent = async () => {
    try {
      const res = await fetch("/api/content");
      const data = await res.json();
      setContent(data);
    } catch (err) {
      console.error("Failed to load content:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setIsAuthenticated(true);
      loadContent();
    } catch (err: any) {
      setLoginError(err.message || "Invalid password");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setIsAuthenticated(false);
    setContent(null);
  };

  const handleSaveAll = async () => {
    if (!content) return;
    setSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save content");
      }

      setSaveStatus({ type: "success", message: "All modifications saved live to the portfolio!" });
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err: any) {
      setSaveStatus({ type: "error", message: err.message || "Failed to save" });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm("Are you sure you want to reset all portfolio content to the original Stitch design template? Any unsaved edits will be lost.")) {
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("/api/content/reset", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setContent(data.data);
        alert("Restored to default Stitch design template!");
      } else {
        alert("Reset failed: " + data.error);
      }
    } catch (err) {
      alert("Error resetting data");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>, targetField?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadedUrl(data.url);
        // If uploading for a specific field
        if (targetField && content) {
          if (targetField === "showreelCoverImage") {
            setContent({
              ...content,
              hero: { ...content.hero, showreelCoverImage: data.url },
            });
          } else if (targetField === "portraitImage") {
            setContent({
              ...content,
              about: { ...content.about, portraitImage: data.url },
            });
          }
        }
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("File upload error");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordStatus("Password changed successfully!");
        setNewPassword("");
        setTimeout(() => setPasswordStatus(null), 4000);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to update password");
    }
  };

  // Render Login Screen if not authenticated
  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center p-6 text-white font-sans selection:bg-accent selection:text-white">
        <div className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-mono font-bold shadow-lg shadow-accent/30">
              JS
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold uppercase text-white tracking-wider text-sm">
                PORTFOLIO CMS
              </span>
              <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">
                DIRECTOR &amp; EDIT PORTAL
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                Admin Access Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter studio password..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-accent font-mono text-sm"
                />
              </div>
              <p className="text-[11px] font-mono text-white/40 mt-2">
                Default password: <span className="text-accent font-semibold">admin123</span> (Changeable anytime in Settings)
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-accent hover:bg-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-accent/25 disabled:opacity-50"
            >
              {loginLoading ? "VERIFYING..." : "ENTER ADMIN SUITE"}
            </button>

            <div className="pt-4 border-t border-white/10 text-center">
              <Link
                href="/"
                className="font-mono text-xs text-white/50 hover:text-white transition-colors"
              >
                ← Back to Public Portfolio
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Loading state
  if (isAuthenticated === null || !content) {
    return (
      <div className="min-h-screen bg-surface-dark flex items-center justify-center p-6 text-white font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-accent animate-ping" />
          <span>LOADING PORTFOLIO CMS...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white font-sans flex flex-col selection:bg-accent selection:text-white">
      {/* Top Admin HUD Bar */}
      <header className="h-16 bg-[#0E1420] border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-accent text-white flex items-center justify-center font-mono font-bold text-xs shadow-md">
            JS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold uppercase text-xs tracking-wider text-white">
                STUDIO CMS // ADMIN PORTAL
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <span className="font-mono text-[10px] text-white/50 uppercase">
              PORTFOLIO: {content.siteSettings.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-colors border border-white/10"
          >
            <span>View Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-accent" />
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-md shadow-accent/25 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "SAVING..." : "SAVE CHANGES"}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/60 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Save status notification bar */}
      {saveStatus && (
        <div
          className={`px-6 py-2.5 font-mono text-xs flex items-center justify-center gap-2 transition-all ${
            saveStatus.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30"
              : "bg-red-500/20 text-red-300 border-b border-red-500/30"
          }`}
        >
          {saveStatus.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0A0D14] border-r border-white/10 p-4 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto">
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-widest px-3 py-2 hidden md:block">
            MANAGEMENT SECTIONS
          </div>

          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-colors whitespace-nowrap ${
              activeTab === "projects"
                ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>My Work ({content.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-colors whitespace-nowrap ${
              activeTab === "hero"
                ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FileVideo className="w-4 h-4" />
            <span>Hero &amp; Showreel</span>
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-colors whitespace-nowrap ${
              activeTab === "services"
                ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services ({content.services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-colors whitespace-nowrap ${
              activeTab === "about"
                ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>About &amp; Skills</span>
          </button>

          <button
            onClick={() => setActiveTab("process")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-colors whitespace-nowrap ${
              activeTab === "process"
                ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>5-Step Workflow</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-colors whitespace-nowrap ${
              activeTab === "testimonials"
                ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({content.testimonials.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-colors whitespace-nowrap ${
              activeTab === "inquiries"
                ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            {content.inquiries?.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                {content.inquiries.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-colors whitespace-nowrap ${
              activeTab === "upload"
                ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Media Uploads</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-colors whitespace-nowrap ${
              activeTab === "settings"
                ? "bg-accent text-white font-bold shadow-md shadow-accent/20"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site &amp; Security</span>
          </button>
        </aside>

        {/* Tab Content Area */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl">
          {/* TAB 1: PROJECTS (MY WORK) */}
          {activeTab === "projects" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                    <Film className="w-6 h-6 text-accent" />
                    <span>My Work &amp; Project Cuts</span>
                  </h2>
                  <p className="text-white/60 font-mono text-xs mt-1">
                    Manage portfolio projects, video URLs, thumbnail frames, and categories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProject({
                      id: "project-" + Date.now(),
                      title: "New Cinematic Project",
                      category: content.categories[1] || "Commercial Films",
                      client: "CLIENT NAME",
                      year: "2025",
                      duration: "01:30",
                      format: "4K DCI",
                      description: "Brief description of the edit and pacing...",
                      thumbnail: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrZEfgtAlqxuPZBsvlfbqKOC9ZV3u6yEskXR8V-AD_45r4byaXpoOrME2qDBw-wYBh8m7fkiqssKkyktGp033HKeRTI5Vr_Zs7qwdawseTF9ci1XFRM-1LuQuYEJJ-VVsdN3lsN2ytJ0P3tvOj1sdcaxhojQRkEJfUjL--tatSIwHHCULI7Nl77Wq7w8UNUDze7RnwR54mswiLV1i4xQZmfX21I7yNGoE1ftHtiUA",
                      videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
                      featured: false,
                      caseStudyUrl: "#contact",
                      tags: ["Commercial", "4K"],
                      order: content.projects.length + 1,
                    });
                    setIsNewProject(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-md self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>

              {/* Category Pills Editor */}
              <div className="bg-[#0E1420] p-6 rounded-2xl border border-white/10">
                <label className="block font-mono text-xs uppercase text-white/70 mb-2 font-bold">
                  Portfolio Filter Categories (Comma Separated)
                </label>
                <input
                  type="text"
                  value={content.categories.join(", ")}
                  onChange={(e) => {
                    const cats = e.target.value.split(",").map((c) => c.trim()).filter(Boolean);
                    setContent({ ...content, categories: cats });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                />
              </div>

              {/* Projects List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.projects.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="bg-[#0E1420] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all group"
                  >
                    <div>
                      {/* Thumbnail frame & tags */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proj.thumbnail}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] uppercase text-white">
                          {proj.duration || "01:00"}
                        </div>
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-accent font-mono text-[10px] uppercase text-white font-bold">
                          {proj.category}
                        </div>
                        {proj.featured && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-white text-black font-mono text-[10px] uppercase font-bold">
                            ★ 8-Col Featured
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-white/50 font-mono text-xs mb-1">
                        <span>{proj.client || "NO CLIENT"}</span>
                        <span>{proj.year}</span>
                      </div>

                      <h3 className="text-xl font-bold uppercase text-white tracking-tight mb-2">
                        {proj.title}
                      </h3>

                      <p className="text-white/60 text-xs line-clamp-2 leading-relaxed mb-4">
                        {proj.description}
                      </p>

                      <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 font-mono text-[11px] text-accent truncate mb-4">
                        Video: {proj.videoUrl || "No URL specified"}
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProject({ ...proj });
                            setIsNewProject(false);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Delete project "${proj.title}"?`)) {
                            const updated = content.projects.filter((p) => p.id !== proj.id);
                            setContent({ ...content, projects: updated });
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Project Edit / Create Modal */}
              {editingProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-[#0E1420] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
                    <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                      <h3 className="text-xl font-bold uppercase text-white font-sans flex items-center gap-2">
                        <Film className="w-5 h-5 text-accent" />
                        <span>{isNewProject ? "Add New Project" : "Edit Project"}</span>
                      </h3>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="text-white/50 hover:text-white font-mono text-xs"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                            Project Title *
                          </label>
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, title: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                            Category *
                          </label>
                          <select
                            value={editingProject.category}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, category: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-surface-dark border border-white/10 text-white font-sans text-sm focus:outline-none focus:border-accent"
                          >
                            {content.categories.map((c, i) => (
                              <option key={i} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                            Client Name
                          </label>
                          <input
                            type="text"
                            value={editingProject.client}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, client: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                            Year
                          </label>
                          <input
                            type="text"
                            value={editingProject.year}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, year: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                            Duration (e.g. 01:15)
                          </label>
                          <input
                            type="text"
                            value={editingProject.duration}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, duration: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                            Format (e.g. 4K 2.39:1, ProRes 422)
                          </label>
                          <input
                            type="text"
                            value={editingProject.format}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, format: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                            Layout Presentation
                          </label>
                          <div className="flex items-center gap-3 pt-2">
                            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-mono">
                              <input
                                type="checkbox"
                                checked={editingProject.featured}
                                onChange={(e) =>
                                  setEditingProject({ ...editingProject, featured: e.target.checked })
                                }
                                className="rounded text-accent focus:ring-accent"
                              />
                              <span>Large 8-Column Featured Card</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                          Video URL (YouTube, Vimeo, or Direct MP4) *
                        </label>
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={editingProject.videoUrl}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, videoUrl: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                          Thumbnail Image URL *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editingProject.thumbnail}
                            onChange={(e) =>
                              setEditingProject({ ...editingProject, thumbnail: e.target.value })
                            }
                            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                          Editorial Description
                        </label>
                        <textarea
                          rows={3}
                          value={editingProject.description}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, description: e.target.value })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={editingProject.tags?.join(", ") || ""}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (isNewProject) {
                              setContent({
                                ...content,
                                projects: [editingProject, ...content.projects],
                              });
                            } else {
                              const updated = content.projects.map((p) =>
                                p.id === editingProject.id ? editingProject : p
                              );
                              setContent({ ...content, projects: updated });
                            }
                            setEditingProject(null);
                          }}
                          className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white font-mono text-xs uppercase font-bold"
                        >
                          Save Project
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HERO & SHOWREEL */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-white/10">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <FileVideo className="w-6 h-6 text-accent" />
                  <span>Hero Section &amp; Master Showreel</span>
                </h2>
                <p className="text-white/60 font-mono text-xs mt-1">
                  Customize studio punchlines, showreel video player, live status indicators, and hardware pipeline tags.
                </p>
              </div>

              <div className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-mono text-xs uppercase text-accent font-bold tracking-wider">
                  Live Status HUD &amp; Badges
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Availability Status
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
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Director Focus / Specialties
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings.specialties}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteSettings: {
                            ...content.siteSettings,
                            specialties: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Primary NLE Suite
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings.suite}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteSettings: {
                            ...content.siteSettings,
                            suite: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Master Timeline FPS
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings.timelineFps}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteSettings: {
                            ...content.siteSettings,
                            timelineFps: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-mono text-xs uppercase text-accent font-bold tracking-wider">
                  Headline &amp; Studio Statement
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Line 1
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlineLine1}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, headlineLine1: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold font-sans text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Highlight Word (Accent Color)
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlineHighlight}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, headlineHighlight: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-accent font-bold font-sans text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Line 3
                    </label>
                    <input
                      type="text"
                      value={content.hero.headlineLine3}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, headlineLine3: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold font-sans text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                    Studio Subtitle / Description
                  </label>
                  <textarea
                    rows={3}
                    value={content.hero.description}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, description: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                    Hardware Pipeline Pills (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={content.hero.hardwarePipeline?.join(", ") || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: {
                          ...content.hero,
                          hardwarePipeline: e.target.value
                            .split(",")
                            .map((p) => p.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-mono text-xs uppercase text-accent font-bold tracking-wider">
                  Master Showreel Reel Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Showreel Video URL (YouTube, Vimeo, or Direct MP4) *
                    </label>
                    <input
                      type="text"
                      value={content.hero.showreelVideoUrl}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, showreelVideoUrl: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Showreel Cover Image URL *
                    </label>
                    <input
                      type="text"
                      value={content.hero.showreelCoverImage}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, showreelCoverImage: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Showreel Title
                    </label>
                    <input
                      type="text"
                      value={content.hero.showreelTitle}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, showreelTitle: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Format HUD (e.g. 4K DCI // PRORES 4444 XQ)
                    </label>
                    <input
                      type="text"
                      value={content.hero.showreelFormat}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, showreelFormat: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Colorspace Badge (e.g. ACEScc)
                    </label>
                    <input
                      type="text"
                      value={content.hero.showreelColorspace}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, showreelColorspace: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                    <Layers className="w-6 h-6 text-accent" />
                    <span>Capabilities &amp; Services</span>
                  </h2>
                  <p className="text-white/60 font-mono text-xs mt-1">
                    Add, edit, or remove editing services, deliverables, and capability tags.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newService: Service = {
                      id: "service-" + Date.now(),
                      number: `0${content.services.length + 1}`,
                      title: "New Video Service",
                      description: "Service description...",
                      deliverables: ["Deliverable 1", "Deliverable 2"],
                      badge: "STUDIO SPECIALTY",
                    };
                    setContent({ ...content, services: [...content.services, newService] });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white font-mono text-xs uppercase font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.services.map((service, idx) => (
                  <div
                    key={service.id || idx}
                    className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-accent font-bold text-sm">
                          {service.number}
                        </span>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => {
                            const updated = [...content.services];
                            updated[idx].title = e.target.value;
                            setContent({ ...content, services: updated });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-base focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={service.badge}
                          onChange={(e) => {
                            const updated = [...content.services];
                            updated[idx].badge = e.target.value;
                            setContent({ ...content, services: updated });
                          }}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 font-mono text-xs focus:outline-none focus:border-accent"
                        />
                        <button
                          onClick={() => {
                            if (confirm(`Delete service "${service.title}"?`)) {
                              const updated = content.services.filter((_, i) => i !== idx);
                              setContent({ ...content, services: updated });
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs uppercase text-white/50 mb-1">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        value={service.description}
                        onChange={(e) => {
                          const updated = [...content.services];
                          updated[idx].description = e.target.value;
                          setContent({ ...content, services: updated });
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs uppercase text-white/50 mb-1">
                        Deliverables (comma separated)
                      </label>
                      <input
                        type="text"
                        value={service.deliverables?.join(", ") || ""}
                        onChange={(e) => {
                          const updated = [...content.services];
                          updated[idx].deliverables = e.target.value
                            .split(",")
                            .map((d) => d.trim())
                            .filter(Boolean);
                          setContent({ ...content, services: updated });
                        }}
                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ABOUT & SKILLS */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-white/10">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-accent" />
                  <span>About Me, Stats &amp; Software Tools</span>
                </h2>
                <p className="text-white/60 font-mono text-xs mt-1">
                  Update biography, portrait photo, experience counters, and software proficiencies.
                </p>
              </div>

              <div className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-mono text-xs uppercase text-accent font-bold tracking-wider">
                  Portrait &amp; Headings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Portrait Image URL (or /portrait.png)
                    </label>
                    <input
                      type="text"
                      value={content.about.portraitImage}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, portraitImage: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      About Badge Tag
                    </label>
                    <input
                      type="text"
                      value={content.about.badge}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          about: { ...content.about, badge: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                    About Main Heading
                  </label>
                  <input
                    type="text"
                    value={content.about.heading}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: { ...content.about, heading: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                    Bio Paragraphs (One per line)
                  </label>
                  <textarea
                    rows={5}
                    value={content.about.bio?.join("\n\n") || ""}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        about: {
                          ...content.about,
                          bio: e.target.value
                            .split("\n\n")
                            .map((p) => p.trim())
                            .filter(Boolean),
                        },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm leading-relaxed focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Stats Counters */}
              <div className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-mono text-xs uppercase text-accent font-bold tracking-wider">
                  Experience &amp; Performance Metric Counters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.about.stats?.map((stat, idx) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const updated = [...content.about.stats];
                            updated[idx].value = e.target.value;
                            setContent({
                              ...content,
                              about: { ...content.about, stats: updated },
                            });
                          }}
                          className="w-24 px-3 py-1.5 rounded-lg bg-surface-dark border border-white/10 text-accent font-bold text-xl focus:outline-none focus:border-accent"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = [...content.about.stats];
                            updated[idx].label = e.target.value;
                            setContent({
                              ...content,
                              about: { ...content.about, stats: updated },
                            });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-surface-dark border border-white/10 text-white font-mono text-xs uppercase font-bold focus:outline-none focus:border-accent"
                        />
                      </div>
                      <input
                        type="text"
                        value={stat.detail}
                        onChange={(e) => {
                          const updated = [...content.about.stats];
                          updated[idx].detail = e.target.value;
                          setContent({
                            ...content,
                            about: { ...content.about, stats: updated },
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-dark border border-white/10 text-white/60 font-sans text-xs focus:outline-none focus:border-accent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROCESS */}
          {activeTab === "process" && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-white/10">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <ListOrdered className="w-6 h-6 text-accent" />
                  <span>5-Stage Post Workflow</span>
                </h2>
                <p className="text-white/60 font-mono text-xs mt-1">
                  Adjust the production stages, descriptions, and estimated turnarounds.
                </p>
              </div>

              <div className="space-y-4">
                {content.process.steps?.map((step, idx) => (
                  <div key={idx} className="bg-[#0E1420] p-5 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={step.stage}
                        onChange={(e) => {
                          const updated = [...content.process.steps];
                          updated[idx].stage = e.target.value;
                          setContent({
                            ...content,
                            process: { ...content.process, steps: updated },
                          });
                        }}
                        className="px-3 py-1 rounded bg-white/5 border border-white/10 text-accent font-mono text-xs uppercase font-bold focus:outline-none focus:border-accent"
                      />
                      <input
                        type="text"
                        value={step.duration}
                        onChange={(e) => {
                          const updated = [...content.process.steps];
                          updated[idx].duration = e.target.value;
                          setContent({
                            ...content,
                            process: { ...content.process, steps: updated },
                          });
                        }}
                        className="px-3 py-1 rounded bg-white/5 border border-white/10 text-white/50 font-mono text-xs uppercase focus:outline-none focus:border-accent"
                      />
                    </div>

                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updated = [...content.process.steps];
                        updated[idx].title = e.target.value;
                        setContent({
                          ...content,
                          process: { ...content.process, steps: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white font-bold text-sm uppercase focus:outline-none focus:border-accent"
                    />

                    <textarea
                      rows={2}
                      value={step.description}
                      onChange={(e) => {
                        const updated = [...content.process.steps];
                        updated[idx].description = e.target.value;
                        setContent({
                          ...content,
                          process: { ...content.process, steps: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 rounded bg-white/5 border border-white/10 text-white/70 text-xs font-sans focus:outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                    <Star className="w-6 h-6 text-accent" />
                    <span>Client Testimonials &amp; Endorsements</span>
                  </h2>
                  <p className="text-white/60 font-mono text-xs mt-1">
                    Manage direct reviews from creative directors, producers, and creator clients.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const newTest: Testimonial = {
                      id: "test-" + Date.now(),
                      author: "Client Name",
                      role: "Creative Director",
                      company: "Studio Name",
                      rating: 5,
                      quote: "Working with Jashandeep was an incredible experience...",
                    };
                    setContent({ ...content, testimonials: [...content.testimonials, newTest] });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent hover:bg-accent/90 text-white font-mono text-xs uppercase font-bold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>

              <div className="space-y-4">
                {content.testimonials.map((t, idx) => (
                  <div key={t.id || idx} className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={t.author}
                          onChange={(e) => {
                            const updated = [...content.testimonials];
                            updated[idx].author = e.target.value;
                            setContent({ ...content, testimonials: updated });
                          }}
                          placeholder="Author Name"
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-accent"
                        />
                        <input
                          type="text"
                          value={t.role}
                          onChange={(e) => {
                            const updated = [...content.testimonials];
                            updated[idx].role = e.target.value;
                            setContent({ ...content, testimonials: updated });
                          }}
                          placeholder="Role"
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 font-mono text-xs focus:outline-none focus:border-accent"
                        />
                        <input
                          type="text"
                          value={t.company}
                          onChange={(e) => {
                            const updated = [...content.testimonials];
                            updated[idx].company = e.target.value;
                            setContent({ ...content, testimonials: updated });
                          }}
                          placeholder="Company"
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 font-mono text-xs focus:outline-none focus:border-accent"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const updated = content.testimonials.filter((_, i) => i !== idx);
                          setContent({ ...content, testimonials: updated });
                        }}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={t.quote}
                      onChange={(e) => {
                        const updated = [...content.testimonials];
                        updated[idx].quote = e.target.value;
                        setContent({ ...content, testimonials: updated });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-sans focus:outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: INQUIRIES INBOX */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                    <Mail className="w-6 h-6 text-accent" />
                    <span>Client Inquiries Inbox</span>
                  </h2>
                  <p className="text-white/60 font-mono text-xs mt-1">
                    Messages submitted directly from the portfolio commission form.
                  </p>
                </div>
                {content.inquiries?.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Clear all received inquiries?")) {
                        setContent({ ...content, inquiries: [] });
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {(!content.inquiries || content.inquiries.length === 0) ? (
                <div className="p-12 text-center bg-[#0E1420] rounded-2xl border border-white/10 font-mono text-sm text-white/50">
                  No inquiries received yet. When clients submit the contact form, their briefs appear here immediately.
                </div>
              ) : (
                <div className="space-y-4">
                  {content.inquiries.map((inq, idx) => (
                    <div
                      key={inq.id || idx}
                      className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">{inq.name}</span>
                            <span className="px-2 py-0.5 rounded bg-accent/20 text-accent font-mono text-[10px] uppercase font-bold">
                              {inq.projectType}
                            </span>
                          </div>
                          <a
                            href={`mailto:${inq.email}`}
                            className="font-mono text-xs text-accent hover:underline"
                          >
                            {inq.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-white/40">
                            {new Date(inq.date).toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              const updated = content.inquiries.filter((_, i) => i !== idx);
                              setContent({ ...content, inquiries: updated });
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 font-mono text-xs text-white/70">
                        <div>
                          <span className="text-white/40 block text-[10px] uppercase">Budget:</span>
                          <span className="text-white font-semibold">{inq.budget || "Not specified"}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block text-[10px] uppercase">Timeline:</span>
                          <span className="text-white font-semibold">{inq.timeline || "Not specified"}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <span className="font-mono text-[10px] text-white/40 uppercase block mb-1">
                          Message Brief:
                        </span>
                        <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line font-sans">
                          {inq.message}
                        </p>
                      </div>

                      <div className="pt-2">
                        <a
                          href={`mailto:${inq.email}?subject=Re: Your Editorial Project Brief - Jashandeep Singh`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white font-mono text-xs uppercase font-bold hover:bg-accent/90 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply to Client</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: MEDIA UPLOADER */}
          {activeTab === "upload" && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-white/10">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <Upload className="w-6 h-6 text-accent" />
                  <span>Media &amp; Asset Uploads</span>
                </h2>
                <p className="text-white/60 font-mono text-xs mt-1">
                  Upload project thumbnails, stills, or video clips directly to your server.
                </p>
              </div>

              <div className="bg-[#0E1420] p-8 rounded-2xl border border-white/10 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-accent">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase font-sans">
                  Choose a file to upload
                </h3>
                <p className="text-white/60 text-xs font-mono max-w-md mx-auto">
                  Files are saved to your public uploads folder and given a permanent direct URL.
                </p>

                <div className="pt-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-md">
                    <span>{uploadLoading ? "UPLOADING..." : "SELECT FILE"}</span>
                    <input
                      type="file"
                      disabled={uploadLoading}
                      onChange={(e) => handleUploadFile(e)}
                      className="hidden"
                    />
                  </label>
                </div>

                {uploadedUrl && (
                  <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-left font-mono text-xs space-y-2">
                    <span className="text-emerald-400 font-bold block">
                      ✓ Upload Successful! Copy this URL into any project:
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={uploadedUrl}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="w-full px-3 py-2 rounded bg-black/60 text-emerald-300 border border-emerald-500/20 font-mono text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 9: SETTINGS & SECURITY */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="pb-6 border-b border-white/10">
                <h2 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-accent" />
                  <span>Site Settings &amp; Security</span>
                </h2>
                <p className="text-white/60 font-mono text-xs mt-1">
                  Branding credentials, direct contact channels, social profiles, and admin password.
                </p>
              </div>

              {/* Branding and Contact Channels */}
              <div className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-mono text-xs uppercase text-accent font-bold tracking-wider">
                  Branding &amp; Direct Contact Channels
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings.name}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteSettings: { ...content.siteSettings, name: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings.role}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteSettings: { ...content.siteSettings, role: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Direct Email
                    </label>
                    <input
                      type="email"
                      value={content.siteSettings.email}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteSettings: { ...content.siteSettings, email: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Direct Phone
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings.phone}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteSettings: { ...content.siteSettings, phone: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      Location / Timezone
                    </label>
                    <input
                      type="text"
                      value={content.siteSettings.location}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          siteSettings: { ...content.siteSettings, location: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-sans text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                    Discovery Calendar Booking Link (Cal.com or Calendly)
                  </label>
                  <input
                    type="text"
                    value={content.siteSettings.calendarLink}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        siteSettings: { ...content.siteSettings, calendarLink: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Social Channels */}
              <div className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-mono text-xs uppercase text-accent font-bold tracking-wider">
                  Social &amp; Platform Links
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["instagram", "youtube", "vimeo", "linkedin", "x", "behance"].map((soc) => (
                    <div key={soc}>
                      <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                        {soc} URL
                      </label>
                      <input
                        type="text"
                        value={(content.siteSettings.socials as any)?.[soc] || ""}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            siteSettings: {
                              ...content.siteSettings,
                              socials: {
                                ...content.siteSettings.socials,
                                [soc]: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Password change */}
              <div className="bg-[#0E1420] p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="font-mono text-xs uppercase text-accent font-bold tracking-wider flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>Update Admin Portal Password</span>
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label className="block font-mono text-xs uppercase text-white/70 mb-1">
                      New Password (Minimum 4 characters)
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter new password..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-accent"
                    />
                  </div>

                  {passwordStatus && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{passwordStatus}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-white font-mono text-xs uppercase font-bold"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Restore Defaults */}
              <div className="bg-[#0E1420] p-6 rounded-2xl border border-red-500/20 space-y-3">
                <h3 className="font-mono text-xs uppercase text-red-400 font-bold tracking-wider flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Default Stitch Design</span>
                </h3>
                <p className="text-white/60 text-xs font-mono">
                  Revert all copy, projects, and styling back to the original Stitch blueprint.
                </p>
                <button
                  onClick={handleResetDefaults}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 font-mono text-xs uppercase font-bold transition-colors"
                >
                  Reset All Content to Default
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
