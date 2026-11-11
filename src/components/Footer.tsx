"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteSettings } from "@/lib/data";

interface FooterProps {
  siteSettings: SiteSettings;
}

export default function Footer({ siteSettings }: FooterProps) {
  const socialLinks = [
    { label: "YouTube", href: siteSettings.socials.youtube },
    { label: "Instagram", href: siteSettings.socials.instagram },
    { label: "LinkedIn", href: siteSettings.socials.linkedin },
    { label: "Behance", href: siteSettings.socials.behance },
    { label: "X / Twitter", href: siteSettings.socials.x },
    { label: "Vimeo", href: siteSettings.socials.vimeo },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="border-t border-white/10 bg-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="font-display font-extrabold text-sm tracking-[0.14em] uppercase text-white">
            {siteSettings.wordmark || "JASHANDEEP"}
          </span>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <span className="text-xs text-zinc-500">
            {siteSettings.footerNote ||
              "Engineered for maximum visual retention."}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
            >
              {social.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
          <span>
            &copy; {siteSettings.year || "2025"} {siteSettings.name}
          </span>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <span>Admin</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
