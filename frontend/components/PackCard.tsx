"use client";

import { useWallet } from "@solana/wallet-adapter-react";

interface Pack {
  id: string;
  name: string;
  description: string;
  minPrize: number;
  maxPrize: number;
  priceSol: number;
}

export function PackCard({ pack }: { pack: Pack }) {
  const { connected } = useWallet();

  return (
    <div className="bg-poke-surface rounded-2xl border border-white/10 overflow-hidden hover:border-poke-yellow/50 transition-all group">
      <div className="aspect-[3/4] bg-gradient-to-b from-poke-navy/40 to-poke-bg flex items-center justify-center relative">
        <div className="w-32 h-32 rounded-full border-4 border-poke-yellow bg-gradient-to-b from-poke-yellow to-poke-red flex items-center justify-center shadow-lg shadow-poke-yellow/20">
          <div className="w-10 h-10 rounded-full bg-white border-4 border-poke-navy" />
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="text-xs font-bold tracking-widest text-poke-yellow uppercase">
            {pack.name}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-1">{pack.name}</h3>
        <p className="text-slate-400 text-sm mb-4">{pack.description}</p>

        <div className="flex justify-between text-sm mb-5">
          <div>
            <div className="text-slate-500 text-xs">Min Prize</div>
            <div className="font-semibold">${pack.minPrize}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-500 text-xs">Max Pull</div>
            <div className="font-semibold text-poke-yellow">${pack.maxPrize}</div>
          </div>
        </div>

        <button
          disabled={!connected}
          className="w-full py-3 rounded-xl bg-poke-yellow text-black font-bold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {connected ? `Rip for ${pack.priceSol} SOL` : "Connect wallet to rip"}
        </button>
      </div>
    </div>
  );
}