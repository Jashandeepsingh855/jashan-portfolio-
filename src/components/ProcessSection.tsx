"use client";

import React from "react";
import { ProcessStep } from "@/lib/data";

interface ProcessSectionProps {
  process: {
    badge: string;
    heading: string;
    description: string;
    steps: ProcessStep[];
  };
}

export default function ProcessSection({ process }: ProcessSectionProps) {
  return (
    <section className="w-full bg-surface py-24" id="process">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 gap-6 border-b border-border-subtle">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              {process.badge || "04 / WORKFLOW"}
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase text-on-surface tracking-tight">
              {process.heading || "Simple process. Thoughtful execution."}
            </h2>
          </div>
          <p className="text-on-surface-muted max-w-md text-base leading-relaxed">
            {process.description ||
              "A transparent, frictionless workflow designed to respect client timelines and creative integrity at every milestone."}
          </p>
        </div>

        {/* 5-Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {process.steps?.map((step, idx) => (
            <div
              key={idx}
              className="bg-surface-pure p-6 rounded-2xl border border-border-subtle flex flex-col justify-between h-full group hover:border-accent/40 shadow-sm hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between pb-6">
                  <span className="font-mono text-xs text-accent font-bold">
                    {step.stage || `STAGE // 0${idx + 1}`}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-border-subtle group-hover:bg-accent transition-colors"></span>
                </div>
                <h3 className="text-xl font-bold uppercase text-on-surface mb-2 group-hover:text-accent transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-on-surface-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="pt-8 font-mono text-[10px] text-on-surface-subtle uppercase tracking-wider">
                {step.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
