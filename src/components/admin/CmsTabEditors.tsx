"use client";

import React from "react";
import { Image as ImageIcon, Plus, Shield, Trash2, Upload } from "lucide-react";
import type { SiteContent } from "@/lib/data";
import {
  ADMIN_COMPACT_INPUT_CLS,
  ADMIN_INPUT_CLS,
  AdminCard,
  AdminField,
} from "@/components/admin/AdminUiPrimitives";

type UploadMediaFn = (
  file: File,
  folder: string,
  onDone: (url: string) => void
) => void;

interface TabEditorProps {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
  uploadingAsset?: string | null;
  uploadMedia?: UploadMediaFn;
}

export function HeroCmsTab({
  content,
  onChange,
  uploadingAsset,
  uploadMedia,
}: TabEditorProps) {
  return (
    <div className="space-y-6">
      <AdminCard
        eyebrow="HERO IDENTITY & CUTOUT"
        title="Wordmark, Role Copy & Cutout Image"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="Background Outlined Wordmark">
            <input
              type="text"
              value={content.siteSettings.wordmark}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    wordmark: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>

          <AdminField label="Primary Role Heading">
            <input
              type="text"
              value={content.siteSettings.role}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    role: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>

          <AdminField label="Hero Specialty Pill">
            <input
              type="text"
              value={content.hero.badge}
              onChange={(e) =>
                onChange({
                  ...content,
                  hero: { ...content.hero, badge: e.target.value },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>

          <AdminField label="Cutout Portrait URL (or Upload)">
            <div className="flex gap-2">
              <input
                type="text"
                value={content.hero.portraitImage}
                onChange={(e) =>
                  onChange({
                    ...content,
                    hero: { ...content.hero, portraitImage: e.target.value },
                  })
                }
                className={ADMIN_INPUT_CLS}
              />
              {uploadMedia && (
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-black text-xs font-semibold text-neutral-800 shrink-0">
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
                      if (file) {
                        uploadMedia(file, "portrait", (url) =>
                          onChange({
                            ...content,
                            hero: { ...content.hero, portraitImage: url },
                          })
                        );
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </AdminField>

          <AdminField label="Portrait Telemetry Label">
            <input
              type="text"
              value={content.hero.portraitStatLabel}
              onChange={(e) =>
                onChange({
                  ...content,
                  hero: {
                    ...content.hero,
                    portraitStatLabel: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>

          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Telemetry Value">
              <input
                type="text"
                value={content.hero.portraitStatValue}
                onChange={(e) =>
                  onChange({
                    ...content,
                    hero: {
                      ...content.hero,
                      portraitStatValue: e.target.value,
                    },
                  })
                }
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>
            <AdminField label="Telemetry Pill Badge">
              <input
                type="text"
                value={content.hero.portraitStatBadge}
                onChange={(e) =>
                  onChange({
                    ...content,
                    hero: {
                      ...content.hero,
                      portraitStatBadge: e.target.value,
                    },
                  })
                }
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>
          </div>
        </div>

        <AdminField label="Hero Bio / Mission Copy">
          <textarea
            rows={2}
            value={content.hero.description}
            onChange={(e) =>
              onChange({
                ...content,
                hero: { ...content.hero, description: e.target.value },
              })
            }
            className={ADMIN_INPUT_CLS}
          />
        </AdminField>
      </AdminCard>

      <AdminCard
        eyebrow="ARCHITECTURAL STATS BAR"
        title="Hero Metric Badges"
        action={
          <button
            type="button"
            onClick={() =>
              onChange({
                ...content,
                hero: {
                  ...content.hero,
                  metrics: [
                    ...content.hero.metrics,
                    { value: "100%", label: "New Metric" },
                  ],
                },
              })
            }
            className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-neutral-800 text-white px-4 py-2 rounded-full text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Metric</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {content.hero.metrics.map((m, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-2xl bg-white border border-neutral-200 p-3"
            >
              <input
                type="text"
                value={m.value}
                onChange={(e) => {
                  const next = [...content.hero.metrics];
                  next[idx] = { ...m, value: e.target.value };
                  onChange({
                    ...content,
                    hero: { ...content.hero, metrics: next },
                  });
                }}
                placeholder="120M+"
                className="w-28 rounded-xl bg-[#FAFAFB] border border-neutral-200 px-3 py-2 text-sm font-bold text-neutral-950 focus:outline-none focus:border-black"
              />
              <input
                type="text"
                value={m.label}
                onChange={(e) => {
                  const next = [...content.hero.metrics];
                  next[idx] = { ...m, label: e.target.value };
                  onChange({
                    ...content,
                    hero: { ...content.hero, metrics: next },
                  });
                }}
                placeholder="Organic Views"
                className={ADMIN_COMPACT_INPUT_CLS}
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...content,
                    hero: {
                      ...content.hero,
                      metrics: content.hero.metrics.filter((_, i) => i !== idx),
                    },
                  })
                }
                className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200/70 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        eyebrow="SHOWREEL MONITOR"
        title="Official Showreel & Production Stack"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="Showreel Title">
            <input
              type="text"
              value={content.hero.showreelTitle}
              onChange={(e) =>
                onChange({
                  ...content,
                  hero: { ...content.hero, showreelTitle: e.target.value },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Showreel Subtitle">
            <input
              type="text"
              value={content.hero.showreelSubtitle}
              onChange={(e) =>
                onChange({
                  ...content,
                  hero: { ...content.hero, showreelSubtitle: e.target.value },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Showreel Video URL (or Upload MP4)">
            <div className="flex gap-2">
              <input
                type="text"
                value={content.hero.showreelVideoUrl}
                onChange={(e) =>
                  onChange({
                    ...content,
                    hero: {
                      ...content.hero,
                      showreelVideoUrl: e.target.value,
                    },
                  })
                }
                className={ADMIN_INPUT_CLS}
              />
              {uploadMedia && (
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-black text-xs font-semibold text-neutral-800 shrink-0">
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
                      if (file) {
                        uploadMedia(file, "showreel", (url) =>
                          onChange({
                            ...content,
                            hero: { ...content.hero, showreelVideoUrl: url },
                          })
                        );
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </AdminField>
          <AdminField label="Showreel Cover Image URL (or Upload)">
            <div className="flex gap-2">
              <input
                type="text"
                value={content.hero.showreelCoverImage}
                onChange={(e) =>
                  onChange({
                    ...content,
                    hero: {
                      ...content.hero,
                      showreelCoverImage: e.target.value,
                    },
                  })
                }
                className={ADMIN_INPUT_CLS}
              />
              {uploadMedia && (
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 hover:border-black text-xs font-semibold text-neutral-800 shrink-0">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>
                    {uploadingAsset === "showreel-cover" ? "..." : "Upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        uploadMedia(file, "showreel-cover", (url) =>
                          onChange({
                            ...content,
                            hero: { ...content.hero, showreelCoverImage: url },
                          })
                        );
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </AdminField>
          <AdminField label="Format Specification">
            <input
              type="text"
              value={content.hero.showreelFormat}
              onChange={(e) =>
                onChange({
                  ...content,
                  hero: { ...content.hero, showreelFormat: e.target.value },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Timecode">
              <input
                type="text"
                value={content.hero.showreelTc}
                onChange={(e) =>
                  onChange({
                    ...content,
                    hero: { ...content.hero, showreelTc: e.target.value },
                  })
                }
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>
            <AdminField label="Color Space">
              <input
                type="text"
                value={content.hero.showreelColorspace}
                onChange={(e) =>
                  onChange({
                    ...content,
                    hero: {
                      ...content.hero,
                      showreelColorspace: e.target.value,
                    },
                  })
                }
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>
          </div>
        </div>

        <AdminField label="Production Stack Tools (comma-separated)">
          <input
            type="text"
            value={content.hero.hardwarePipeline.join(", ")}
            onChange={(e) =>
              onChange({
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
            className={ADMIN_INPUT_CLS}
          />
        </AdminField>
      </AdminCard>
    </div>
  );
}

export function ServicesCmsTab({
  content,
  onChange,
  uploadingAsset,
  uploadMedia,
}: TabEditorProps) {
  return (
    <div className="space-y-6">
      <AdminCard
        eyebrow="WHAT I DELIVER SECTION"
        title="Services Headers & Offerings"
        action={
          <button
            type="button"
            onClick={() =>
              onChange({
                ...content,
                services: [
                  ...content.services,
                  {
                    id: `service-${Date.now()}`,
                    number: String(content.services.length + 1).padStart(
                      2,
                      "0"
                    ),
                    badge: `${String(content.services.length + 1).padStart(
                      2,
                      "0"
                    )} / SERVICE`,
                    title: "NEW POST-PRODUCTION SERVICE",
                    description: "Describe deliverables and pacing.",
                    deliverables: ["4K Delivery", "Color Pass"],
                    turnaround: "Turnaround: 48h",
                    image: "/covers/silicon-frontier.jpg",
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-neutral-800 text-white px-4 py-2 rounded-full text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="Eyebrow Label (e.g. WHAT I DELIVER)">
            <input
              type="text"
              value={content.servicesSection.eyebrow}
              onChange={(e) =>
                onChange({
                  ...content,
                  servicesSection: {
                    ...content.servicesSection,
                    eyebrow: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Main Section Heading (e.g. /SERVICES)">
            <input
              type="text"
              value={content.servicesSection.heading}
              onChange={(e) =>
                onChange({
                  ...content,
                  servicesSection: {
                    ...content.servicesSection,
                    heading: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
        </div>

        <div className="space-y-4 pt-2">
          {content.services.map((svc, idx) => (
            <div
              key={svc.id}
              className="rounded-2xl bg-white border border-neutral-200 p-4 space-y-3 shadow-2xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <input
                  type="text"
                  value={svc.number}
                  onChange={(e) => {
                    const next = [...content.services];
                    next[idx] = { ...svc, number: e.target.value };
                    onChange({ ...content, services: next });
                  }}
                  placeholder="01"
                  className="md:col-span-1 rounded-xl bg-[#FAFAFB] border border-neutral-200 px-3 py-2 text-xs font-mono text-center text-neutral-900"
                />
                <input
                  type="text"
                  value={svc.title}
                  onChange={(e) => {
                    const next = [...content.services];
                    next[idx] = { ...svc, title: e.target.value };
                    onChange({ ...content, services: next });
                  }}
                  placeholder="Service Title"
                  className="md:col-span-6 rounded-xl bg-white border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-950"
                />
                <input
                  type="text"
                  value={svc.turnaround}
                  onChange={(e) => {
                    const next = [...content.services];
                    next[idx] = { ...svc, turnaround: e.target.value };
                    onChange({ ...content, services: next });
                  }}
                  placeholder="Turnaround: 48h"
                  className="md:col-span-4 rounded-xl bg-white border border-neutral-200 px-3 py-2 text-xs font-mono text-neutral-700"
                />
                <div className="md:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...content,
                        services: content.services.filter(
                          (s) => s.id !== svc.id
                        ),
                      })
                    }
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200/70 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AdminField label="Service Description">
                  <textarea
                    rows={2}
                    value={svc.description}
                    onChange={(e) => {
                      const next = [...content.services];
                      next[idx] = { ...svc, description: e.target.value };
                      onChange({ ...content, services: next });
                    }}
                    className={ADMIN_COMPACT_INPUT_CLS}
                  />
                </AdminField>
                <AdminField label="Preview Image URL (or Upload)">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={svc.image || ""}
                      onChange={(e) => {
                        const next = [...content.services];
                        next[idx] = { ...svc, image: e.target.value };
                        onChange({ ...content, services: next });
                      }}
                      placeholder="/covers/silicon-frontier.jpg"
                      className={ADMIN_COMPACT_INPUT_CLS}
                    />
                    {uploadMedia && (
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAFAFB] border border-neutral-200 hover:border-black text-xs font-semibold text-neutral-800 shrink-0">
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>
                          {uploadingAsset === `service-${svc.id}`
                            ? "..."
                            : "Upload"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              uploadMedia(file, `service-${svc.id}`, (url) => {
                                const next = [...content.services];
                                next[idx] = { ...svc, image: url };
                                onChange({ ...content, services: next });
                              });
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </AdminField>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard
        eyebrow="EXPERIENCE & PIPELINE SECTION"
        title="Track Record & Post-Production Workflow"
        action={
          <button
            type="button"
            onClick={() =>
              onChange({
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
            className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-neutral-800 text-white px-4 py-2 rounded-full text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Role</span>
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminField label="Section Eyebrow">
            <input
              type="text"
              value={content.process.badge}
              onChange={(e) =>
                onChange({
                  ...content,
                  process: { ...content.process, badge: e.target.value },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Section Heading">
            <input
              type="text"
              value={content.process.heading}
              onChange={(e) =>
                onChange({
                  ...content,
                  process: { ...content.process, heading: e.target.value },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Experience Summary Pill">
            <input
              type="text"
              value={content.process.description}
              onChange={(e) =>
                onChange({
                  ...content,
                  process: {
                    ...content.process,
                    description: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Pipeline Subtitle">
            <input
              type="text"
              value={content.about.subheading}
              onChange={(e) =>
                onChange({
                  ...content,
                  about: { ...content.about, subheading: e.target.value },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
        </div>

        <div className="space-y-3 pt-1">
          {content.process.experiences.map((exp, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-2xl bg-white border border-neutral-200 p-3.5 items-center"
            >
              <input
                type="text"
                value={exp.company}
                onChange={(e) => {
                  const next = [...content.process.experiences];
                  next[idx] = { ...exp, company: e.target.value };
                  onChange({
                    ...content,
                    process: { ...content.process, experiences: next },
                  });
                }}
                placeholder="Company"
                className="md:col-span-4 rounded-xl bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-950"
              />
              <input
                type="text"
                value={exp.role}
                onChange={(e) => {
                  const next = [...content.process.experiences];
                  next[idx] = { ...exp, role: e.target.value };
                  onChange({
                    ...content,
                    process: { ...content.process, experiences: next },
                  });
                }}
                placeholder="Role"
                className="md:col-span-5 rounded-xl bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-950"
              />
              <div className="md:col-span-3 flex gap-2">
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => {
                    const next = [...content.process.experiences];
                    next[idx] = { ...exp, period: e.target.value };
                    onChange({
                      ...content,
                      process: { ...content.process, experiences: next },
                    });
                  }}
                  placeholder="Jan 2023 — Present"
                  className="flex-1 rounded-xl bg-white border border-neutral-200 px-3 py-2 text-xs font-mono text-neutral-700"
                />
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...content,
                      process: {
                        ...content.process,
                        experiences: content.process.experiences.filter(
                          (_, i) => i !== idx
                        ),
                      },
                    })
                  }
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200/70 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-500">
              Studio Post-Production Stages ({content.process.steps.length})
            </p>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...content,
                  process: {
                    ...content.process,
                    steps: [
                      ...content.process.steps,
                      {
                        stage: `STAGE // 0${content.process.steps.length + 1}`,
                        title: "NEW STAGE",
                        duration: "DELIVERY",
                        description: "Describe this phase.",
                      },
                    ],
                  },
                })
              }
              className="text-xs font-semibold text-neutral-800 hover:text-black underline"
            >
              + Add Stage
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.process.steps.map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-neutral-200 p-4 space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={step.stage}
                    onChange={(e) => {
                      const next = [...content.process.steps];
                      next[idx] = { ...step, stage: e.target.value };
                      onChange({
                        ...content,
                        process: { ...content.process, steps: next },
                      });
                    }}
                    className="w-28 rounded-lg bg-[#FAFAFB] border border-neutral-200 px-2.5 py-1.5 text-[11px] font-mono"
                  />
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const next = [...content.process.steps];
                      next[idx] = { ...step, title: e.target.value };
                      onChange({
                        ...content,
                        process: { ...content.process, steps: next },
                      });
                    }}
                    className="flex-1 rounded-lg bg-white border border-neutral-200 px-2.5 py-1.5 text-sm font-bold"
                  />
                  <input
                    type="text"
                    value={step.duration}
                    onChange={(e) => {
                      const next = [...content.process.steps];
                      next[idx] = { ...step, duration: e.target.value };
                      onChange({
                        ...content,
                        process: { ...content.process, steps: next },
                      });
                    }}
                    className="w-28 rounded-lg bg-[#FAFAFB] border border-neutral-200 px-2.5 py-1.5 text-[11px] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...content,
                        process: {
                          ...content.process,
                          steps: content.process.steps.filter(
                            (_, i) => i !== idx
                          ),
                        },
                      })
                    }
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => {
                    const next = [...content.process.steps];
                    next[idx] = { ...step, description: e.target.value };
                    onChange({
                      ...content,
                      process: { ...content.process, steps: next },
                    });
                  }}
                  className={ADMIN_COMPACT_INPUT_CLS}
                />
              </div>
            ))}
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

export function TestimonialsCmsTab({ content, onChange }: TabEditorProps) {
  return (
    <AdminCard
      eyebrow="SOCIAL PROOF"
      title="Reviews Section Headers & Testimonials"
      action={
        <button
          type="button"
          onClick={() =>
            onChange({
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
          className="inline-flex items-center gap-1.5 bg-[#111111] hover:bg-neutral-800 text-white px-4 py-2 rounded-full text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Review</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminField label="Section Eyebrow">
          <input
            type="text"
            value={content.testimonialsSection.eyebrow}
            onChange={(e) =>
              onChange({
                ...content,
                testimonialsSection: {
                  ...content.testimonialsSection,
                  eyebrow: e.target.value,
                },
              })
            }
            className={ADMIN_INPUT_CLS}
          />
        </AdminField>
        <AdminField label="Section Heading">
          <input
            type="text"
            value={content.testimonialsSection.heading}
            onChange={(e) =>
              onChange({
                ...content,
                testimonialsSection: {
                  ...content.testimonialsSection,
                  heading: e.target.value,
                },
              })
            }
            className={ADMIN_INPUT_CLS}
          />
        </AdminField>
      </div>

      <div className="space-y-4">
        {content.testimonials.map((t, idx) => (
          <div
            key={t.id}
            className="rounded-2xl bg-white border border-neutral-200 p-4 space-y-3 shadow-2xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <input
                type="text"
                value={t.author}
                onChange={(e) => {
                  const next = [...content.testimonials];
                  next[idx] = { ...t, author: e.target.value };
                  onChange({ ...content, testimonials: next });
                }}
                placeholder="Author"
                className="sm:col-span-3 rounded-xl bg-white border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-950"
              />
              <input
                type="text"
                value={t.role}
                onChange={(e) => {
                  const next = [...content.testimonials];
                  next[idx] = { ...t, role: e.target.value };
                  onChange({ ...content, testimonials: next });
                }}
                placeholder="Role"
                className="sm:col-span-3 rounded-xl bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
              />
              <input
                type="text"
                value={t.company}
                onChange={(e) => {
                  const next = [...content.testimonials];
                  next[idx] = { ...t, company: e.target.value };
                  onChange({ ...content, testimonials: next });
                }}
                placeholder="Company"
                className="sm:col-span-4 rounded-xl bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-800"
              />
              <div className="sm:col-span-2 flex gap-2 justify-end">
                <select
                  value={t.rating || 5}
                  onChange={(e) => {
                    const next = [...content.testimonials];
                    next[idx] = { ...t, rating: Number(e.target.value) };
                    onChange({ ...content, testimonials: next });
                  }}
                  className="rounded-xl bg-[#FAFAFB] border border-neutral-200 px-2.5 py-2 text-xs font-mono"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}★
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...content,
                      testimonials: content.testimonials.filter(
                        (item) => item.id !== t.id
                      ),
                    })
                  }
                  className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200/70 transition-colors"
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
                onChange({ ...content, testimonials: next });
              }}
              className={ADMIN_COMPACT_INPUT_CLS}
            />
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

export function SettingsCmsTab({
  content,
  onChange,
  email,
  newPassword,
  onNewPasswordChange,
  onChangePassword,
}: {
  content: SiteContent;
  onChange: (next: SiteContent) => void;
  email: string;
  newPassword: string;
  onNewPasswordChange: (val: string) => void;
  onChangePassword: (e: React.FormEvent) => void;
}) {
  return (
    <div className="space-y-6">
      <AdminCard
        eyebrow="CONTACT SECTION"
        title="Booking Headline, Bio & Button Copy"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminField label="Contact Section Heading">
            <input
              type="text"
              value={content.contactSection.heading}
              onChange={(e) =>
                onChange({
                  ...content,
                  contactSection: {
                    ...content.contactSection,
                    heading: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Submit Button Label">
            <input
              type="text"
              value={content.contactSection.ctaLabel}
              onChange={(e) =>
                onChange({
                  ...content,
                  contactSection: {
                    ...content.contactSection,
                    ctaLabel: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
        </div>
        <AdminField label="Contact Subheading / Pitch">
          <textarea
            rows={2}
            value={content.contactSection.subheading}
            onChange={(e) =>
              onChange({
                ...content,
                contactSection: {
                  ...content.contactSection,
                  subheading: e.target.value,
                },
              })
            }
            className={ADMIN_INPUT_CLS}
          />
        </AdminField>
      </AdminCard>

      <AdminCard
        eyebrow="GLOBAL IDENTITY"
        title="Studio Metadata, Availability & Footer"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminField label="Creator Name">
            <input
              type="text"
              value={content.siteSettings.name}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    name: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Copyright Year">
            <input
              type="text"
              value={content.siteSettings.year}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    year: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Showreel Specialties Strip">
            <input
              type="text"
              value={content.siteSettings.specialties}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    specialties: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Header Availability Pill">
            <input
              type="text"
              value={content.siteSettings.availabilityStatus}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    availabilityStatus: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Contact Availability Subtext">
            <input
              type="text"
              value={content.siteSettings.availabilitySubtext}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    availabilitySubtext: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Public Studio Email">
            <input
              type="email"
              value={content.siteSettings.email}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    email: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Calendar / Booking URL">
            <input
              type="url"
              value={content.siteSettings.calendarLink}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    calendarLink: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
          <AdminField label="Footer Tagline" className="md:col-span-2">
            <input
              type="text"
              value={content.siteSettings.footerNote}
              onChange={(e) =>
                onChange({
                  ...content,
                  siteSettings: {
                    ...content.siteSettings,
                    footerNote: e.target.value,
                  },
                })
              }
              className={ADMIN_INPUT_CLS}
            />
          </AdminField>
        </div>

        <div className="pt-3 border-t border-neutral-200/80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(
            [
              ["YouTube URL", "youtube", "url"],
              ["YouTube Handle", "youtubeHandle", "text"],
              ["Instagram URL", "instagram", "url"],
              ["Instagram Handle", "instagramHandle", "text"],
              ["LinkedIn URL", "linkedin", "url"],
              ["LinkedIn Handle", "linkedinHandle", "text"],
              ["Behance URL", "behance", "url"],
              ["X / Twitter URL", "x", "url"],
              ["Vimeo URL", "vimeo", "url"],
            ] as const
          ).map(([label, key, type]) => (
            <AdminField key={key} label={label}>
              <input
                type={type}
                value={content.siteSettings.socials[key] || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    siteSettings: {
                      ...content.siteSettings,
                      socials: {
                        ...content.siteSettings.socials,
                        [key]: e.target.value,
                      },
                    },
                  })
                }
                className={ADMIN_INPUT_CLS}
              />
            </AdminField>
          ))}
        </div>
      </AdminCard>

      <form
        onSubmit={onChangePassword}
        className="rounded-3xl bg-[#1A1A1D] text-white p-6 sm:p-7 space-y-4 shadow-xl"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accentGreen" />
          <h2 className="text-lg font-bold tracking-tight uppercase text-white">
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
            onChange={(e) => onNewPasswordChange(e.target.value)}
            placeholder="New password (min 6 chars)"
            className="flex-1 rounded-xl bg-black/40 border border-white/15 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white"
          />
          <button
            type="submit"
            className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-zinc-200 transition-colors"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
