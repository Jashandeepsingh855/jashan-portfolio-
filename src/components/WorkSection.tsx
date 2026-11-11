"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/lib/data";

interface WorkSectionProps {
  projects: Project[];
  categories: string[];
  onSelectProject: (project: Project) => void;
}

export default function WorkSection({
  projects,
  categories,
  onSelectProject,
}: WorkSectionProps) {
  const availableCategories = useMemo(() => {
    const base =
      categories && categories.length > 0
        ? categories
        : ["All", "Short-Form", "Long-Form", "Commercial"];
    return base.includes("All") ? base : ["All", ...base];
  }, [categories]);

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    const sorted = [...projects].sort((a, b) => a.order - b.order);
    if (activeCategory === "All") return sorted;
    return sorted.filter(
      (proj) =>
        proj.category.toLowerCase() === activeCategory.toLowerCase() ||
        proj.tags.some(
          (tag) => tag.toLowerCase() === activeCategory.toLowerCase()
        )
    );
  }, [projects, activeCategory]);

  const getCountForCategory = (cat: string) => {
    if (cat === "All") return projects.length;
    return projects.filter(
      (proj) =>
        proj.category.toLowerCase() === cat.toLowerCase() ||
        proj.tags.some((tag) => tag.toLowerCase() === cat.toLowerCase())
    ).length;
  };

  return (
    <section
      id="work"
      className="relative py-16 sm:py-24 px-4 sm:px-8 md:px-12 border-t border-neutral-100 bg-white overflow-hidden"
    >
      {/* Massive Soft Ghost Watermark Backdrop matching 2.webp */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute top-8 left-1/2 -translate-x-1/2 watermark-text font-sans text-[16vw] sm:text-[13vw] font-extrabold uppercase tracking-[0.12em] leading-none whitespace-nowrap"
      >
        PORTFOLIO
      </div>

      <div className="relative z-10">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14 pt-2 sm:pt-4"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-2">
            FEATURED PRODUCTIONS
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-neutral-950 tracking-tight uppercase">
            /SELECTED WORK
          </h2>
        </motion.div>

        {/* Filter Controls matching 2.webp */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-neutral-200">
          <div className="flex flex-wrap items-center gap-2">
            {availableCategories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = getCountForCategory(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-white"
                      : "bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200/70"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activePortfolioTab"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 bg-[#111111] rounded-full"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{cat}</span>
                    <span
                      className={`font-mono text-[11px] ${
                        isActive ? "text-zinc-400" : "text-neutral-400"
                      }`}
                    >
                      [{count}]
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <a
            href="#contact"
            className="border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-800 px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <span>Request Private Cut</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Responsive Masonry/Grid Project Showcase */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const isVertical = project.aspectRatio === "9:16";
              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 22, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(index * 0.06, 0.24),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => onSelectProject(project)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectProject(project);
                    }
                  }}
                  className="group cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-neutral-200/90 glow-card focus:outline-none focus:ring-2 focus:ring-black/30"
                >
                  {/* Dark Cinema Frame */}
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-[#121215] mb-5 flex items-center justify-center ${
                      isVertical
                        ? "aspect-[4/5] sm:aspect-[16/10] md:aspect-[4/5]"
                        : "aspect-[16/10]"
                    }`}
                  >
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className={`h-full transition-transform duration-700 ease-out group-hover:scale-105 ${
                        isVertical
                          ? "w-auto max-w-[76%] rounded-xl object-cover shadow-2xl border border-white/10"
                          : "w-full object-cover"
                      }`}
                    />

                    {isVertical && (
                      <img
                        src={project.thumbnail}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110 -z-10 pointer-events-none"
                      />
                    )}

                    {/* Media Top Meta Pills */}
                    <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 z-10">
                      <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider text-black uppercase shadow-xs">
                        {project.category}
                      </span>
                      <span className="bg-black/70 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[10px] font-mono text-zinc-200">
                        {project.format || project.aspectRatio}
                      </span>
                    </div>

                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className="bg-black/75 backdrop-blur-md border border-white/15 text-white font-mono text-[11px] px-2.5 py-1 rounded-full">
                        {project.duration}
                      </span>
                    </div>

                    {/* Blur-Backdrop Play Overlay */}
                    <div className="absolute inset-0 bg-black/35 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                      <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-black translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Clean Editorial Metadata */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                          {project.client} · {project.year}
                        </p>
                        <h3 className="text-lg sm:text-xl font-bold text-neutral-950 group-hover:text-black transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="bg-neutral-100 text-neutral-700 text-[11px] font-medium px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {project.views && (
                        <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                          {project.views}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
