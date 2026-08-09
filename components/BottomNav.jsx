'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, Landmark, HandCoins, PieChart, Target } from 'lucide-react';

const NAV_ITEMS = [
  { name: 'হোম',        href: '/',             icon: LayoutDashboard, activeColor: 'text-emerald-400', activeBg: 'bg-emerald-500/15' },
  { name: 'লেনদেন',    href: '/transactions',  icon: ArrowLeftRight,  activeColor: 'text-violet-400',  activeBg: 'bg-violet-500/15'  },
  { name: 'অ্যাকাউন্ট', href: '/accounts',     icon: Landmark,        activeColor: 'text-sky-400',     activeBg: 'bg-sky-500/15'     },
  { name: 'ধার-দেনা',  href: '/loans',         icon: HandCoins,       activeColor: 'text-rose-400',    activeBg: 'bg-rose-500/15'    },
  { name: 'বাজেট',     href: '/budgets',       icon: Target,          activeColor: 'text-amber-400',   activeBg: 'bg-amber-500/15'   },
  { name: 'রিপোর্ট',   href: '/reports',       icon: PieChart,        activeColor: 'text-fuchsia-400', activeBg: 'bg-fuchsia-500/15' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0,  opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1628]/96 backdrop-blur-lg border-t border-white/8 px-1 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-2xl"
    >
      <nav className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className={`flex flex-col items-center py-1.5 px-2.5 rounded-xl touch-manipulation ${
                  isActive ? `${item.activeColor} ${item.activeBg} font-bold` : 'text-white/35'
                }`}
              >
                <motion.div
                  animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                >
                  <Icon className={`w-5 h-5 mb-0.5 ${isActive ? item.activeColor : 'text-white/35'}`} />
                </motion.div>
                <span className="text-[10px] font-bold">{item.name}</span>

                {/* Active underline dot */}
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-dot"
                    className={`w-1 h-1 rounded-full mt-0.5 ${item.activeColor.replace('text-', 'bg-')}`}
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
