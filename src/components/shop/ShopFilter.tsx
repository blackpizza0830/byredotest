"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FILTERS = ["ALL", "BODY", "HAIR PERFUME", "CANDLE", "READY-TO-WEAR", "GIFT SET"] as const;
type Filter = (typeof FILTERS)[number];

interface ShopFilterProps {
  onFilterChange?: (filter: string) => void;
}

export function ShopFilter({ onFilterChange }: ShopFilterProps): React.JSX.Element {
  const [active, setActive] = useState<Filter>("ALL");
  const [open, setOpen] = useState(false);

  const handleSelect = (filter: Filter): void => {
    setActive(filter);
    setOpen(false);
    onFilterChange?.(filter);
  };

  return (
    <div className="flex items-start justify-between mb-10">
      {/* Filter toggle button */}
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-black hover:opacity-60 transition-opacity"
        >
          <span>Filter</span>
          {active !== "ALL" && (
            <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />
          )}
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            className={cn("transition-transform duration-200", open && "rotate-180")}
          >
            <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="1" strokeLinecap="round" />
          </svg>
        </button>

        {open && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-black/10 z-20 min-w-[180px] py-1">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => handleSelect(filter)}
                className={cn(
                  "w-full text-left px-4 py-2 text-[10px] tracking-[0.14em] uppercase transition-colors duration-150",
                  active === filter
                    ? "text-black font-medium"
                    : "text-black/50 hover:text-black"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active filter pill */}
      {active !== "ALL" && (
        <button
          onClick={() => handleSelect("ALL")}
          className="flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase border border-black/20 px-3 py-1 hover:border-black transition-colors duration-150"
        >
          {active}
          <span className="text-black/40">×</span>
        </button>
      )}
    </div>
  );
}
