"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedTabItem {
  label: string;
  href?: string;
  badge?: string | null;
}

export interface AnimatedTabsProps {
  tabs: AnimatedTabItem[];
  activeTab?: string;
  onTabChange?: (tab: AnimatedTabItem) => void;
  className?: string;
}

export function AnimatedTabs({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  className,
}: AnimatedTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    tabs[0]?.label || ""
  );
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);

  const activeTab = controlledActiveTab ?? internalActiveTab;
  const visualTab = hoveredTab ?? activeTab;

  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});

  const updateClipPath = useCallback(() => {
    const container = containerRef.current;
    const targetElement = tabRefs.current[visualTab];

    if (!container || !targetElement || !container.offsetWidth) return;

    const { offsetLeft, offsetWidth } = targetElement;
    const totalWidth = container.offsetWidth;
    const leftPct = Math.max(0, (offsetLeft / totalWidth) * 100);
    const rightPct = Math.max(
      0,
      100 - ((offsetLeft + offsetWidth) / totalWidth) * 100
    );

    container.style.clipPath = `inset(0 ${rightPct.toFixed(2)}% 0 ${leftPct.toFixed(2)}% round 9999px)`;
    setHasMeasured(true);
  }, [visualTab]);

  useEffect(() => {
    updateClipPath();
    const container = containerRef.current;

    let observer: ResizeObserver | null = null;
    if (container && typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => updateClipPath());
      observer.observe(container);
    }

    const onResize = () => updateClipPath();
    window.addEventListener("resize", onResize);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(updateClipPath).catch(() => {});
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [visualTab, tabs, updateClipPath]);

  if (tabs.length === 0) return null;

  const handleSelect = (tab: AnimatedTabItem) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tab.label);
    }
    setHoveredTab(null);
    onTabChange?.(tab);
  };

  return (
    <div
      onMouseLeave={() => setHoveredTab(null)}
      className={cn(
        "relative bg-secondary/75 border border-primary/10 mx-auto flex w-fit items-center rounded-full p-1",
        className
      )}
    >
      <div className="relative flex items-center">
        {/* Top Clipped Contrast Layer (Smooth Hover + Active Clip-Path Pill) */}
        <div
          ref={containerRef}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 z-10 overflow-hidden [clip-path:inset(0_100%_0_0_round_9999px)]",
            hasMeasured &&
              "[transition:clip-path_0.3s_cubic-bezier(0.22,1,0.36,1)]"
          )}
        >
          <div className="relative flex w-full items-center bg-primary rounded-full">
            {tabs.map((tab, index) => (
              <span
                key={`overlay-${tab.label}-${index}`}
                className="flex h-8 items-center gap-1.5 rounded-full px-2.5 lg:px-3 xl:px-3.5 text-xs xl:text-[13px] font-medium text-primary-foreground whitespace-nowrap select-none"
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="hidden lg:inline text-[10.5px] font-mono font-normal opacity-75">
                    {tab.badge}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Base Layer */}
        <div className="relative flex items-center">
          {tabs.map((tab, index) => {
            const itemClass =
              "flex h-8 items-center gap-1.5 cursor-pointer rounded-full px-2.5 lg:px-3 xl:px-3.5 text-xs xl:text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap";

            if (tab.href) {
              return (
                <a
                  key={`tab-${tab.label}-${index}`}
                  href={tab.href}
                  ref={(el) => {
                    tabRefs.current[tab.label] = el;
                  }}
                  onMouseEnter={() => setHoveredTab(tab.label)}
                  onFocus={() => setHoveredTab(tab.label)}
                  onBlur={() => setHoveredTab(null)}
                  onClick={() => handleSelect(tab)}
                  className={itemClass}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="hidden lg:inline text-[10.5px] font-mono font-normal text-neutral-600">
                      {tab.badge}
                    </span>
                  )}
                </a>
              );
            }

            return (
              <button
                key={`tab-${tab.label}-${index}`}
                type="button"
                ref={(el) => {
                  tabRefs.current[tab.label] = el;
                }}
                onMouseEnter={() => setHoveredTab(tab.label)}
                onFocus={() => setHoveredTab(tab.label)}
                onBlur={() => setHoveredTab(null)}
                onClick={() => handleSelect(tab)}
                className={itemClass}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="hidden lg:inline text-[10.5px] font-mono font-normal text-neutral-600">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AnimatedTabs;
