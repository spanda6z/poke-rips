"use client";

import { Navbar } from "@/components/Navbar";

export default function StatsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Stats</h1>
        <p className="text-slate-400 mb-8">Live activity and biggest pulls.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-poke-surface border border-white/10 rounded-xl p-5">
            <div className="text-slate-400 text-sm">Total Rips</div>
            <div className="text-2xl font-bold">—</div>
          </div>
          <div className="bg-poke-surface border border-white/10 rounded-xl p-5">
            <div className="text-slate-400 text-sm">Volume</div>
            <div className="text-2xl font-bold">—</div>
          </div>
          <div className="bg-poke-surface border border-white/10 rounded-xl p-5">
            <div className="text-slate-400 text-sm">Biggest Pull</div>
            <div className="text-2xl font-bold text-poke-yellow">—</div>
          </div>
        </div>
      </main>
    </div>
  );
}