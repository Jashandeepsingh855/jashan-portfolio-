"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import type { SiteSettings } from "@/lib/data";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

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

  const navItems = useMemo(
    () => [
      { href: "#work", id: "work", label: "Work", badge: `[${projectCount}]` },
      {
        href: "#services",
        id: "services",
        label: "Service",
        badge: `[${serviceCount}]`,
      },
      {
        href: "#experience",
        id: "experience",
        label: "Experience",
        badge: "[7y+]",
      },
      { href: "#contact", id: "contact", label: "Contact", badge: null },
    ],
    [projectCount, serviceCount]
  );

  const [activeNavLabel, setActiveNavLabel] = useState(navItems[0].label);
  const manualClickUntilRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);

      if (Date.now() < manualClickUntilRef.current) return;

      const threshold = window.scrollY + 180;
      let currentLabel = navItems[0].label;

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (threshold >= top) {
            currentLabel = item.label;
          }
        }
      }

      setActiveNavLabel(currentLabel);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [navItems]);

  return (
    <header
      className={`sticky top-0 z-[80] w-full transition-all duration-300 px-4 sm:px-6 lg:px-10 xl:px-12 ${
        scrolled
          ? "py-3.5 bg-background/90 backdrop-blur-xl border-b border-neutral-200/80 shadow-xs"
          : "pt-5 sm:pt-6 pb-3 bg-background/95 backdrop-blur-md border-b border-neutral-100"
      }`}
    >
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* Availability Status Pill */}
        <motion.a
          href="#contact"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass-pill rounded-full px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-2.5 shadow-2xs hover:border-neutral-300 transition-colors max-w-[195px] md:max-w-[175px] lg:max-w-none shrink-0"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accentGreen opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accentGreen" />
          </span>
          <span className="text-[11px] sm:text-xs font-medium tracking-tight text-neutral-800 truncate">
            {siteSettings.availabilityStatus}
          </span>
        </motion.a>

        {/* Center Animated Clip-Path Pill Navigation */}
        <motion.nav
          aria-label="Primary Navigation"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:flex items-center"
        >
          <AnimatedTabs
            tabs={navItems}
            activeTab={activeNavLabel}
            onTabChange={(tab) => {
              manualClickUntilRef.current = Date.now() + 900;
              setActiveNavLabel(tab.label);
            }}
          />
        </motion.nav>

        {/* Right Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 sm:gap-2.5 shrink-0"
        >
          <a
            href="#contact"
            className="group bg-[#111111] hover:bg-neutral-800 text-white px-3.5 sm:px-4 lg:px-5 py-2.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap"
          >
            <span>Let&apos;s Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </motion.div>
      </div>

      {/* Mobile / Tablet Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden mt-3 bg-white rounded-2xl p-3 shadow-xl border border-neutral-200"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeNavLabel === item.label;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => {
                      manualClickUntilRef.current = Date.now() + 900;
                      setActiveNavLabel(item.label);
                      setMobileMenuOpen(false);
                    }}
                    className={`relative flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="mobileNavActivePill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                        className="absolute inset-0 rounded-xl bg-[#111111]"
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`relative z-10 text-xs font-mono ${
                          isActive ? "text-zinc-300" : "text-neutral-400"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
