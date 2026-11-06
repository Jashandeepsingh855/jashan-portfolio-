"use client";

import React from "react";
import { Service } from "@/lib/data";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="w-full bg-surface py-24" id="services">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 gap-6 border-b border-border-subtle">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              02 // CAPABILITIES & SERVICES
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase text-on-surface tracking-tight">
              From the first cut to the final frame.
            </h2>
          </div>
          <p className="text-on-surface-muted max-w-md text-base leading-relaxed">
            Full-service post-production capabilities scaled for commercial agencies, independent directors, and digital-first brands.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <div
              key={service.id || idx}
              className="bg-surface-pure p-8 rounded-3xl border border-border-subtle flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-accent/40 transition-all duration-300 group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
                  <span className="font-mono text-lg font-bold text-accent">
                    {service.number || `0${idx + 1}`}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-surface-muted text-on-surface-muted group-hover:text-accent group-hover:bg-accent-glow transition-colors">
                    {service.badge || "CAPABILITY"}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-2xl font-bold uppercase text-on-surface mt-6 mb-3 tracking-tight group-hover:text-accent transition-colors">
                  {service.title}
                </h3>

                <p className="text-on-surface-muted text-sm leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Deliverables List */}
                {service.deliverables && service.deliverables.length > 0 && (
                  <div className="space-y-2 mb-6">
                    <span className="font-mono text-[10px] text-on-surface-subtle uppercase tracking-wider block">
                      DELIVERABLES:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.deliverables.map((item, dIdx) => (
                        <span
                          key={dIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-muted text-xs font-mono text-on-surface"
                        >
                          <CheckCircle2 className="w-3 h-3 text-accent" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Inquire link */}
              <div className="pt-6 border-t border-border-subtle mt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-between w-full font-mono text-xs uppercase font-bold text-on-surface group-hover:text-accent transition-colors"
                >
                  <span>Inquire for this workflow</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
