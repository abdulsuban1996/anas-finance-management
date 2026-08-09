'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, Landmark,
  PieChart, HandCoins, Target, ShieldCheck, RotateCcw, Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'ড্যাশবোর্ড',       href: '/',             icon: LayoutDashboard, color: 'from-emerald-500 to-teal-600',   glow: 'shadow-emerald-500/40', dot: 'bg-emerald-400' },
  { name: 'আয়-ব্যয় লেনদেন', href: '/transactions',  icon: ArrowLeftRight,  color: 'from-violet-500 to-purple-600',  glow: 'shadow-violet-500/40',  dot: 'bg-violet-400'  },
  { name: 'অ্যাকাউন্ট ও ওয়ালেট', href: '/accounts', icon: Landmark,        color: 'from-sky-500 to-blue-600',       glow: 'shadow-sky-500/40',     dot: 'bg-sky-400'     },
  { name: 'ধার-দেনা (লোন)',   href: '/loans',         icon: HandCoins,       color: 'from-rose-500 to-pink-600',      glow: 'shadow-rose-500/40',    dot: 'bg-rose-400'    },
  { name: 'বাজেট ও সেভিংস',  href: '/budgets',       icon: Target,          color: 'from-amber-500 to-orange-500',   glow: 'shadow-amber-500/40',   dot: 'bg-amber-400'   },
  { name: 'রিপোর্ট ও বিশ্লেষণ', href: '/reports',   icon: PieChart,        color: 'from-fuchsia-500 to-pink-500',   glow: 'shadow-fuchsia-500/40', dot: 'bg-fuchsia-400' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-61px)] shrink-0 bg-gradient-to-b from-[#0a1628] via-[#0f2040] to-[#0a1628] border-r border-white/5">

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="px-5 pt-6 pb-3"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30 flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          প্রধান নেভিগেশন
        </p>
      </motion.div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: 'easeOut' }}
            >
              <Link href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                  }`}
                >
                  {/* Active bg glow */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-bg"
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-20`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.20 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon bubble */}
                  <motion.span
                    animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 ${
                      isActive
                        ? `bg-gradient-to-br ${item.color} shadow-lg ${item.glow} text-white`
                        : 'bg-white/8 text-white/40 group-hover:bg-white/12 group-hover:text-white/70'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.span>

                  <span className="relative">{item.name}</span>

                  {/* Active dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className={`ml-auto w-2 h-2 rounded-full ${item.dot}`}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="px-3 pb-6 pt-4 space-y-3 border-t border-white/5 mt-4"
      >
        <div className="bg-white/5 rounded-2xl p-3.5 border border-white/8">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-bold">নিরাপদ ও ম্যানুয়াল</span>
          </div>
          <p className="text-[11px] text-white/30 leading-snug">
            সমস্ত ডাটা আপনার ডিভাইসে সংরক্ষিত থাকে।
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (confirm('আপনি কি সব ডাটা মুছে নতুন করে শুরু করতে চান?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full text-left text-xs font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 p-2.5 rounded-xl border border-red-500/15 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ডাটা রিক্লিয়ার / রিসেট</span>
        </motion.button>
      </motion.div>
    </aside>
  );
}
