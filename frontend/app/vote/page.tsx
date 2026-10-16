"use client";

import { Navbar } from "@/components/Navbar";

export default function VotePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Vote</h1>
        <p className="text-slate-400 mb-8">
          Stake $POKE to push tokens into the prize pool.
        </p>
        <div className="bg-poke-surface border border-white/10 rounded-2xl p-12 text-center text-slate-500">
          Voting interface coming soon.
        </div>
      </main>
    </div>
  );
}