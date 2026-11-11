"use client";

import React from "react";

export const ADMIN_INPUT_CLS =
  "w-full rounded-xl bg-white border border-neutral-200 px-3.5 py-2.5 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors";

export const ADMIN_COMPACT_INPUT_CLS =
  "w-full rounded-xl bg-white border border-neutral-200 px-3 py-2 text-sm text-neutral-950 placeholder-neutral-400 focus:outline-none focus:border-black transition-colors";

export function AdminCard({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-[#FAFAFB] border border-neutral-200/90 p-5 sm:p-7 space-y-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200/80 pb-4">
        <div>
          {eyebrow && (
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-1">
              {eyebrow}
            </p>
          )}
          <h2 className="text-lg font-bold tracking-tight text-neutral-950 uppercase">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
