"use client";

import { Navbar } from "@/components/Navbar";
import { BOOST_TIERS } from "@/lib/constants";

const DEMO_TOKENS = [
  { symbol: "BONK", votes: 12400, rank: 1 },
  { symbol: "WIF", votes: 9800, rank: 2 },
  { symbol: "JUP", votes: 8700, rank: 3 },
  { symbol: "PYTH", votes: 7200, rank: 4 },
  { symbol: "JitoSOL", votes: 6100, rank: 5 },
  { symbol: "ORCA", votes: 5400, rank: 6 },
  { symbol: "RAY", votes: 4900, rank: 7 },
  { symbol: "MNDE", votes: 4200, rank: 8 },
];

export default function VotePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Vote</h1>
        <p className="text-slate-400 mb-8 max-w-xl">
          Stake $POKE to push tokens into the Top 20 prize pool. Higher stake = more voting power.
        </p>

        {/* Boost tiers */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Odds Boost Tiers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {BOOST_TIERS.map((tier) => (
              <div
                key={tier.name}
                className="bg-poke-surface border border-white/10 rounded-xl p-4"
              >
                <div className="font-bold text-poke-yellow">{tier.name}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {(tier.amount / 1000).toFixed(0)}k $POKE
                </div>
                <div className="text-sm font-semibold mt-2">
                  +{(tier.bonus * 100).toFixed(0)}% Epic+
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Top tokens */}
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
          Current Prize Pool (Top 20)
        </h2>
        <div className="bg-poke-surface border border-white/10 rounded-2xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {DEMO_TOKENS.map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-mono text-sm w-6">
                    #{token.rank}
                  </span>
                  <span className="font-bold">{token.symbol}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm text-slate-400">
                    {token.votes.toLocaleString()} votes
                  </span>
                  <button className="text-xs font-bold px-3 py-1.5 rounded-full bg-poke-yellow/10 text-poke-yellow hover:bg-poke-yellow/20 transition-colors">
                    Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}