"use client";

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
    <footer className="w-full border-t border-neutral-100 bg-background py-8 px-4 sm:px-8 md:px-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#111111] text-white text-xs font-semibold">
            <img
              src="/portrait-cutout.png"
              alt={siteSettings.name}
              className="w-5 h-5 rounded-full object-cover object-top bg-white"
            />
            <span>{siteSettings.name}</span>
          </div>
          <span className="text-xs text-neutral-500">
            {siteSettings.footerNote ||
              "Engineered for maximum visual retention."}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-600">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-black transition-colors"
            >
              {social.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-neutral-500">
          <span>
            &copy; {siteSettings.year || "2025"} {siteSettings.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
