'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, Landmark, HandCoins, PieChart, Target } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'হোম',        href: '/',             icon: LayoutDashboard, activeBg: 'bg-emerald-500', activeText: 'text-white', glow: 'shadow-emerald-500/50' },
  { name: 'লেনদেন',    href: '/transactions',  icon: ArrowLeftRight,  activeBg: 'bg-violet-500',  activeText: 'text-white', glow: 'shadow-violet-500/50'  },
  { name: 'অ্যাকাউন্ট', href: '/accounts',     icon: Landmark,        activeBg: 'bg-sky-500',     activeText: 'text-white', glow: 'shadow-sky-500/50'     },
  { name: 'ধার-দেনা',  href: '/loans',         icon: HandCoins,       activeBg: 'bg-rose-500',    activeText: 'text-white', glow: 'shadow-rose-500/50'    },
  { name: 'বাজেট',     href: '/budgets',       icon: Target,          activeBg: 'bg-amber-500',   activeText: 'text-white', glow: 'shadow-amber-500/50'   },
  { name: 'রিপোর্ট',   href: '/reports',       icon: PieChart,        activeBg: 'bg-fuchsia-500', activeText: 'text-white', glow: 'shadow-fuchsia-500/50' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a1628] border-t-2 border-white/20 px-2 py-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
      <nav className="flex items-center justify-between gap-1 max-w-md mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className={`flex flex-col items-center py-2 px-1 rounded-2xl touch-manipulation transition-all duration-200 ${
                  isActive
                    ? `${item.activeBg} text-white font-extrabold shadow-lg ${item.glow} scale-105`
                    : 'text-white hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-white' : 'text-slate-100'}`} />
                <span className={`text-[11px] font-extrabold tracking-tight ${isActive ? 'text-white' : 'text-slate-100'}`}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
