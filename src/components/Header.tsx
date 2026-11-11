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
    { href: "#services", label: "Services", badge: `[${serviceCount}]` },
    { href: "#experience", label: "Experience", badge: "[7y+]" },
    { href: "#contact", label: "Contact", badge: null },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "px-4 md:px-8 py-3" : "px-4 md:px-8 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Availability Status Pill */}
        <a
          href="#contact"
          className="glass-nav rounded-full px-3.5 sm:px-4 py-2 flex items-center gap-2.5 shadow-lg hover:border-white/25 transition-colors max-w-[215px] sm:max-w-none"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accentGreen opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accentGreen" />
          </span>
          <span className="text-[11px] sm:text-xs font-semibold tracking-wide uppercase text-zinc-200 truncate">
            {siteSettings.availabilityStatus}
          </span>
        </a>

        {/* Center Floating Nav */}
        <nav className="hidden lg:flex items-center gap-1 glass-nav rounded-full px-4 py-1.5 shadow-lg">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-zinc-500 text-[11px] font-mono">
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
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full glass-nav text-zinc-400 hover:text-white hover:border-white/25 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>

          <a
            href="#contact"
            className="group bg-white hover:bg-zinc-200 text-black px-3.5 sm:px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-white/5 active:scale-95 whitespace-nowrap"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation"
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-full glass-nav text-zinc-200 hover:text-white transition-colors"
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
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden mt-3 max-w-7xl mx-auto glass-nav rounded-2xl p-4 shadow-2xl border border-white/10"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-xs font-mono text-zinc-500">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-xs font-mono text-zinc-400 hover:bg-white/10 hover:text-white border-t border-white/10 mt-1 pt-3"
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
