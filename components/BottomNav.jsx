'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, Landmark, HandCoins, PieChart, Target } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'হোম',        href: '/',             icon: LayoutDashboard, activeColor: 'text-emerald-400', activeBg: 'bg-emerald-500/25', glow: 'shadow-emerald-500/40' },
  { name: 'লেনদেন',    href: '/transactions',  icon: ArrowLeftRight,  activeColor: 'text-violet-400',  activeBg: 'bg-violet-500/25',  glow: 'shadow-violet-500/40'  },
  { name: 'অ্যাকাউন্ট', href: '/accounts',     icon: Landmark,        activeColor: 'text-sky-400',     activeBg: 'bg-sky-500/25',     glow: 'shadow-sky-500/40'     },
  { name: 'ধার-দেনা',  href: '/loans',         icon: HandCoins,       activeColor: 'text-rose-400',    activeBg: 'bg-rose-500/25',    glow: 'shadow-rose-500/40'    },
  { name: 'বাজেট',     href: '/budgets',       icon: Target,          activeColor: 'text-amber-400',   activeBg: 'bg-amber-500/25',   glow: 'shadow-amber-500/40'   },
  { name: 'রিপোর্ট',   href: '/reports',       icon: PieChart,        activeColor: 'text-fuchsia-400', activeBg: 'bg-fuchsia-500/25', glow: 'shadow-fuchsia-500/40' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0,  opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0f172a] border-t border-white/15 px-1 py-2 pb-[calc(0.6rem+env(safe-area-inset-bottom))] shadow-[0_-8px_25px_rgba(0,0,0,0.4)]"
    >
      <nav className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className={`flex flex-col items-center py-1.5 px-1 rounded-2xl touch-manipulation transition-all duration-200 ${
                  isActive ? `${item.activeColor} ${item.activeBg} font-extrabold ring-1 ring-white/15 shadow-lg ${item.glow}` : 'text-slate-200 hover:text-white'
                }`}
              >
                <motion.div
                  animate={isActive ? { scale: 1.15, y: -1 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                >
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? item.activeColor : 'text-slate-200'}`} />
                </motion.div>
                <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-200'}`}>
                  {item.name}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-dot"
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${item.activeColor.replace('text-', 'bg-')}`}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
