"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/data";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 px-4 sm:px-8 md:px-12 border-t border-neutral-100 bg-white"
    >
      <div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-2">
            / CLIENT VALIDATION
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight uppercase">
            DIRECTOR &amp; CREATOR REVIEWS
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
              className="rounded-3xl bg-[#FAFAFB] border border-neutral-200/80 p-6 sm:p-7 flex flex-col justify-between gap-6 glow-card"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-neutral-900">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900"
                      />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-neutral-300" />
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-200/80">
                <p className="text-sm font-bold text-neutral-950">{t.author}</p>
                <p className="text-xs font-mono text-neutral-500 mt-0.5">
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
