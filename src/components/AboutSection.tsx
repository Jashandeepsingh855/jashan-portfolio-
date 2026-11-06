"use client";

import React from "react";
import { AboutStat, SoftwareSkill } from "@/lib/data";
import { Check, ShieldCheck, Cpu } from "lucide-react";

interface AboutSectionProps {
  about: {
    badge: string;
    heading: string;
    subheading: string;
    portraitImage: string;
    bio: string[];
    stats: AboutStat[];
    softwareSkills: SoftwareSkill[];
  };
  name: string;
  location: string;
}

export default function AboutSection({ about, name, location }: AboutSectionProps) {
  return (
    <section className="w-full bg-surface-muted/60 py-24 border-y border-border-subtle" id="about">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="font-mono text-xs uppercase tracking-widest text-accent font-bold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent"></span>
          {about.badge || "03 / ABOUT ME"}
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold uppercase text-on-surface tracking-tight mb-16">
          {about.heading || "Good editing is more than cutting clips."}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Portrait Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-surface-pure p-3 rounded-3xl border border-border-subtle shadow-md">
              <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-surface-dark relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={about.portraitImage || "/portrait.png"}
                  alt={name || "Jashandeep Singh"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/80 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white font-mono text-xs">
                  <div className="font-bold text-sm tracking-tight">{name || "JASHANDEEP SINGH"}</div>
                  <div className="text-white/70 text-[11px] uppercase tracking-wider">
                    {location || "Toronto & Vancouver // Global Remote"}
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Note pill */}
            <div className="mt-4 p-4 bg-surface-pure rounded-2xl border border-border-subtle flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
              <div className="font-mono text-xs uppercase text-on-surface-muted">
                DEDICATED POST FACILITY: 10GBE LOCAL SAN, CALIBRATED OLED GRADING
              </div>
            </div>
          </div>

          {/* Right: Bio, Stats, and Skills */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 text-base md:text-lg text-on-surface leading-relaxed">
              {about.bio?.map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "font-semibold text-lg md:text-xl text-on-surface" : "text-on-surface-muted"}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Performance Metric Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border-subtle">
              {about.stats?.map((stat, idx) => (
                <div key={idx} className="bg-surface-pure p-5 rounded-2xl border border-border-subtle shadow-sm">
                  <span className="text-3xl sm:text-4xl font-extrabold text-accent font-sans block mb-1">
                    {stat.value}
                  </span>
                  <span className="font-mono text-xs uppercase text-on-surface font-bold block mb-1">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-on-surface-muted font-sans block">
                    {stat.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* Software Ecosystem & Mastery */}
            <div className="pt-6 border-t border-border-subtle">
              <div className="font-mono text-xs uppercase tracking-wider text-accent font-bold mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                TECHNICAL TOOLKIT &amp; CERTIFIED PIPELINE
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {about.softwareSkills?.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 bg-surface-pure rounded-xl border border-border-subtle hover:border-accent/40 transition-colors font-mono text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
                      <span className="font-bold text-on-surface uppercase">{skill.name}</span>
                    </div>
                    <span className="text-on-surface-muted uppercase text-[11px]">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
