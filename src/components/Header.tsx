"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Lock, Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/data";

interface HeaderProps {
  siteSettings: SiteSettings;
  projectCount: number;
  serviceCount: number;
}

export default function Header({
  siteSettings,
  projectCount,
  serviceCount,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "#work", label: "Work", badge: `[${projectCount}]` },
    { href: "#services", label: "Service", badge: `[${serviceCount}]` },
    { href: "#experience", label: "Experience", badge: "[7y+]" },
    { href: "#contact", label: "Contact", badge: null },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 px-4 sm:px-8 md:px-12 ${
        scrolled
          ? "py-3.5 bg-white/90 backdrop-blur-xl border-b border-neutral-200/80 shadow-xs"
          : "pt-6 sm:pt-8 pb-3 bg-white/80 backdrop-blur-md rounded-t-[24px] sm:rounded-t-[34px]"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Availability Status Pill */}
        <a
          href="#contact"
          className="glass-pill rounded-full px-3.5 sm:px-4 py-2 flex items-center gap-2.5 shadow-2xs hover:border-neutral-300 transition-colors max-w-[205px] sm:max-w-none"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accentGreen opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accentGreen" />
          </span>
          <span className="text-[11px] sm:text-xs font-medium tracking-tight text-neutral-800 truncate">
            {siteSettings.availabilityStatus}
          </span>
        </a>

        {/* Center Clean Nav Links (Matching 1.webp & Jashandeep Stitch) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13.5px] font-medium text-neutral-600 hover:text-black transition-colors flex items-center gap-1.5 group"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-neutral-400 group-hover:text-neutral-600 text-[11px] font-mono font-normal">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <Link
            href="/admin"
            aria-label="Open Studio Admin Portal"
            title="Studio Admin"
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 bg-white text-neutral-500 hover:text-black hover:border-neutral-300 transition-colors shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>

          <a
            href="#contact"
            className="group bg-[#111111] hover:bg-neutral-800 text-white px-4 sm:px-5 py-2.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation"
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mt-3 bg-white rounded-2xl p-3 shadow-xl border border-neutral-200"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-neutral-800 hover:bg-neutral-100 transition-colors"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-mono text-neutral-400">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono text-neutral-500 hover:bg-neutral-100 hover:text-black border-t border-neutral-100 mt-1 pt-3"
              >
                <span className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  STUDIO ADMIN PORTAL
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
