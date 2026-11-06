"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowUpRight, Shield } from "lucide-react";

interface HeaderProps {
  name: string;
  role: string;
  year: string;
  isAdmin?: boolean;
}

export default function Header({ name, role, year, isAdmin }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-border-subtle/80 transition-all">
      <div className="h-20 max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-surface-dark flex items-center justify-center font-mono font-bold text-white text-xs group-hover:bg-accent transition-colors shadow-sm">
            JS
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-on-surface uppercase group-hover:text-accent transition-colors">
              {name || "JASHANDEEP SINGH"}
            </span>
            <span className="font-mono text-[10px] tracking-widest uppercase text-on-surface-muted">
              {role || "DIRECTOR & EDIT"} // {year || "2025"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-mono tracking-wider font-semibold uppercase">
            <a
              href="#"
              className="text-accent flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
              HOME
            </a>
            <a
              href="#work"
              className="text-on-surface-muted hover:text-on-surface transition-colors"
            >
              WORK
            </a>
            <a
              href="#about"
              className="text-on-surface-muted hover:text-on-surface transition-colors"
            >
              ABOUT
            </a>
            <a
              href="#services"
              className="text-on-surface-muted hover:text-on-surface transition-colors"
            >
              SERVICES
            </a>
            <a
              href="#process"
              className="text-on-surface-muted hover:text-on-surface transition-colors"
            >
              PROCESS
            </a>
            <a
              href="#contact"
              className="text-on-surface-muted hover:text-on-surface transition-colors"
            >
              CONTACT
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 bg-surface-dark hover:bg-accent text-white font-mono text-xs uppercase tracking-wider font-semibold px-4 py-2.5 rounded-full transition-all shadow-sm group"
            >
              <span>BOOK AN EDIT</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-[11px] font-mono uppercase px-3 py-2 rounded-full border border-border-subtle bg-surface-pure hover:border-accent hover:text-accent transition-colors text-on-surface-muted"
              title="Admin Portal"
            >
              <Shield className="w-3 h-3 text-accent" />
              <span className="hidden lg:inline">{isAdmin ? "Dashboard" : "Admin"}</span>
            </Link>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg bg-surface-muted border border-border-subtle flex items-center justify-center text-on-surface"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-pure border-b border-border-subtle px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 font-mono text-sm uppercase tracking-wider font-semibold">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="text-accent flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              HOME
            </a>
            <a
              href="#work"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface hover:text-accent transition-colors"
            >
              WORK
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface hover:text-accent transition-colors"
            >
              ABOUT
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface hover:text-accent transition-colors"
            >
              SERVICES
            </a>
            <a
              href="#process"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface hover:text-accent transition-colors"
            >
              PROCESS
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-surface hover:text-accent transition-colors"
            >
              CONTACT
            </a>
            <div className="pt-4 border-t border-border-subtle flex flex-col gap-3">
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-accent text-white py-3 rounded-xl font-mono text-xs uppercase font-bold"
              >
                BOOK AN EDIT
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-surface-muted text-on-surface py-2.5 rounded-xl font-mono text-xs uppercase font-bold border border-border-subtle flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-accent" />
                ADMIN PORTAL
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
