'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, Landmark,
  PieChart, HandCoins, Target, ShieldCheck, RotateCcw, Sparkles, X, LogOut
} from 'lucide-react';

export const NAV_ITEMS = [
  { name: 'ড্যাশবোর্ড',       href: '/',             icon: LayoutDashboard, color: 'from-emerald-500 to-teal-600',   glow: 'shadow-emerald-500/40', dot: 'bg-emerald-400' },
  { name: 'আয়-ব্যয় লেনদেন', href: '/transactions',  icon: ArrowLeftRight,  color: 'from-violet-500 to-purple-600',  glow: 'shadow-violet-500/40',  dot: 'bg-violet-400'  },
  { name: 'অ্যাকাউন্ট ও ওয়ালেট', href: '/accounts', icon: Landmark,        color: 'from-sky-500 to-blue-600',       glow: 'shadow-sky-500/40',     dot: 'bg-sky-400'     },
  { name: 'ধার-দেনা (লোন)',   href: '/loans',         icon: HandCoins,       color: 'from-rose-500 to-pink-600',      glow: 'shadow-rose-500/40',    dot: 'bg-rose-400'    },
  { name: 'বাজেট ও সেভিংস',  href: '/budgets',       icon: Target,          color: 'from-amber-500 to-orange-500',   glow: 'shadow-amber-500/40',   dot: 'bg-amber-400'   },
  { name: 'রিপোর্ট ও বিশ্লেষণ', href: '/reports',   icon: PieChart,        color: 'from-fuchsia-500 to-pink-500',   glow: 'shadow-fuchsia-500/40', dot: 'bg-fuchsia-400' },
];

export function SidebarContent({ onItemClick }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#0a1628] via-[#0f2040] to-[#0a1628] text-white">
      {/* Label */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="px-5 pt-6 pb-3 flex items-center justify-between"
      >
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-400 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          প্রধান নেভিগেশন
        </p>
      </motion.div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.05, duration: 0.35, ease: 'easeOut' }}
            >
              <Link href={item.href} onClick={onItemClick}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={`group relative flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-bold text-sm transition-colors duration-200 ${
                    isActive ? 'text-white bg-white/10' : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {/* Active bg glow */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-bg"
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${item.color} opacity-30`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.30 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon bubble */}
                  <motion.span
                    animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0 ${
                      isActive
                        ? `bg-gradient-to-br ${item.color} shadow-lg ${item.glow} text-white`
                        : 'bg-white/15 text-slate-100 group-hover:bg-white/25 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </motion.span>

                  <span className="relative text-sm tracking-wide">{item.name}</span>

                  {/* Active dot */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className={`ml-auto w-2.5 h-2.5 rounded-full ${item.dot} shadow-sm`}
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
        transition={{ delay: 0.4, duration: 0.3 }}
        className="px-3 pb-6 pt-4 space-y-3 border-t border-white/10 mt-auto"
      >
        <div className="bg-white/8 rounded-2xl p-3.5 border border-white/12">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-extrabold">নিরাপদ ও ম্যানুয়াল</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium leading-snug">
            সমস্ত ডাটা আপনার ডিভাইসে সুরক্ষিত থাকে।
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
          className="w-full text-left text-xs font-extrabold text-red-300 hover:text-red-200 hover:bg-red-500/20 p-2.5 rounded-xl border border-red-500/25 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>ডাটা রিক্লিয়ার / রিসেট</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (confirm('আপনি কি লগআউট করতে চান?')) {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('anas_fin_auth_session_v1');
                window.dispatchEvent(new CustomEvent('anas_auth_changed'));
              }
            }
          }}
          className="w-full text-left text-xs font-extrabold text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 p-2.5 rounded-xl border border-rose-500/25 transition-all flex items-center gap-2"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>লগআউট (Logout)</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-61px)] shrink-0 border-r border-white/10 shadow-lg">
      <SidebarContent />
    </aside>
  );
}
