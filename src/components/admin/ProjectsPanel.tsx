"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Check,
  Edit3,
  Film,
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { isOptimizableImageSrc } from "@/lib/utils";
import type {
  AspectRatioType,
  Project,
  WorkSectionContent,
} from "@/lib/data";
import {
  ADMIN_INPUT_CLS,
  AdminCard,
  AdminField,
} from "@/components/admin/AdminUiPrimitives";

interface ProjectsPanelProps {
  projects: Project[];
  categories: string[];
  workSection: WorkSectionContent;
  onProjectsChange: (projects: Project[]) => void;
  onWorkMetaChange: (
    nextWorkSection: WorkSectionContent,
    nextCategories: string[]
  ) => void;
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
  projectUrl: "",
  featured: true,
  tags: ["Fast Pacing", "ACES Color"],
  views: "",
};

export default function ProjectsPanel({
  projects,
  categories,
  workSection,
  onProjectsChange,
  onWorkMetaChange,
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
      projectUrl: proj.projectUrl || "",
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

    const previous = projects;
    const sorted = [...projects];
    const [moved] = sorted.splice(index, 1);
    sorted.splice(target, 0, moved);

    const reordered = sorted.map((item, i) => ({ ...item, order: i + 1 }));
    onProjectsChange(reordered);

    try {
      const responses = await Promise.all([
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

      const failed = responses.find((res) => !res.ok);
      if (failed) {
        const errData = await failed.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update project order.");
      }

      onNotify("success", "Updated project display order.");
    } catch (err) {
      onProjectsChange(previous);
      onNotify(
        "error",
        err instanceof Error
          ? err.message
          : "Could not update project display order."
      );
    }
  };

  return (
    <div className="space-y-6">
      <AdminCard
        eyebrow="WORK SECTION HEADERS"
        title="Selected Work Copy & Filters"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminField label="Section Eyebrow">
            <input
              type="text"
              value={workSection.eyebrow}
              onChange={(e) =>
                onWorkMetaChange(
                  { ...workSection, eyebrow: e.target.value },
                  categories
                )
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Section Heading">
            <input
              type="text"
              value={workSection.heading}
              onChange={(e) =>
                onWorkMetaChange(
                  { ...workSection, heading: e.target.value },
                  categories
                )
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Ghost Watermark">
            <input
              type="text"
              value={workSection.watermark}
              onChange={(e) =>
                onWorkMetaChange(
                  { ...workSection, watermark: e.target.value },
                  categories
                )
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="CTA Button Label">
            <input
              type="text"
              value={workSection.ctaLabel}
              onChange={(e) =>
                onWorkMetaChange(
                  { ...workSection, ctaLabel: e.target.value },
                  categories
                )
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
        </div>

        <AdminField label="Filter Tabs (comma-separated)">
          <input
            type="text"
            value={categories.join(", ")}
            onChange={(e) =>
              onWorkMetaChange(
                workSection,
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            className={ADMIN_INPUT_CLS}
          />
        </AdminField>
      </AdminCard>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-1">
            POSTGRES PORTFOLIO ITEMS
          </p>
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-neutral-950">
            Video Projects ({projects.length})
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Project CRUD writes directly to Supabase PostgreSQL and revalidates
            the public portfolio immediately.
          </p>
        </div>

        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Project</span>
        </button>
      </div>

      {/* Add / Edit Form Drawer */}
      {editingId && (
        <form
          onSubmit={handleSaveProject}
          className="rounded-3xl bg-[#FAFAFB] border border-neutral-200 p-5 sm:p-7 space-y-5 shadow-md"
        >
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2 uppercase tracking-tight">
              <Film className="w-4 h-4 text-neutral-500" />
              <span>
                {editingId === "new" ? "New Video Project" : "Edit Project"}
              </span>
            </h3>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="w-8 h-8 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AdminField label="Title *" className="sm:col-span-2">
              <input
                type="text"
                required
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="Aura Pulse — Commercial Launch Film"
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>

            <AdminField label="Category">
              <select
                value={draft.category}
                onChange={(e) =>
                  setDraft({ ...draft, category: e.target.value })
                }
                className={ADMIN_INPUT_CLS}
              >
                {selectableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </AdminField>

            <AdminField label="Client Name">
              <input
                type="text"
                value={draft.client}
                onChange={(e) => setDraft({ ...draft, client: e.target.value })}
                placeholder="APEX ACTIVEWEAR"
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>

            <AdminField label="Aspect Ratio (Metadata)">
              <select
                value={draft.aspectRatio}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    aspectRatio: e.target.value as AspectRatioType,
                  })
                }
                className={ADMIN_INPUT_CLS}
              >
                <option value="16:9">16:9 Widescreen</option>
                <option value="9:16">9:16 Vertical Short-Form</option>
                <option value="16:10">16:10 Cinema Frame</option>
              </select>
            </AdminField>

            <AdminField label="Format Badge">
              <input
                type="text"
                value={draft.format}
                onChange={(e) => setDraft({ ...draft, format: e.target.value })}
                placeholder="4K HDR"
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>

            <AdminField label="Duration">
              <input
                type="text"
                value={draft.duration}
                onChange={(e) =>
                  setDraft({ ...draft, duration: e.target.value })
                }
                placeholder="01:45"
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>

            <AdminField label="Year">
              <input
                type="text"
                value={draft.year}
                onChange={(e) => setDraft({ ...draft, year: e.target.value })}
                placeholder="2025"
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>

            <AdminField label="Views / Performance Metric">
              <input
                type="text"
                value={draft.views}
                onChange={(e) => setDraft({ ...draft, views: e.target.value })}
                placeholder="4.2M Views · 68% Ret."
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminField label="Thumbnail Image URL (or Upload)">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draft.thumbnail}
                  onChange={(e) =>
                    setDraft({ ...draft, thumbnail: e.target.value })
                  }
                  placeholder="/covers/commercial-pulse.jpg"
                  className={ADMIN_INPUT_CLS}
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-black text-xs font-semibold text-neutral-800 shrink-0">
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
            </AdminField>

            <AdminField label="Video URL / Embed Link (or MP4 Upload)">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={draft.videoUrl}
                  onChange={(e) =>
                    setDraft({ ...draft, videoUrl: e.target.value })
                  }
                  placeholder="https://youtube.com/watch?v=... or MP4 URL"
                  className={ADMIN_INPUT_CLS}
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-black text-xs font-semibold text-neutral-800 shrink-0">
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
            </AdminField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <AdminField label="External Project Link (optional)">
              <input
                type="url"
                value={draft.projectUrl}
                onChange={(e) =>
                  setDraft({ ...draft, projectUrl: e.target.value })
                }
                placeholder="https://behance.net/gallery/..."
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>

            <AdminField label="Category Tags (comma-separated)">
              <input
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="Fast Pacing, Sound Design, ACES Color"
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>

            <div className="pb-2">
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-neutral-800 font-medium">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) =>
                    setDraft({ ...draft, featured: e.target.checked })
                  }
                  className="rounded border-neutral-300 text-black focus:ring-0"
                />
                <span>Featured Highlight Production</span>
              </label>
            </div>
          </div>

          <AdminField label="Project Description">
            <textarea
              rows={2}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              placeholder="High-octane commercial cut blending dynamic speed ramps..."
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-5 py-2.5 rounded-full bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-[#111111] text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-neutral-800 disabled:opacity-60 shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? "Saving..." : "Save Project"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Uniform Project Rows */}
      <div className="grid grid-cols-1 gap-3">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="rounded-2xl bg-white border border-neutral-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-300 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                <Image
                  src={project.thumbnail || "/covers/commercial-pulse.jpg"}
                  alt={project.title}
                  fill
                  sizes="112px"
                  unoptimized={
                    !isOptimizableImageSrc(
                      project.thumbnail || "/covers/commercial-pulse.jpg"
                    )
                  }
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-800 font-semibold">
                    {project.category}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {project.format} · {project.duration}
                  </span>
                  {project.views && (
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                      {project.views}
                    </span>
                  )}
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-[10px] font-mono text-neutral-600 hover:text-black underline"
                    >
                      <span>Link</span>
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <h4 className="text-sm font-bold text-neutral-950 truncate">
                  {project.title}
                </h4>
                <p className="text-xs text-neutral-500 truncate">
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
                aria-label={`Move ${project.title} up`}
                className="p-2 rounded-xl bg-[#FAFAFB] border border-neutral-200 hover:border-neutral-400 text-neutral-700 disabled:opacity-30"
              >
                <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={idx === projects.length - 1}
                onClick={() => handleMove(idx, 1)}
                title="Move Down"
                aria-label={`Move ${project.title} down`}
                className="p-2 rounded-xl bg-[#FAFAFB] border border-neutral-200 hover:border-neutral-400 text-neutral-700 disabled:opacity-30"
              >
                <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => openEdit(project)}
                title="Edit"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#111111] text-white hover:bg-neutral-800 text-xs font-semibold transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project)}
                title="Delete"
                aria-label={`Delete ${project.title}`}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200/70 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
