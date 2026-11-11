"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "01",
    title: "SHORT-FORM RETENTION EDITING",
    description:
      "High-pacing viral cuts designed for Reels, TikTok, and Shorts to maximize hook rate and viewer retention.",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "YOUTUBE STORYTELLING & ESSAYS",
    description:
      "Long-form storytelling with dynamic b-roll integration, custom animations, and seamless narrative flow.",
    image: "/covers/silicon-frontier.jpg",
  },
  {
    id: "03",
    title: "CINEMATIC COLOR GRADING & ACES",
    description:
      "Professional color transform, skin tone correction, and custom look creation in DaVinci Resolve Studio.",
    image:
      "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "SOUND DESIGN & PUNCHY MIXING",
    description:
      "Immersive audio layering, riser impacts, voiceover equalization, and master-level sound treatment.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
  },
];

const AUTO_PLAY_DURATION = 5000;

interface VerticalTabsProps {
  id?: string;
  services?: ServiceItem[];
}

export function VerticalTabs({
  id = "services",
  services = DEFAULT_SERVICES,
}: VerticalTabsProps) {
  const items = services.length > 0 ? services : DEFAULT_SERVICES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeIndex = activeIndex < items.length ? activeIndex : 0;

  const handleNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleTabClick = (index: number) => {
    if (index === safeIndex) return;
    setDirection(index > safeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsPaused(false);
  };

  useEffect(() => {
    if (isPaused || items.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_DURATION);

    return () => clearInterval(interval);
  }, [safeIndex, isPaused, handleNext, items.length]);

  const variants = {
    enter: (dir: number) => ({
      y: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      y: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const activeService = items[safeIndex];

  return (
    <section
      id={id}
      className="w-full bg-background border-t border-neutral-100 py-14 sm:py-20 lg:py-24 px-4 sm:px-8 md:px-12"
    >
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Services Tabs */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pt-2">
            <div className="space-y-1.5 mb-8">
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-[0.3em] block">
                WHAT I DELIVER
              </span>
              <h2 className="tracking-tighter text-balance text-3xl font-extrabold md:text-4xl lg:text-5xl text-foreground uppercase">
                /SERVICES
              </h2>
            </div>

            <div className="flex flex-col space-y-0">
              {items.map((service, index) => {
                const isActive = safeIndex === index;
                return (
                  <button
                    key={`${service.id}-${index}`}
                    type="button"
                    onClick={() => handleTabClick(index)}
                    className={cn(
                      "group relative w-full flex items-start gap-4 pl-5 sm:pl-6 py-5 sm:py-6 md:py-7 text-left transition-all duration-500 border-t border-border/70 first:border-t-0",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground/60 hover:text-foreground"
                    )}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-muted">
                      {isActive && (
                        <motion.div
                          key={`progress-${index}-${isPaused}`}
                          className="absolute top-0 left-0 w-full bg-foreground origin-top"
                          initial={{ height: "0%" }}
                          animate={
                            isPaused ? { height: "0%" } : { height: "100%" }
                          }
                          transition={{
                            duration: AUTO_PLAY_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </div>

                    <span className="text-[10px] font-mono font-medium mt-1.5 tabular-nums opacity-60 shrink-0">
                      /{service.id}
                    </span>

                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-lg sm:text-xl lg:text-[21px] xl:text-[22px] font-bold tracking-tight transition-colors duration-500 uppercase",
                          isActive ? "text-foreground" : ""
                        )}
                      >
                        {service.title}
                      </span>

                      <AnimatePresence mode="wait">
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="text-muted-foreground text-sm md:text-base font-normal leading-relaxed max-w-md pb-1">
                              {service.description}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Preview Gallery */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full order-1 lg:order-2">
            <div
              className="relative group/gallery"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="relative aspect-[4/3] lg:aspect-[16/11] rounded-3xl md:rounded-[2.5rem] overflow-hidden bg-neutral-900 border border-border/60 shadow-2xl">
                <AnimatePresence
                  custom={direction}
                  initial={false}
                  mode="popLayout"
                >
                  <motion.div
                    key={safeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      y: { type: "spring", stiffness: 260, damping: 32 },
                      opacity: { duration: 0.4 },
                    }}
                    className="absolute inset-0 w-full h-full cursor-pointer"
                    onClick={handleNext}
                  >
                    <img
                      src={activeService.image}
                      alt={activeService.title}
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallbackApplied) {
                          target.dataset.fallbackApplied = "true";
                          target.src = "/covers/silicon-frontier.jpg";
                        }
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 !m-0 !p-0 block"
                    />

                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 flex gap-2 md:gap-3 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/85 backdrop-blur-md border border-border/60 flex items-center justify-center text-foreground hover:bg-background transition-all active:scale-90 shadow-md"
                    aria-label="Previous service"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/85 backdrop-blur-md border border-border/60 flex items-center justify-center text-foreground hover:bg-background transition-all active:scale-90 shadow-md"
                    aria-label="Next service"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerticalTabs;
