"use client";

import { RarityBadge } from "./RarityBadge";

interface CardFrameProps {
  rarity: string;
  tokenSymbol: string;
  tokenAmount: string;
  valueUsd: number;
  imageUrl?: string;
}

export function CardFrame({ rarity, tokenSymbol, tokenAmount, valueUsd }: CardFrameProps) {
  return (
    <div className="relative w-full max-w-[280px] aspect-[2.5/3.5] rounded-2xl overflow-hidden border-2 border-white/20 bg-poke-surface shadow-xl">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start z-10">
        <RarityBadge rarity={rarity} />
        <div className="text-right">
          <div className="text-xs text-slate-400">Value</div>
          <div className="font-bold text-poke-yellow">${valueUsd.toFixed(2)}</div>
        </div>
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pt-16">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-poke-yellow/30 to-poke-red/30 border-2 border-poke-yellow/50 flex items-center justify-center mb-4">
          <span className="text-2xl font-black text-poke-yellow">{tokenSymbol.slice(0, 3)}</span>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold">{tokenSymbol}</div>
          <div className="text-slate-400 text-sm mt-1">{tokenAmount}</div>
        </div>
      </div>

      {/* Bottom brand */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/40 text-center">
        <span className="text-xs font-bold tracking-widest text-poke-yellow">POKE RIPS</span>
      </div>
    </div>
  );
}