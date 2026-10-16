"use client";

import { cn } from "@/lib/utils";

const rarityStyles: Record<string, string> = {
  Common: "bg-slate-600 text-slate-200",
  Uncommon: "bg-emerald-700 text-emerald-100",
  Rare: "bg-blue-600 text-blue-100",
  "Ultra Rare": "bg-purple-600 text-purple-100",
  "Secret Rare": "bg-gradient-to-r from-pink-500 to-yellow-400 text-black",
  Legendary: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-black",
};

export function RarityBadge({ rarity }: { rarity: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",
        rarityStyles[rarity] || "bg-slate-700 text-white"
      )}
    >
      {rarity}
    </span>
  );
}