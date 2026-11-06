"use client";

import React from "react";
import { ArrowDown, ArrowUpRight, Play, Volume2, Maximize, Film } from "lucide-react";

interface HeroProps {
  siteSettings: {
    availabilityStatus: string;
    specialties: string;
    suite: string;
    timelineFps: string;
    name: string;
  };
  hero: {
    badge: string;
    headlineLine1: string;
    headlineHighlight: string;
    headlineLine3: string;
    description: string;
    showreelTitle: string;
    showreelFormat: string;
    showreelTc: string;
    showreelColorspace: string;
    showreelVideoUrl: string;
    showreelCoverImage: string;
    hardwarePipeline: string[];
  };
  onPlayShowreel: () => void;
}

export default function Hero({ siteSettings, hero, onPlayShowreel }: HeroProps) {
  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12 pt-28 pb-20 overflow-hidden">
      {/* Live Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 mb-12 gap-3 bg-surface-pure rounded-xl border border-border-subtle shadow-sm">
        <div className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface font-semibold">
            {siteSettings.availabilityStatus || "AVAILABLE FOR COMMISSIONS"}
          </span>
          <span className="text-border-subtle mx-1 hidden sm:inline">•</span>
          <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wider text-accent font-medium">
            {siteSettings.specialties || "COMMERCIAL // CREATOR // NARRATIVE"}
          </span>
        </div>
        <div className="font-mono text-[11px] text-on-surface-muted uppercase tracking-widest flex items-center gap-4">
          <span>SUITE: {siteSettings.suite || "RESOLVE STUDIO 19"}</span>
          <span className="text-border-subtle hidden sm:inline">•</span>
          <span className="text-on-surface font-semibold hidden sm:inline">
            TIMELINE: {siteSettings.timelineFps || "24.000 FPS"}
          </span>
          <span className="inline-flex items-center gap-1 text-accent font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>REC
          </span>
        </div>
      </div>

      {/* Hero Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center mb-16">
        {/* Left Column: Sharp Studio Copy */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-surface-muted px-3.5 py-1.5 rounded-full border border-border-subtle self-start shadow-sm">
            <Film className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-on-surface font-semibold">
              {hero.badge || "JASHANDEEP SINGH // LEAD VIDEO EDITOR"}
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-extrabold uppercase text-on-surface tracking-tighter leading-[0.92]">
            {hero.headlineLine1 || "I EDIT."}
            <br />
            <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-8">
              {hero.headlineHighlight || "I SHAPE."}
            </span>
            <br />
            {hero.headlineLine3 || "I TELL STORIES."}
          </h1>

          <p className="text-lg md:text-xl text-on-surface-muted max-w-xl font-normal leading-relaxed">
            {hero.description ||
              "Crafting high-velocity commercial cuts, documentary narratives, and cultural stories with surgical rhythm, emotional depth, and cinematic punch."}
          </p>

          {/* Magnetic Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#work"
              className="inline-flex items-center gap-2.5 bg-surface-dark hover:bg-accent text-white font-mono text-xs uppercase tracking-wider font-semibold px-7 py-4 rounded-full transition-all shadow-md hover:shadow-xl hover:shadow-accent/25 group"
            >
              <span>EXPLORE WORK</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-surface-pure hover:bg-surface-muted text-on-surface font-mono text-xs uppercase tracking-wider font-semibold px-6 py-4 rounded-full border border-border-subtle hover:border-on-surface transition-all shadow-sm"
            >
              <span>BOOK AN EDIT / CONNECT</span>
              <ArrowUpRight className="w-4 h-4 text-accent" />
            </a>
          </div>

          {/* Pipeline Stack Pills */}
          <div className="pt-6 border-t border-border-subtle flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase text-on-surface-muted">
            <span className="font-semibold text-on-surface tracking-wider mr-1">HARDWARE PIPELINE:</span>
            {hero.hardwarePipeline?.map((tool, idx) => (
              <span
                key={idx}
                className={
                  tool.includes("ACES")
                    ? "px-2.5 py-1 rounded-md bg-accent-glow text-accent font-semibold border border-accent/20"
                    : "px-2.5 py-1 rounded-md bg-surface-pure border border-border-subtle text-on-surface font-medium"
                }
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: High-Tech Editor Showcase Card */}
        <div className="lg:col-span-5 relative">
          <div className="relative bg-surface-pure p-3 rounded-3xl shadow-xl shadow-slate-200/60 border border-border-subtle overflow-hidden group">
            {/* Card Header HUD */}
            <div className="flex items-center justify-between px-3 py-2 bg-surface-muted rounded-2xl text-on-surface-muted font-mono text-[11px] uppercase mb-3">
              <span className="inline-flex items-center gap-1.5 font-bold text-on-surface">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                {hero.showreelTitle || "2025 SHOWREEL // SELECTED WORKS"}
              </span>
              <span className="text-on-surface-subtle">PRORES CONFORM</span>
            </div>

            {/* Sub-bar */}
            <div className="flex items-center justify-between px-2 text-on-surface-muted text-xs">
              <div className="flex items-center gap-2 font-mono">
                <span className="text-on-surface font-bold text-[11px]">ACTIVE MONITOR 01</span>
                <span className="hidden sm:inline text-border-subtle">|</span>
                <span className="hidden sm:inline font-mono text-on-surface text-[11px]">
                  {hero.showreelFormat || "4K DCI // PRORES 4444 XQ"}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-on-surface font-semibold bg-white px-2 py-0.5 rounded-md border border-border-subtle text-[10px]">
                  {hero.showreelTc || "TC [00:01:42:18]"}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-accent text-white font-bold text-[10px]">
                  {hero.showreelColorspace || "ACEScc"}
                </span>
              </div>
            </div>

            {/* Video Display Container */}
            <div
              onClick={onPlayShowreel}
              className="relative w-full aspect-video rounded-2xl bg-surface-dark overflow-hidden group mt-3 cursor-pointer shadow-inner"
            >
              {/* Cover Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.showreelCoverImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuDckJkF64scxM5EChWslou80YpCIhPbiFu9jusxZqSqyvA4ARZgyIclm2pb9Nzxrk6Ncj3ckDG_vcu-dIl_UJtnPLCDUccAj1fDAwJDzYAyBpjIkyJalWAdZLxAZqGl8b3vNunp1cHvi3McklhurPi3rSvycFmaQH_oICJwjXRxz0Jj_kE0Dauypr04upDoHfGzYcajraIWZlr4cx3FfctxFrx4foLdWcKUgorY7kI"}
                alt="Cinematic Showreel Preview"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 via-surface-dark/30 to-transparent pointer-events-none" />

              {/* Central Modern Play Trigger Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  aria-label="Play Showreel"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/95 text-surface-dark backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-2xl relative"
                >
                  <Play className="w-8 h-8 ml-1 fill-current" />
                  <div className="absolute -inset-2 rounded-full border border-white/30 animate-pulse pointer-events-none" />
                </button>
              </div>

              {/* Sleek Glass HUD Transport Controls (Bottom) */}
              <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col gap-2 bg-gradient-to-t from-surface-dark to-transparent">
                {/* Scrubber Bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[58%] bg-accent"></div>
                </div>

                {/* Transport Info Row */}
                <div className="flex items-center justify-between text-white font-mono text-[11px] uppercase pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-accent font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping"></span>
                      ACTIVE CUT // 23.976 FPS
                    </span>
                    <span className="hidden md:inline text-white/30">|</span>
                    <span className="hidden md:inline text-white/80">AUDIO: 48 KHZ 24-BIT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-white/10 hover:bg-white/20">
                      <Volume2 className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span className="p-1 rounded bg-white/10 hover:bg-white/20">
                      <Maximize className="w-3.5 h-3.5 text-white" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Card Metadata Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 bg-surface-muted p-4 rounded-2xl gap-4 font-mono text-xs uppercase mt-3">
              <div>
                <span className="text-on-surface-muted block text-[10px]">EDITOR / COLOURIST</span>
                <span className="text-on-surface font-semibold">{siteSettings.name || "JASHANDEEP SINGH"}</span>
              </div>
              <div>
                <span className="text-on-surface-muted block text-[10px]">PRIMARY NLE</span>
                <span className="text-on-surface font-semibold">{siteSettings.suite || "DAVINCI RESOLVE"}</span>
              </div>
              <div>
                <span className="text-on-surface-muted block text-[10px]">DELIVERY COLORSPACE</span>
                <span className="text-on-surface font-semibold">{hero.showreelColorspace || "ACEScc / DCI-P3"}</span>
              </div>
              <div className="text-right flex items-center justify-end">
                <a
                  href="#work"
                  className="text-accent hover:text-on-surface transition-colors font-bold tracking-wider inline-flex items-center gap-1"
                >
                  EXPLORE <ArrowDown className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
