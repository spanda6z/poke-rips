"use client";

import { Navbar } from "@/components/Navbar";

export default function FairPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Provably Fair</h1>
        <p className="text-slate-300 mb-6 leading-relaxed">
          Nothing about a pack rip is decided by us. Rarity, prize size, and which
          token you receive are all derived from a single random number generated
          by Switchboard VRF, verified on-chain, and locked before anyone (including
          us) can see it.
        </p>

        <div className="space-y-4">
          <div className="bg-poke-surface border border-white/10 rounded-xl p-5">
            <h3 className="font-bold text-poke-yellow mb-2">1. Randomness Source</h3>
            <p className="text-slate-400 text-sm">
              Switchboard On-Demand VRF (commit → reveal). The result is bound to a
              future slot and cannot be cherry-picked.
            </p>
          </div>
          <div className="bg-poke-surface border border-white/10 rounded-xl p-5">
            <h3 className="font-bold text-poke-yellow mb-2">2. Odds Live On-Chain</h3>
            <p className="text-slate-400 text-sm">
              All probability tables and the current Top 20 token list live in a
              public config account. Anyone can read them.
            </p>
          </div>
          <div className="bg-poke-surface border border-white/10 rounded-xl p-5">
            <h3 className="font-bold text-poke-yellow mb-2">3. Every Order is Public</h3>
            <p className="text-slate-400 text-sm">
              Each rip creates a public Order account. You can verify any result on
              Solscan.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}