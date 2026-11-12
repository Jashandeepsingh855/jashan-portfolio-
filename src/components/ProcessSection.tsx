"use client";

import { motion } from "framer-motion";
import type { AboutContent, HeroContent, ProcessContent } from "@/lib/data";

interface ProcessSectionProps {
  id?: string;
  process: ProcessContent;
  about: AboutContent;
  hero: HeroContent;
}

export default function ProcessSection({
  id,
  process,
  about,
  hero,
}: ProcessSectionProps) {
  const stack =
    hero.hardwarePipeline && hero.hardwarePipeline.length > 0
      ? hero.hardwarePipeline
      : about.softwareSkills.map((s) => s.name);

  return (
    <section
      id={id}
      className="w-full max-w-full overflow-x-hidden pt-24 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-8 md:px-12 bg-background"
    >
      {/* Floating Obsidian Track Record Showcase Container matching 4.webp */}
      <div className="bg-[#1A1A1D] text-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 md:p-14 relative w-full max-w-full overflow-hidden shadow-2xl">
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute top-6 left-1/2 -translate-x-1/2 watermark-text-dark font-sans text-[14vw] sm:text-[10vw] font-extrabold uppercase tracking-widest leading-none whitespace-nowrap"
        >
          EXPERIENCE
        </div>

        <div className="relative z-10">
          {/* Header Row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-8 mb-4 gap-4"
          >
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
                {process.badge || "/ EXPERIENCE"}
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
                {process.heading || "TRACK RECORD"}
              </h2>
            </div>

            <div className="text-xs font-mono text-zinc-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full inline-block self-start sm:self-auto">
              {process.description}
            </div>
          </motion.div>

          {/* Experience Timeline Rows */}
          <div className="divide-y divide-white/10">
            {(process.experiences || []).map((exp, idx) => (
              <motion.div
                key={`${exp.company}-${idx}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(idx * 0.06, 0.24),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="py-6 sm:py-7 flex flex-col md:flex-row md:items-center justify-between gap-2.5 group md:hover:pl-2 transition-all duration-200"
              >
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-zinc-200 transition-colors">
                    {exp.company}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    {exp.role}
                  </p>
                </div>
                <div className="text-xs sm:text-sm font-mono text-zinc-400 group-hover:text-white transition-colors">
                  {exp.period}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 4-Stage Post Pipeline Grid */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                // STUDIO POST-PRODUCTION PIPELINE
              </p>
              <p className="text-xs text-zinc-400">
                {about.subheading ||
                  "Respecting every millisecond of the viewer's attention."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {(process.steps || []).map((step, idx) => (
                <motion.div
                  key={step.stage}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(idx * 0.06, 0.24),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-2xl bg-black/35 border border-white/10 p-4 sm:p-5 flex flex-col justify-between gap-3 hover:border-white/25 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                        {step.stage}
                      </span>
                      <span className="text-[10px] font-mono text-accentGreen bg-accentGreen/10 px-2 py-0.5 rounded-full">
                        {step.duration}
                      </span>
                    </div>
                    <h4 className="text-base font-extrabold text-white tracking-tight uppercase mb-1.5">
                      {step.title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Core Production Stack Badges */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-4">
              Core Production Stack &amp; Toolset
            </p>
            <div className="flex flex-wrap gap-2.5">
              {stack.map((tool) => (
                <span
                  key={tool}
                  className="dark-glass-pill px-4 py-2 rounded-xl text-xs font-mono text-zinc-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
