"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { cn } from "@/lib/utils";
import { RipModal } from "./RipModal";

interface Pack {
  id: string;
  name: string;
  description: string;
  minPrize: number;
  maxPrize: number;
  priceSol: number;
  color?: string;
}

export function PackCard({ pack }: { pack: Pack }) {
  const { connected } = useWallet();
  const [ripOpen, setRipOpen] = useState(false);

  const handleRip = () => {
    if (!connected) return;
    setRipOpen(true);
  };

  return (
    <>
      <div className="bg-poke-surface rounded-2xl border border-white/10 overflow-hidden hover:border-poke-yellow/40 transition-all duration-300 group hover:-translate-y-1">
        <div
          className={cn(
            "aspect-[3/4] relative flex items-center justify-center bg-gradient-to-b",
            pack.color || "from-slate-800 to-slate-950"
          )}
        >
          <div className="relative w-28 h-28 rounded-full border-[5px] border-poke-yellow bg-gradient-to-b from-poke-yellow via-white to-poke-red shadow-2xl shadow-poke-yellow/20 group-hover:scale-105 transition-transform">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[5px] bg-poke-navy" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-white border-[5px] border-poke-navy" />
            </div>
          </div>

          <div className="absolute bottom-5 left-0 right-0 text-center">
            <span className="text-xs font-black tracking-[0.2em] text-poke-yellow uppercase drop-shadow">
              {pack.name}
            </span>
          </div>

          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg mb-1">{pack.name}</h3>
          <p className="text-slate-400 text-sm mb-4">{pack.description}</p>

          <div className="flex justify-between text-sm mb-5">
            <div>
              <div className="text-slate-500 text-xs mb-0.5">Min Prize</div>
              <div className="font-semibold">${pack.minPrize}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-500 text-xs mb-0.5">Max Pull</div>
              <div className="font-semibold text-poke-yellow">
                ${pack.maxPrize.toLocaleString()}
              </div>
            </div>
          </div>

          <button
            onClick={handleRip}
            disabled={!connected}
            className="w-full py-3.5 rounded-xl bg-poke-yellow text-black font-bold hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {connected ? `Rip for ${pack.priceSol} SOL` : "Connect wallet to rip"}
          </button>
        </div>
      </div>

      <RipModal
        open={ripOpen}
        onClose={() => setRipOpen(false)}
        packName={pack.name}
      />
    </>
  );
}