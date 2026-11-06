"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Shield } from "lucide-react";

interface FooterProps {
  name: string;
  role: string;
  year: string;
  footerNote: string;
}

export default function Footer({ name, role, year, footerNote }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-surface-pure border-t border-border-subtle pt-20 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-12 border-b border-border-subtle gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-dark flex items-center justify-center font-mono font-bold text-white text-sm shadow-sm">
              JS
            </div>
            <div>
              <span className="font-extrabold text-lg uppercase tracking-tight text-on-surface block">
                {name || "JASHANDEEP SINGH"}
              </span>
              <span className="font-mono text-xs text-on-surface-muted uppercase tracking-wider block">
                {role || "LEAD VIDEO EDITOR & FILMMAKER"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider font-semibold">
            <a href="#work" className="text-on-surface-muted hover:text-accent transition-colors">
              WORK
            </a>
            <a href="#about" className="text-on-surface-muted hover:text-accent transition-colors">
              ABOUT
            </a>
            <a href="#services" className="text-on-surface-muted hover:text-accent transition-colors">
              SERVICES
            </a>
            <a href="#process" className="text-on-surface-muted hover:text-accent transition-colors">
              PROCESS
            </a>
            <a href="#contact" className="text-on-surface-muted hover:text-accent transition-colors">
              CONTACT
            </a>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-surface-muted hover:bg-surface-dark hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-on-surface-muted">
          <div>
            &copy; {year || "2025"} {name || "Jashandeep Singh"}. All rights reserved. {footerNote && `// ${footerNote}`}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-on-surface-subtle">ACES 1.3 / DCI-P3 WORKFLOW</span>
            <span className="text-border-subtle">•</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-on-surface-subtle hover:text-accent transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Studio Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
