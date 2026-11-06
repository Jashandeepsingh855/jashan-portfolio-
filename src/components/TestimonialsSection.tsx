"use client";

import React from "react";
import { Testimonial } from "@/lib/data";
import { Star } from "lucide-react";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="w-full bg-surface-muted/60 py-24 border-y border-border-subtle" id="testimonials">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 mb-12 gap-6 border-b border-border-subtle">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              05 // COLLABORATION REVIEWS
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold uppercase text-on-surface tracking-tight">
              Built on collaboration.
            </h2>
          </div>
          <p className="text-on-surface-muted max-w-md text-base leading-relaxed">
            Feedback from directors, brand leads, and creators who prioritize visual distinction over volume.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div
              key={test.id || idx}
              className="bg-surface-pure p-8 rounded-3xl border border-border-subtle flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow"
            >
              <div>
                <div className="flex items-center gap-1 text-accent pb-6">
                  {Array.from({ length: test.rating || 5 }).map((_, sIdx) => (
                    <Star key={sIdx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-base text-on-surface leading-relaxed">
                  “{test.quote}”
                </p>
              </div>

              <div className="pt-8 border-t border-border-subtle mt-8">
                <span className="font-bold text-base uppercase text-on-surface block">
                  {test.author}
                </span>
                <span className="font-mono text-[11px] uppercase text-on-surface-muted tracking-wider block mt-0.5">
                  {test.role} // {test.company}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
