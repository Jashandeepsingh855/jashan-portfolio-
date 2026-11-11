"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Plus } from "lucide-react";
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
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#050505]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
            / SERVICES
          </p>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase">
            WHAT I DELIVER
          </h2>
        </motion.div>

        <div className="space-y-4">
          {services.map((service, index) => {
            const isOpen = expandedId === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: Math.min(index * 0.06, 0.2),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`rounded-3xl border transition-colors duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#121216] border-white/20 shadow-2xl"
                    : "bg-[#0b0b0e] border-white/[0.08] hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? "" : service.id)}
                  className="w-full text-left p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-mono uppercase font-bold tracking-widest ${
                          isOpen ? "text-accentGreen" : "text-zinc-500"
                        }`}
                      >
                        {service.badge || `${service.number} / CAPABILITY`}
                      </span>
                      {service.turnaround && (
                        <span className="text-[11px] font-mono text-zinc-400 glass-pill px-2.5 py-0.5 rounded-full">
                          {service.turnaround}
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-xl sm:text-3xl font-extrabold uppercase tracking-tight transition-colors ${
                        isOpen ? "text-white" : "text-zinc-200"
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-end shrink-0">
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isOpen
                          ? "bg-white text-black"
                          : "border border-white/20 text-zinc-300"
                      }`}
                    >
                      {isOpen ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
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
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 sm:px-8 pb-7 pt-0 space-y-5 border-t border-white/[0.06] mt-1 pt-5">
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
                          {service.description}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap gap-2">
                            {service.deliverables.map((item) => (
                              <span
                                key={item}
                                className="glass-pill text-[11px] font-mono text-zinc-300 px-3 py-1.5 rounded-full"
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
