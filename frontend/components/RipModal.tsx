"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RarityBadge } from "./RarityBadge";
import { X } from "lucide-react";

interface RipResult {
  rarity: string;
  tokenSymbol: string;
  tokenAmount: string;
  valueUsd: number;
}

interface RipModalProps {
  open: boolean;
  onClose: () => void;
  packName: string;
  result?: RipResult | null;
}

const MOCK_RESULTS: RipResult[] = [
  { rarity: "Common", tokenSymbol: "BONK", tokenAmount: "1,250,000", valueUsd: 4.2 },
  { rarity: "Uncommon", tokenSymbol: "WIF", tokenAmount: "42", valueUsd: 18.5 },
  { rarity: "Rare", tokenSymbol: "JUP", tokenAmount: "12.4", valueUsd: 62 },
  { rarity: "Ultra Rare", tokenSymbol: "PYTH", tokenAmount: "85", valueUsd: 210 },
  { rarity: "Secret Rare", tokenSymbol: "JitoSOL", tokenAmount: "1.8", valueUsd: 420 },
  { rarity: "Legendary", tokenSymbol: "SOL", tokenAmount: "12.5", valueUsd: 1850 },
];

export function RipModal({ open, onClose, packName, result }: RipModalProps) {
  const [phase, setPhase] = useState<"idle" | "ripping" | "reveal">("idle");
  const [finalResult, setFinalResult] = useState<RipResult | null>(null);

  useEffect(() => {
    if (!open) {
      setPhase("idle");
      setFinalResult(null);
      return;
    }

    // Start rip sequence
    setPhase("ripping");
    const timer = setTimeout(() => {
      const res = result || MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
      setFinalResult(res);
      setPhase("reveal");
    }, 2200);

    return () => clearTimeout(timer);
  }, [open, result]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white z-10"
          >
            <X size={28} />
          </button>

          <div className="w-full max-w-sm">
            {phase === "ripping" && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, -8, 8, -8, 8, 0],
                    scale: [1, 1.05, 1, 1.05, 1],
                  }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-40 h-56 rounded-2xl bg-gradient-to-b from-poke-navy to-black border-2 border-poke-yellow flex items-center justify-center shadow-2xl shadow-poke-yellow/30"
                >
                  <div className="w-20 h-20 rounded-full border-4 border-poke-yellow bg-gradient-to-b from-poke-yellow to-poke-red relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-1 bg-poke-navy" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white border-4 border-poke-navy" />
                    </div>
                  </div>
                </motion.div>
                <p className="mt-6 text-poke-yellow font-bold tracking-widest animate-pulse">
                  RIPPING {packName.toUpperCase()}...
                </p>
              </motion.div>
            )}

            {phase === "reveal" && finalResult && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-64 aspect-[2.5/3.5] rounded-2xl overflow-hidden border-2 border-poke-yellow bg-poke-surface shadow-2xl shadow-poke-yellow/40">
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                    <RarityBadge rarity={finalResult.rarity} />
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">Value</div>
                      <div className="font-bold text-poke-yellow">
                        ${finalResult.valueUsd.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 pt-14">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-poke-yellow/40 to-poke-red/30 border-2 border-poke-yellow flex items-center justify-center mb-4">
                      <span className="text-xl font-black text-poke-yellow">
                        {finalResult.tokenSymbol.slice(0, 4)}
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black">{finalResult.tokenSymbol}</div>
                      <div className="text-slate-400 mt-1">{finalResult.tokenAmount}</div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 py-2 bg-black/50 text-center">
                    <span className="text-xs font-bold tracking-widest text-poke-yellow">
                      POKE RIPS
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-center text-lg font-bold">
                  You pulled a <span className="text-poke-yellow">{finalResult.rarity}</span>!
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Tokens will land in your wallet shortly.
                </p>

                <button
                  onClick={onClose}
                  className="mt-8 px-8 py-3 rounded-full bg-poke-yellow text-black font-bold hover:bg-yellow-400 transition-colors"
                >
                  Nice!
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}