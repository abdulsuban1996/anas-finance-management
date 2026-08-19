'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, PlusCircle, ArrowLeftRight } from 'lucide-react';

export default function Navbar({ onOpenTransaction, onOpenTransfer }) {
  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-30 bg-gradient-to-r from-[#0a1628] via-[#0f2040] to-[#0a1628] border-b border-white/10 px-4 lg:px-8 py-3 shadow-xl shadow-black/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-2.5"
        >
          <motion.div
            whileHover={{ rotate: -8, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30"
          >
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
          <div>
            <h1 className="font-bold text-sm sm:text-base text-white leading-tight tracking-tight">আনাস ফাইনান্স</h1>
            <p className="text-[10px] sm:text-[11px] text-white/50 font-medium">Personal & Business Tracker</p>
          </div>
        </motion.div>

        {/* Right Actions */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          {/* Transfer */}
          <motion.button
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.14)' }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={onOpenTransfer}
            className="hidden sm:flex items-center gap-1.5 bg-white/8 border border-white/10 text-white/80 hover:text-white font-semibold text-xs px-3.5 py-2 rounded-xl"
          >
            <ArrowLeftRight className="w-4 h-4 text-sky-400" />
            <span>ফান্ড ট্রান্সফার</span>
          </motion.button>

          {/* New Entry */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(16,185,129,0.4)' }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={onOpenTransaction}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs px-3.5 sm:px-4 py-2 rounded-xl shadow-lg shadow-emerald-600/30"
          >
            <motion.div
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
            >
              <PlusCircle className="w-4 h-4" />
            </motion.div>
            <span>নতুন এন্ট্রি</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
}
