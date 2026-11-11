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
  hidden: { opacity: 0, y: 22 },
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
      accent: "group-hover:text-red-400",
    },
    {
      label: "Instagram",
      handle: siteSettings.socials.instagramHandle || "@jashan.cuts",
      href: siteSettings.socials.instagram,
      icon: Instagram,
      accent: "group-hover:text-pink-400",
    },
    {
      label: "LinkedIn",
      handle: siteSettings.socials.linkedinHandle || "/in/jashandeep",
      href: siteSettings.socials.linkedin,
      icon: Linkedin,
      accent: "group-hover:text-sky-400",
    },
    {
      label: "Behance",
      handle: siteSettings.socials.behanceHandle || "Showcases",
      href: siteSettings.socials.behance,
      icon: Layers,
      accent: "group-hover:text-blue-400",
    },
    {
      label: "X / Twitter",
      handle: siteSettings.socials.xHandle || "@jashanedit",
      href: siteSettings.socials.x,
      icon: Twitter,
      accent: "group-hover:text-white",
    },
  ].filter((item) => Boolean(item.href));

  return (
    <section className="relative pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050505]">
      {/* Studio Ambient Rim Light */}
      <div className="pointer-events-none absolute top-28 left-1/2 -translate-x-1/2 w-[min(780px,92vw)] h-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.11)_0%,rgba(63,63,70,0.06)_45%,transparent_72%)] blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        {/* Continuous Unbroken Outlined Wordmark + Centered Cutout Portrait */}
        <div className="relative w-full max-w-full overflow-hidden flex flex-col items-center justify-center min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="text-outline font-display font-extrabold uppercase select-none pointer-events-none whitespace-nowrap text-center z-0 leading-[0.9] tracking-[0.015em] sm:tracking-[0.03em]"
            style={{
              fontSize: "clamp(1.32rem, 6.15vw, 5.75rem)",
            }}
          >
            {wordmark}
          </motion.h1>

          {/* Centered Transparent Cutout Portrait Overlapping Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative z-10 -mt-3 sm:-mt-6 md:-mt-9 lg:-mt-12 flex flex-col items-center pointer-events-none max-w-full"
          >
            <div className="relative w-[225px] sm:w-[290px] md:w-[330px] lg:w-[380px] flex justify-center">
              <img
                src={hero.portraitImage || "/portrait-cutout.png"}
                alt={`${siteSettings.name} — ${siteSettings.role}`}
                className="w-full h-auto max-h-[320px] sm:max-h-[390px] lg:max-h-[440px] object-contain object-bottom drop-shadow-[0_24px_55px_rgba(0,0,0,0.95)]"
              />
              {/* Bottom studio dissolve mask into #050505 canvas */}
              <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent" />
            </div>

            {/* Subtle Telemetry Badge Anchored Below Portrait Bust */}
            <div className="pointer-events-auto -mt-4 sm:-mt-5 glass-nav rounded-2xl sm:rounded-full px-3.5 sm:px-4 py-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 shadow-2xl border border-white/10 max-w-full">
              <span className="flex items-center gap-1.5 text-center">
                <Film className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                  {hero.portraitStatLabel || "TOTAL REACH"}:
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-white">
                  {hero.portraitStatValue || "120M+ Views Driven"}
                </span>
              </span>
              {hero.portraitStatBadge && (
                <span className="text-[10px] sm:text-[11px] font-mono font-semibold text-accentGreen bg-accentGreen/10 px-2 py-0.5 rounded-full">
                  {hero.portraitStatBadge}
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Aligned Flanking Side Copy (Left) & Social Links Stack (Right) */}
        <div className="relative z-20 mt-8 md:mt-6 lg:-mt-40 grid grid-cols-1 md:grid-cols-12 items-end gap-8 pointer-events-none min-w-0">
          {/* Left Side Info & CTAs */}
          <motion.div
            custom={0.2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="md:col-span-6 lg:col-span-4 space-y-4 text-center md:text-left pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-[#121215]/90 text-[10px] sm:text-[11px] font-mono tracking-wider uppercase text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{hero.badge || "HIGH-RETENTION SPECIALIST"}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                {siteSettings.role || hero.headline}
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
                {hero.description}
              </p>
            </div>

            <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-black font-bold text-xs px-6 py-3 rounded-full hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                <span>Let&apos;s collaborate</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={onPlayShowreel}
                className="inline-flex items-center justify-center gap-2 glass-pill text-zinc-200 font-semibold text-xs px-5 py-3 rounded-full hover:bg-zinc-800/90 hover:text-white transition-all active:scale-95"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Watch Showreel</span>
              </button>
            </div>
          </motion.div>

          {/* Center Clear Zone Preserving Portrait on Desktop */}
          <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />

          {/* Right Social Links Pill Stack */}
          <motion.div
            custom={0.28}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="md:col-span-6 lg:col-span-4 flex flex-col gap-2.5 w-full sm:w-auto md:items-end pointer-events-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col gap-2 w-full md:w-[270px]">
              {socialItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-pill rounded-full px-4 py-2.5 flex items-center justify-between group hover:border-white/25 hover:bg-zinc-800/75 transition-all duration-200"
                  >
                    <span className="flex items-center gap-2.5 text-xs font-medium text-zinc-300 group-hover:text-white">
                      <Icon
                        className={`w-3.5 h-3.5 text-zinc-400 transition-colors ${item.accent}`}
                      />
                      <span>{item.label}</span>
                    </span>
                    <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 font-mono transition-colors">
                      {item.handle}
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* 4 Obsidian Metric Badges Row */}
        <motion.div
          custom={0.36}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-12 sm:mt-16 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {(hero.metrics || []).map((metric, idx) => (
            <div
              key={`${metric.label}-${idx}`}
              className="p-4 sm:p-5 rounded-2xl bg-[#0e0e11] border border-white/[0.08] text-center hover:border-white/20 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {metric.value}
              </div>
              <div className="text-[11px] sm:text-xs text-zinc-400 mt-1 uppercase tracking-wider font-medium">
                {metric.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Interactive Official Showreel Player Pod */}
        <motion.div
          id="showreel"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-16 rounded-3xl bg-[#0b0b0e] border border-white/10 p-4 sm:p-6 shadow-2xl"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/50" />

            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center p-6 text-center">
              <p className="text-zinc-400 text-[10px] sm:text-xs font-mono tracking-[0.22em] uppercase mb-2">
                {siteSettings.specialties || "COMMERCIAL // LONG-FORM // SHORT-FORM"}
              </p>
              <h3 className="text-xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
                {hero.showreelTitle || "THE RHYTHM OF ATTENTION"}
              </h3>

              <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-black translate-x-0.5" />
              </div>
            </div>

            {/* Decorative Studio Player Bar */}
            <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 pb-4 pt-8 bg-gradient-to-t from-black/95 to-transparent flex flex-col gap-2.5">
              <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
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
