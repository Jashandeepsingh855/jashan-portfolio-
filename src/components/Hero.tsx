"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Film,
  Instagram,
  Layers,
  Linkedin,
  Play,
  Sliders,
  Twitter,
  Youtube,
} from "lucide-react";
import type { HeroContent, SiteSettings } from "@/lib/data";

interface HeroProps {
  hero: HeroContent;
  siteSettings: SiteSettings;
  onPlayShowreel: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function Hero({ hero, siteSettings, onPlayShowreel }: HeroProps) {
  const wordmark = (siteSettings.wordmark || "JASHANDEEP").toUpperCase();

  const socialItems = [
    {
      label: "YouTube",
      handle: siteSettings.socials.youtubeHandle || "1.2M+ Reach",
      href: siteSettings.socials.youtube,
      icon: Youtube,
      accent: "group-hover:text-red-600",
    },
    {
      label: "Instagram",
      handle: siteSettings.socials.instagramHandle || "@jashan.cuts",
      href: siteSettings.socials.instagram,
      icon: Instagram,
      accent: "group-hover:text-pink-600",
    },
    {
      label: "LinkedIn",
      handle: siteSettings.socials.linkedinHandle || "/in/jashandeep",
      href: siteSettings.socials.linkedin,
      icon: Linkedin,
      accent: "group-hover:text-sky-600",
    },
    {
      label: "Behance",
      handle: siteSettings.socials.behanceHandle || "Showcases",
      href: siteSettings.socials.behance,
      icon: Layers,
      accent: "group-hover:text-blue-600",
    },
    {
      label: "X / Twitter",
      handle: siteSettings.socials.xHandle || "@jashanedit",
      href: siteSettings.socials.x,
      icon: Twitter,
      accent: "group-hover:text-black",
    },
  ].filter((item) => Boolean(item.href));

  return (
    <section className="relative w-full pt-4 sm:pt-6 md:pt-8 pb-14 sm:pb-20 px-4 sm:px-8 md:px-12 overflow-x-clip bg-background">
      <div className="relative">
        {/* Continuous Unbroken Outlined Wordmark + Centered Cutout Portrait with Animated Circle */}
        <div className="relative w-full max-w-full overflow-hidden flex flex-col items-center justify-center min-w-0 pt-2 sm:pt-4">
          <motion.h1
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="text-outline font-sans font-extrabold uppercase select-none pointer-events-none whitespace-nowrap text-center z-[5] leading-[0.9] tracking-[0.02em]"
            style={{
              fontSize: "clamp(1.85rem, 8.6vw, 7.6rem)",
            }}
          >
            {wordmark}
          </motion.h1>

          {/* Centered Bigger Cutout Portrait + Scaling Backdrop Circle */}
          <div className="relative -mt-5 sm:-mt-8 md:-mt-12 lg:-mt-16 flex flex-col items-center pointer-events-none max-w-full">
            <div className="relative w-[285px] sm:w-[355px] md:w-[410px] lg:w-[465px] xl:w-[500px] flex justify-center items-end pt-3 sm:pt-4">
              {/* Animated Circular Backdrop (MinimalistHero scale-in) */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2,
                }}
                className="absolute z-0 bottom-0 h-[245px] w-[245px] sm:h-[330px] sm:w-[330px] md:h-[395px] md:w-[395px] lg:h-[440px] lg:w-[440px] xl:h-[470px] xl:w-[470px] rounded-full bg-yellow-400/90"
              />

              <motion.img
                src={hero.portraitImage || "/portrait-cutout.png"}
                alt={`${siteSettings.name} — ${siteSettings.role}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.4,
                }}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "/portrait-cutout.png";
                }}
                className="relative z-10 w-full h-auto max-h-[340px] sm:max-h-[405px] md:max-h-[450px] lg:max-h-[490px] xl:max-h-[520px] object-contain object-bottom drop-shadow-[0_18px_28px_rgba(0,0,0,0.08)]"
              />
              {/* Subtle Baseline Feather tucked under Telemetry Pill */}
              <div className="absolute inset-x-0 bottom-0 z-10 h-3 sm:h-4 bg-gradient-to-t from-white to-transparent" />
            </div>

            {/* Subtle Telemetry Pill Anchored cleanly below Portrait Bust */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative z-20 -mt-3 sm:-mt-4 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-full px-3.5 sm:px-4 py-1.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 shadow-sm border border-neutral-200 max-w-full"
            >
              <span className="flex items-center gap-1.5 text-center">
                <Film className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                  {hero.portraitStatLabel || "TOTAL REACH"}:
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-neutral-900">
                  {hero.portraitStatValue || "120M+ Views Driven"}
                </span>
              </span>
              {hero.portraitStatBadge && (
                <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {hero.portraitStatBadge}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Aligned Flanking Side Copy (Left) & Social Links Stack (Right) */}
        <div className="relative z-20 mt-8 md:mt-6 xl:-mt-16 min-[1400px]:-mt-24 2xl:-mt-32 grid grid-cols-1 md:grid-cols-12 items-end gap-8 pointer-events-none min-w-0">
          {/* Left Side Info & CTAs */}
          <motion.div
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="md:col-span-6 lg:col-span-4 space-y-4 text-center md:text-left pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              <span>{hero.badge || "HIGH-RETENTION SPECIALIST"}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl xl:text-[26px] min-[1400px]:text-3xl font-bold tracking-tight text-neutral-950 leading-tight">
                {siteSettings.role || hero.headline}
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-[340px] mx-auto md:mx-0">
                {hero.description}
              </p>
            </div>

            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-[#111111] hover:bg-neutral-800 text-white font-semibold text-xs px-6 py-3 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <span>Let&apos;s collaborate</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={onPlayShowreel}
                className="inline-flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-800 font-semibold text-xs px-5 py-3 rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-2xs active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Watch Showreel</span>
              </button>
            </div>
          </motion.div>

          {/* Center Clear Zone Preserving Cutout Portrait on Desktop */}
          <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />

          {/* Right Social Links Pill Stack */}
          <motion.div
            custom={0.28}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="md:col-span-6 lg:col-span-4 flex flex-col gap-2.5 w-full sm:w-auto md:items-end pointer-events-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col gap-2 w-full md:w-[255px]">
              {socialItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-neutral-200 bg-white px-4 py-2.5 flex items-center justify-between group hover:border-neutral-400 hover:bg-neutral-50 shadow-2xs transition-all duration-200"
                  >
                    <span className="flex items-center gap-2.5 text-xs font-medium text-neutral-800 group-hover:text-black">
                      <Icon
                        className={`w-3.5 h-3.5 text-neutral-500 transition-colors ${item.accent}`}
                      />
                      <span>{item.label}</span>
                    </span>
                    <span className="text-[11px] text-neutral-400 group-hover:text-neutral-700 font-mono transition-colors">
                      {item.handle}
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* 4 Crisp Architectural Metric Badges */}
        <motion.div
          custom={0.36}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-12 sm:mt-16 pt-8 border-t border-neutral-200/80 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {(hero.metrics || []).map((metric, idx) => (
            <div
              key={`${metric.label}-${idx}`}
              className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFB] border border-neutral-200/80 text-center hover:border-neutral-300 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
                {metric.value}
              </div>
              <div className="text-[11px] sm:text-xs text-neutral-500 mt-1 uppercase tracking-wider font-medium">
                {metric.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Interactive Official Showreel Cinema Monitor */}
        <motion.div
          id="showreel"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-12 rounded-3xl bg-[#141417] text-white border border-neutral-800 p-4 sm:p-6 shadow-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono tracking-widest text-zinc-300 uppercase">
                {hero.showreelSubtitle || "OFFICIAL SHOWREEL 2025"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] font-mono text-zinc-400">
              <span className="bg-zinc-900 border border-white/10 text-zinc-200 px-2.5 py-0.5 rounded-full font-semibold">
                {hero.showreelFormat || "4K 60FPS · PRORES 4444 XQ"}
              </span>
              <span className="hidden sm:inline text-zinc-500">
                {hero.showreelColorspace || "ACEScg"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onPlayShowreel}
            className="group relative w-full rounded-2xl overflow-hidden bg-black border border-white/10 aspect-video text-left cursor-pointer"
          >
            {hero.showreelCoverImage && (
              <img
                src={hero.showreelCoverImage}
                alt={hero.showreelTitle || "Official Showreel"}
                className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/50" />

            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-6 text-center">
              <p className="text-zinc-300 text-[10px] sm:text-xs font-mono tracking-[0.22em] uppercase mb-2">
                {siteSettings.specialties || "COMMERCIAL // LONG-FORM // SHORT-FORM"}
              </p>
              <h3 className="text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
                {hero.showreelTitle || "THE RHYTHM OF ATTENTION"}
              </h3>

              <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-black translate-x-0.5" />
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 pb-4 pt-8 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-2.5">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[42%] bg-white rounded-full" />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-300">
                <span>TC {hero.showreelTc || "01:14 / 02:48"}</span>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-zinc-400">
                  <Sliders className="w-3 h-3" />
                  STEREO MASTER · -14 LUFS
                </span>
                <span className="text-white font-semibold group-hover:underline">
                  PLAY REEL
                </span>
              </div>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
