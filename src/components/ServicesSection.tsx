"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Plus, X } from "lucide-react";
import type { Service } from "@/lib/data";

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const [expandedId, setExpandedId] = useState<string>(
    services[0]?.id || "short-form-retention"
  );

  return (
    <section
      id="services"
      className="py-16 sm:py-24 px-4 sm:px-8 md:px-12 border-t border-neutral-100 bg-white"
    >
      <div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 sm:mb-12"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-2">
            WHAT I DELIVER
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight uppercase">
            /SERVICE
          </h2>
        </motion.div>

        <div className="space-y-3">
          {services.map((service, index) => {
            const isOpen = expandedId === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.05, 0.2),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#1A1A1D] text-white rounded-2xl shadow-xl"
                    : "bg-white text-neutral-900 border-b border-neutral-200 hover:bg-neutral-50/70 rounded-xl"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? "" : service.id)}
                  className="w-full text-left px-5 sm:px-8 py-6 sm:py-7 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`text-[11px] font-mono uppercase font-semibold tracking-widest ${
                          isOpen ? "text-accentGreen" : "text-neutral-400"
                        }`}
                      >
                        {service.badge || `${service.number} / CAPABILITY`}
                      </span>
                      {service.turnaround && (
                        <span
                          className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full ${
                            isOpen
                              ? "bg-white/10 text-zinc-300"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {service.turnaround}
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-xl sm:text-3xl font-extrabold uppercase tracking-tight transition-colors ${
                        isOpen ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-end shrink-0">
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isOpen
                          ? "border border-neutral-700 text-zinc-300 hover:border-neutral-500"
                          : "text-neutral-800"
                      }`}
                    >
                      {isOpen ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-8 pb-7 pt-4 space-y-5 border-t border-white/10">
                        <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            {service.deliverables.map((item) => (
                              <span
                                key={item}
                                className="dark-glass-pill text-[11px] font-mono text-zinc-200 px-3 py-1.5 rounded-full"
                              >
                                {item}
                              </span>
                            ))}
                          </div>

                          <a
                            href="#contact"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-zinc-300 transition-colors"
                          >
                            <span>Book This Service</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
