"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Vote, BarChart3, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Shop", icon: Home },
  { href: "/collection", label: "Collection", icon: LayoutGrid },
  { href: "/vote", label: "Vote", icon: Vote },
  { href: "/stats", label: "Stats", icon: BarChart3 },
  { href: "/fair", label: "Fair", icon: Scale },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-poke-bg/95 backdrop-blur border-t border-white/10">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors",
                active ? "text-poke-yellow" : "text-slate-500"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}