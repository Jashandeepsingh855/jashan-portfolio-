"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StackedSectionProps {
  anchorId?: string;
  children: React.ReactNode;
  className?: string;
  withCurtainShadow?: boolean;
}

/**
 * Sticky full-bleed curtain layer for stacked page scrolling.
 * Short or 100vh sections stick flush at top-0; taller sections scroll
 * completely through their content before locking at their bottom edge.
 */
export function StackedSection({
  anchorId,
  children,
  className,
  withCurtainShadow = true,
}: StackedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateTop = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const height = el.getBoundingClientRect().height;
      const excess = height - vh;
      setStickyTop(excess > 2 ? -Math.ceil(excess) : 0);
    };

    updateTop();

    const observer = new ResizeObserver(updateTop);
    observer.observe(el);
    window.addEventListener("resize", updateTop, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTop);
    };
  }, []);

  return (
    <>
      {anchorId && (
        <div
          id={anchorId}
          aria-hidden="true"
          className="h-0 w-full scroll-mt-0 pointer-events-none"
        />
      )}
      <div
        ref={ref}
        style={{ top: `${stickyTop}px` }}
        className={cn(
          "sticky top-0 min-h-screen w-full bg-background flex flex-col",
          withCurtainShadow &&
            "border-t border-neutral-200/80 shadow-[0_-24px_60px_-15px_rgba(0,0,0,0.08)]",
          className
        )}
      >
        {children}
      </div>
    </>
  );
}
