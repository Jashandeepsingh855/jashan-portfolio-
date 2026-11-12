"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { Testimonial, TestimonialsSectionContent } from "@/lib/data";

interface TestimonialsSectionProps {
  id?: string;
  testimonials: Testimonial[];
  sectionContent?: TestimonialsSectionContent;
}

export default function TestimonialsSection({
  id,
  testimonials,
  sectionContent,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      id={id}
      className="w-full max-w-full overflow-x-hidden pt-24 pb-16 sm:py-24 px-4 sm:px-8 md:px-12 bg-background"
    >
      <div className="w-full max-w-full">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-600 mb-2">
            {sectionContent?.eyebrow || "/ CLIENT VALIDATION"}
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight uppercase">
            {sectionContent?.heading || "DIRECTOR & CREATOR REVIEWS"}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: Math.min(index * 0.08, 0.24),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="min-w-0 max-w-full rounded-3xl bg-[#FAFAFB] border border-neutral-200/80 p-6 sm:p-7 flex flex-col justify-between gap-6 glow-card"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    role="img"
                    className="flex items-center gap-1 text-neutral-900"
                    aria-label={`${t.rating || 5} out of 5 stars`}
                  >
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900"
                      />
                    ))}
                  </div>
                  <Quote
                    aria-hidden="true"
                    className="w-5 h-5 text-neutral-400"
                  />
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200/80">
                <p className="text-sm font-bold text-neutral-950">{t.author}</p>
                <p className="text-xs font-mono text-neutral-600 mt-0.5">
                  {t.role} · {t.company}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
