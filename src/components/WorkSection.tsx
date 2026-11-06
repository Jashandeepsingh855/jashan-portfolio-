"use client";

import React, { useState, useMemo } from "react";
import { Project } from "@/lib/data";
import { Play, ArrowUpRight, Film, ExternalLink } from "lucide-react";

interface WorkSectionProps {
  categories: string[];
  projects: Project[];
  onPlayProject: (project: Project) => void;
}

export default function WorkSection({
  categories,
  projects,
  onPlayProject,
}: WorkSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Works");

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All Works" || !selectedCategory) {
      return projects;
    }
    return projects.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [projects, selectedCategory]);

  return (
    <section className="w-full bg-surface-muted/60 py-24 border-y border-border-subtle" id="work">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-8 gap-6 border-b border-border-subtle">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              01 // SELECTED WORK
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase text-on-surface tracking-tight">
              A selection of my work.
            </h2>
          </div>
          <p className="text-on-surface-muted max-w-md text-base leading-relaxed">
            Carefully crafted edits balanced between raw emotional resonance and surgical pacing. Every cut motivated by intention.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 no-scrollbar font-mono text-xs uppercase">
          {categories.map((cat, idx) => {
            const count =
              cat === "All Works"
                ? projects.length
                : projects.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-xs ${
                  isActive
                    ? "bg-surface-dark text-white font-medium shadow-sm"
                    : "bg-surface-pure hover:bg-surface-dark hover:text-white text-on-surface-muted border border-border-subtle"
                }`}
              >
                {cat} {cat === "All Works" && `(${count})`}
              </button>
            );
          })}
        </div>

        {/* Asymmetric Editorial Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-surface-pure rounded-3xl border border-border-subtle text-on-surface-muted font-mono text-sm">
            No projects in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {filteredProjects.map((project, idx) => {
              // Alternate large 8-col and small 4-col or respect project.featured
              const isLarge = project.featured ?? (idx % 3 === 0);
              const colSpanClass = isLarge ? "md:col-span-8" : "md:col-span-4";
              const aspectClass = isLarge ? "aspect-[16/9]" : "aspect-[4/3]";

              return (
                <div
                  key={project.id || idx}
                  className={`${colSpanClass} bg-surface-pure rounded-3xl overflow-hidden border border-border-subtle shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group`}
                >
                  {/* Thumbnail & Video Play Trigger */}
                  <div
                    onClick={() => onPlayProject(project)}
                    className={`relative ${aspectClass} w-full overflow-hidden bg-surface-dark cursor-pointer group`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Dark gradient overlay on hover */}
                    <div className="absolute inset-0 bg-surface-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-6 h-6 ml-0.5 fill-current" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {project.duration && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-surface-dark/80 backdrop-blur-md text-white font-mono text-[11px] uppercase tracking-wider">
                        RUN: {project.duration}
                      </div>
                    )}

                    {/* Format / Resolution Badge */}
                    {project.format && isLarge && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-white/90 backdrop-blur-md text-on-surface font-mono text-[11px] uppercase font-semibold">
                        {project.format}
                      </div>
                    )}
                  </div>

                  {/* Project Details */}
                  <div className="p-8 flex flex-col justify-between flex-grow">
                    <div>
                      <div className="flex items-center justify-between pb-2">
                        <span className="font-mono text-xs uppercase tracking-wider text-accent font-bold">
                          {project.category}
                        </span>
                        <span className="font-mono text-xs text-on-surface-muted">
                          {project.year}
                        </span>
                      </div>

                      <h3
                        onClick={() => onPlayProject(project)}
                        className="text-2xl md:text-3xl font-extrabold uppercase text-on-surface tracking-tight group-hover:text-accent transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h3>

                      <p className="text-on-surface-muted mt-3 text-base leading-relaxed">
                        {project.description}
                      </p>

                      {/* Project Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                          {project.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded bg-surface-muted text-[11px] font-mono text-on-surface-muted uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Project Footer Strip */}
                    <div className="pt-6 border-t border-border-subtle mt-6 flex items-center justify-between font-mono text-xs uppercase">
                      <span className="text-on-surface-muted truncate max-w-[55%]">
                        {project.client ? `CLIENT: ${project.client}` : "DIRECTOR'S CUT"}
                      </span>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onPlayProject(project)}
                          className="inline-flex items-center gap-1 font-bold text-accent hover:text-on-surface transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Watch Cut</span>
                        </button>
                        {project.caseStudyUrl && (
                          <a
                            href={project.caseStudyUrl}
                            className="hidden sm:inline-flex items-center gap-0.5 text-on-surface hover:text-accent font-semibold transition-colors"
                          >
                            <span>Info</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Archive Footer Bar */}
        <div className="mt-12 p-4 bg-surface-pure rounded-2xl border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs uppercase">
          <span className="text-on-surface-muted">
            ARCHIVE REEL // 2021 – 2025 ALL RELEASES CONFORMED
          </span>
          <a
            href="#contact"
            className="text-accent hover:text-on-surface font-bold tracking-wider inline-flex items-center gap-1 transition-colors"
          >
            Request Full Editorial Archive (30+ Cuts) ↗
          </a>
        </div>
      </div>
    </section>
  );
}
