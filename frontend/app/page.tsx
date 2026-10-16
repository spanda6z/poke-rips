"use client";

import { PackCard } from "@/components/PackCard";
import { Navbar } from "@/components/Navbar";
import { PACKS } from "@/lib/constants";

export default function ShopPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-poke-yellow mb-3 tracking-tight">
            POKE RIPS
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto">
            Rip packs. Catch real Solana bags delivered straight to your wallet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKS.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            All rips are provably fair via Switchboard VRF. Every result is on-chain.
          </p>
        </div>
      </main>
    </div>
  );
}