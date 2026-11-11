"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Edit3,
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { AspectRatioType, Project } from "@/lib/data";

interface ProjectsPanelProps {
  projects: Project[];
  categories: string[];
  onProjectsChange: (projects: Project[]) => void;
  onNotify: (type: "success" | "error", text: string) => void;
}

const EMPTY_PROJECT: Omit<Project, "id" | "order"> = {
  title: "",
  category: "Commercial",
  client: "",
  year: new Date().getFullYear().toString(),
  duration: "01:30",
  format: "4K HDR",
  aspectRatio: "16:9",
  description: "",
  thumbnail: "/covers/commercial-pulse.jpg",
  videoUrl: "",
  featured: true,
  tags: ["Fast Pacing", "ACES Color"],
  views: "",
};

export default function ProjectsPanel({
  projects,
  categories,
  onProjectsChange,
  onNotify,
}: ProjectsPanelProps) {
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Omit<Project, "id" | "order">>(
    EMPTY_PROJECT
  );
  const [tagsText, setTagsText] = useState("Fast Pacing, ACES Color");
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<
    "thumbnail" | "videoUrl" | null
  >(null);

  const selectableCategories = Array.from(
    new Set([
      "Short-Form",
      "Long-Form",
      "Commercial",
      ...categories.filter((c) => c !== "All"),
    ])
  );

  const openNew = () => {
    setEditingId("new");
    setDraft({ ...EMPTY_PROJECT });
    setTagsText(EMPTY_PROJECT.tags.join(", "));
  };

  const openEdit = (proj: Project) => {
    setEditingId(proj.id);
    setDraft({
      title: proj.title,
      category: proj.category,
      client: proj.client,
      year: proj.year,
      duration: proj.duration,
      format: proj.format,
      aspectRatio: proj.aspectRatio,
      description: proj.description,
      thumbnail: proj.thumbnail,
      videoUrl: proj.videoUrl,
      featured: proj.featured,
      tags: proj.tags,
      views: proj.views,
    });
    setTagsText(proj.tags.join(", "));
  };

  const handleUpload = async (
    file: File,
    field: "thumbnail" | "videoUrl"
  ) => {
    setUploadingField(field);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", field === "thumbnail" ? "thumbnails" : "videos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setDraft((prev) => ({ ...prev, [field]: data.url }));
      onNotify("success", `Uploaded ${file.name} to Supabase Storage.`);
    } catch (err) {
      onNotify(
        "error",
        err instanceof Error ? err.message : "Failed to upload asset."
      );
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim()) {
      onNotify("error", "Project title is required.");
      return;
    }

    setSaving(true);
    const parsedTags = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...draft,
      tags: parsedTags,
    };

    try {
      if (editingId === "new") {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add project");

        onProjectsChange([...projects, data.project]);
        onNotify("success", `Created "${data.project.title}".`);
      } else if (editingId) {
        const res = await fetch(`/api/projects/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update project");

        onProjectsChange(
          projects.map((p) => (p.id === editingId ? data.project : p))
        );
        onNotify("success", `Updated "${data.project.title}".`);
      }

      setEditingId(null);
    } catch (err) {
      onNotify(
        "error",
        err instanceof Error ? err.message : "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (proj: Project) => {
    if (!window.confirm(`Delete "${proj.title}" from the portfolio?`)) return;

    try {
      const res = await fetch(`/api/projects/${proj.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete project");

      onProjectsChange(projects.filter((p) => p.id !== proj.id));
      if (editingId === proj.id) setEditingId(null);
      onNotify("success", `Removed "${proj.title}".`);
    } catch (err) {
      onNotify(
        "error",
        err instanceof Error ? err.message : "Could not delete project."
      );
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;

    const sorted = [...projects];
    const [moved] = sorted.splice(index, 1);
    sorted.splice(target, 0, moved);

    const reordered = sorted.map((item, i) => ({ ...item, order: i + 1 }));
    onProjectsChange(reordered);

    try {
      await Promise.all([
        fetch(`/api/projects/${reordered[index].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: reordered[index].order }),
        }),
        fetch(`/api/projects/${reordered[target].id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: reordered[target].order }),
        }),
      ]);
      onNotify("success", "Updated project display order.");
    } catch {
      onNotify("error", "Order saved locally; click Save Settings to sync.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">
            Video Projects ({projects.length})
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Changes sync immediately to Supabase PostgreSQL and revalidate the
            live portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-200 transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Project</span>
        </button>
      </div>

      {/* Add / Edit Form Drawer */}
      {editingId && (
        <form
          onSubmit={handleSaveProject}
          className="rounded-3xl bg-[#121216] border border-white/15 p-5 sm:p-6 space-y-5 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-zinc-400" />
              <span>
                {editingId === "new" ? "New Video Project" : "Edit Project"}
              </span>
            </h3>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-300 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Title *
              </label>
              <input
                type="text"
                required
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Aura Pulse — Commercial Launch Film"
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Category
              </label>
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              >
                {selectableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Client
              </label>
              <input
                type="text"
                value={draft.client}
                onChange={(e) => setDraft({ ...draft, client: e.target.value })}
                placeholder="APEX ACTIVEWEAR"
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Aspect Ratio
              </label>
              <select
                value={draft.aspectRatio}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    aspectRatio: e.target.value as AspectRatioType,
                  })
                }
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              >
                <option value="16:9">16:9 Widescreen</option>
                <option value="9:16">9:16 Vertical Short-Form</option>
                <option value="16:10">16:10 Cinema Frame</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Format Badge
              </label>
              <input
                type="text"
                value={draft.format}
                onChange={(e) => setDraft({ ...draft, format: e.target.value })}
                placeholder="4K HDR"
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={draft.duration}
                onChange={(e) =>
                  setDraft({ ...draft, duration: e.target.value })
                }
                placeholder="01:45"
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Year
              </label>
              <input
                type="text"
                value={draft.year}
                onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                placeholder="2025"
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Views / Metric
              </label>
              <input
                type="text"
                value={draft.views}
                onChange={(e) => setDraft({ ...draft, views: e.target.value })}
                placeholder="4.2M Views · 68% Ret."
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Thumbnail Image URL (or Upload to Bucket)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draft.thumbnail}
                  onChange={(e) =>
                    setDraft({ ...draft, thumbnail: e.target.value })
                  }
                  placeholder="/covers/commercial-pulse.jpg"
                  className="flex-1 rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white shrink-0">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>
                    {uploadingField === "thumbnail" ? "Uploading..." : "Upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file, "thumbnail");
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Video URL (YouTube, Vimeo, or MP4 Upload)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draft.videoUrl}
                  onChange={(e) =>
                    setDraft({ ...draft, videoUrl: e.target.value })
                  }
                  placeholder="https://youtube.com/watch?v=... or MP4 URL"
                  className="flex-1 rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>
                    {uploadingField === "videoUrl" ? "Uploading..." : "MP4"}
                  </span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file, "videoUrl");
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Fast Pacing, Sound Design, ACES Color"
                className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) =>
                    setDraft({ ...draft, featured: e.target.checked })
                  }
                  className="rounded border-white/20 bg-black text-white focus:ring-0"
                />
                <span>Featured Highlight Production</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              placeholder="High-octane commercial cut blending dynamic speed ramps..."
              className="w-full rounded-xl bg-black/60 border border-white/15 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-5 py-2.5 rounded-full border border-white/15 text-xs font-semibold text-zinc-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-200 disabled:opacity-60"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Project"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Project Rows */}
      <div className="grid grid-cols-1 gap-3">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="rounded-2xl bg-[#101014] border border-white/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-24 h-14 rounded-xl object-cover bg-zinc-900 border border-white/10 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-zinc-200">
                    {project.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {project.aspectRatio} · {project.duration}
                  </span>
                  {project.views && (
                    <span className="text-[10px] font-mono text-accentGreen">
                      {project.views}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white truncate">
                  {project.title}
                </h4>
                <p className="text-xs text-zinc-400 truncate">
                  {project.client} · {project.year}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => handleMove(idx, -1)}
                title="Move Up"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 disabled:opacity-30"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={idx === projects.length - 1}
                onClick={() => handleMove(idx, 1)}
                title="Move Down"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 disabled:opacity-30"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => openEdit(project)}
                title="Edit"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white hover:text-black text-xs font-semibold text-white transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project)}
                title="Delete"
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
