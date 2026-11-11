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
      className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#050505]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-14"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
            / CLIENT VALIDATION
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            DIRECTOR &amp; CREATOR REVIEWS
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: Math.min(index * 0.08, 0.24),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="rounded-3xl bg-[#111114] border border-white/[0.08] p-6 sm:p-7 flex flex-col justify-between gap-6 glow-card"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-white">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-white text-white"
                      />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08]">
                <p className="text-sm font-bold text-white">{t.author}</p>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">
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
