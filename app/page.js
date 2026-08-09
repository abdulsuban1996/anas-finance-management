'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageAdapter } from '../lib/storage';
import {
  TrendingUp, TrendingDown, Wallet, ArrowLeftRight,
  AlertCircle, ArrowUpRight, ArrowDownLeft, ChevronRight,
  Plus, Banknote, Landmark, Smartphone, Briefcase, Coins
} from 'lucide-react';
import Link from 'next/link';
import TransactionModal from '../components/TransactionModal';
import TransferModal from '../components/TransferModal';
import { pageVariant, cardVariant, staggerContainer, fadeUp, numberPop } from '../lib/motion';

export default function Home({ refreshKey, onRefresh }) {
  const [accounts,     setAccounts]     = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories,   setCategories]   = useState([]);
  const [loans,        setLoans]        = useState([]);
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  useEffect(() => {
    setAccounts(StorageAdapter.getAccounts());
    setTransactions(StorageAdapter.getTransactions());
    setCategories(StorageAdapter.getCategories());
    setLoans(StorageAdapter.getLoans());
  }, [refreshKey]);

  const totalBalance  = accounts.reduce((acc, a) => acc + (a.current_balance || 0), 0);
  const filteredTxs   = transactions.filter(t => segmentFilter === 'all' || t.segment === segmentFilter);
  const currentMonth  = new Date().getMonth();
  const currentYear   = new Date().getFullYear();
  const monthlyTxs    = filteredTxs.filter(t => { const d = new Date(t.date); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; });
  const totalIncome   = monthlyTxs.filter(t => t.type === 'income') .reduce((s,t) => s+(t.amount||0), 0);
  const totalExpense  = monthlyTxs.filter(t => t.type === 'expense').reduce((s,t) => s+(t.amount||0), 0);
  const netSaving     = totalIncome - totalExpense;
  const pendingLoans  = loans.filter(l => l.status !== 'paid');

  const getCategoryName = id => categories.find(c => c.id === id)?.name ?? 'সাধারণ';
  const getAccountName  = id => accounts.find(a => a.id === id)?.name  ?? '';

  const banglaMonths = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];
  const monthName = banglaMonths[currentMonth];

  const accIcon  = (type) => {
    if (type === 'bank')     return <Landmark   className="w-4 h-4" />;
    if (type === 'mfs')      return <Smartphone className="w-4 h-4" />;
    if (type === 'business') return <Briefcase  className="w-4 h-4" />;
    return <Coins className="w-4 h-4" />;
  };
  const accColors = [
    { bg: 'from-emerald-500 to-teal-500',  glow: 'shadow-emerald-500/30' },
    { bg: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/30'  },
    { bg: 'from-sky-500 to-blue-600',      glow: 'shadow-sky-500/30'     },
    { bg: 'from-rose-500 to-pink-600',     glow: 'shadow-rose-500/30'    },
    { bg: 'from-amber-500 to-orange-500',  glow: 'shadow-amber-500/30'   },
  ];

  return (
    <motion.div
      variants={pageVariant}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* ─── Header ─── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-snug">
            আসসালামু আলাইকুম, আনাস! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">{monthName} {currentYear} — আপনার ফাইনান্সিয়াল সংক্ষিপ্ত চিত্র</p>
        </div>
        {/* Segment Toggle */}
        <motion.div variants={fadeUp} className="inline-flex bg-slate-100 p-1 rounded-2xl self-start sm:self-auto shrink-0">
          {[
            { label: 'সব তথ্য',   value: 'all',      active: 'bg-[#0D5C46] text-white' },
            { label: 'পার্সোনাল', value: 'personal', active: 'bg-violet-600 text-white' },
            { label: 'বিজনেস',    value: 'business', active: 'bg-amber-600  text-white' },
          ].map(btn => (
            <motion.button
              key={btn.value}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSegmentFilter(btn.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${segmentFilter === btn.value ? btn.active + ' shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {btn.label}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* ─── 3 Stats Cards ─── */}
      <motion.div variants={staggerContainer(0.1)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Balance */}
        <motion.div
          variants={cardVariant}
          whileHover={{ y: -4, boxShadow: '0 20px 40px -8px rgba(0,0,0,0.3)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#0a1628] via-[#0f2040] to-[#1a0a3c] text-white shadow-xl shadow-black/30"
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 -left-4 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">সর্বমোট ব্যালেন্স</span>
              <motion.div whileHover={{ rotate: 15 }} className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Wallet className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            <motion.div variants={numberPop}>
              <div className="text-3xl font-extrabold tracking-tight text-white amount-font">৳{totalBalance.toLocaleString('bn-BD')}</div>
              <p className="text-xs text-white/40 mt-1">{accounts.length} টি সচল অ্যাকাউন্ট</p>
            </motion.div>
            <div className="pt-3 mt-auto border-t border-white/8 flex items-center justify-between text-xs font-bold">
              <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.96 }} onClick={() => setIsTransferModalOpen(true)}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors">
                <ArrowLeftRight className="w-3.5 h-3.5" /><span>ট্রান্সফার</span>
              </motion.button>
              <Link href="/accounts">
                <motion.span whileHover={{ x: 2 }} className="flex items-center gap-0.5 text-white/50 hover:text-white transition-colors cursor-pointer">
                  <span>সব অ্যাকাউন্ট</span><ChevronRight className="w-3.5 h-3.5" />
                </motion.span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Income */}
        <motion.div
          variants={cardVariant}
          whileHover={{ y: -4, boxShadow: '0 20px 40px -8px rgba(16,185,129,0.35)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
        >
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">মাসিক আয়</p>
                <p className="text-xs font-medium text-white/50 mt-0.5">{monthName} {currentYear}</p>
              </div>
              <motion.div whileHover={{ scale: 1.15 }} className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            <motion.div variants={numberPop} className="mt-4">
              <div className="text-2xl font-extrabold text-white amount-font">৳{totalIncome.toLocaleString('bn-BD')}</div>
              <p className="text-xs text-white/70 font-semibold mt-2 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /><span>মোট ইনকাম</span>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Expense */}
        <motion.div
          variants={cardVariant}
          whileHover={{ y: -4, boxShadow: '0 20px 40px -8px rgba(244,63,94,0.35)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25"
        >
          <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">মাসিক খরচ</p>
                <p className="text-xs font-medium text-white/50 mt-0.5">{monthName} {currentYear}</p>
              </div>
              <motion.div whileHover={{ scale: 1.15 }} className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-white" />
              </motion.div>
            </div>
            <motion.div variants={numberPop} className="mt-4">
              <div className="text-2xl font-extrabold text-white amount-font">৳{totalExpense.toLocaleString('bn-BD')}</div>
              <p className="text-xs text-white/70 font-semibold mt-2 flex items-center gap-1">
                <ArrowDownLeft className="w-3.5 h-3.5" /><span>মোট খরচ</span>
              </p>
            </motion.div>
          </div>
        </motion.div>

      </motion.div>

      {/* ─── Net Saving ─── */}
      <motion.div
        variants={fadeUp}
        className={`rounded-2xl px-5 py-3.5 flex items-center justify-between ${
          netSaving >= 0
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
            : 'bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${netSaving >= 0 ? 'bg-emerald-100' : 'bg-rose-100'}`}>
            <Banknote className={`w-4 h-4 ${netSaving >= 0 ? 'text-emerald-600' : 'text-rose-500'}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700">এই মাসের নেট সঞ্চয়/ঘাটতি</p>
            <p className="text-[10px] text-slate-400">আয় − খরচ</p>
          </div>
        </div>
        <motion.span
          key={netSaving}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-lg font-extrabold amount-font ${netSaving >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}
        >
          {netSaving >= 0 ? '+' : ''}৳{netSaving.toLocaleString('bn-BD')}
        </motion.span>
      </motion.div>

      {/* ─── Loan Alert ─── */}
      <AnimatePresence>
        {pendingLoans.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between gap-4 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center"
              >
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </motion.div>
              <div>
                <p className="text-xs font-bold text-amber-800">ধার-দেনা বকেয়া রিমাইন্ডার!</p>
                <p className="text-[11px] text-amber-700 mt-0.5">{pendingLoans.length} টি বকেয়া লোন/ধার হিসাব রয়েছে</p>
              </div>
            </div>
            <Link href="/loans">
              <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="shrink-0 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer inline-block">
                দেখুন
              </motion.span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Account Cards ─── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-700">অ্যাকাউন্ট ও ওয়ালেট</h2>
          <Link href="/accounts" className="text-xs font-bold text-[#0D5C46] hover:underline">সবগুলো ({accounts.length})</Link>
        </div>
        <motion.div variants={staggerContainer(0.07)} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {accounts.map((acc, idx) => {
            const c = accColors[idx % accColors.length];
            return (
              <motion.div
                key={acc.id}
                variants={cardVariant}
                whileHover={{ y: -4, boxShadow: '0 12px 24px -6px rgba(0,0,0,0.12)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative overflow-hidden rounded-2xl p-4 bg-white border border-slate-200/80 cursor-default"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.bg} rounded-t-2xl`} />
                <div className="flex items-center justify-between mb-2 mt-1">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center text-white shadow-md ${c.glow}`}>
                    {accIcon(acc.type)}
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <p className="text-xs font-bold text-slate-700 truncate leading-tight">{acc.name}</p>
                <p className="text-sm font-extrabold text-slate-900 mt-1 amount-font">৳{acc.current_balance.toLocaleString('bn-BD')}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ─── Quick Stats ─── */}
      <motion.div variants={staggerContainer(0.08)} className="grid grid-cols-3 gap-3">
        {[
          { label: 'মোট আয়',    value: totalIncome,  color: 'text-emerald-600', bgIcon: 'bg-emerald-100', icon: <TrendingUp    className="w-4 h-4 text-emerald-600" />, border: 'border-emerald-100' },
          { label: 'মোট খরচ',   value: totalExpense, color: 'text-rose-600',    bgIcon: 'bg-rose-100',    icon: <TrendingDown  className="w-4 h-4 text-rose-600"    />, border: 'border-rose-100'    },
          { label: 'বকেয়া লোন', value: pendingLoans.reduce((s,l)=>s+l.remaining_amount,0), color: 'text-amber-600', bgIcon: 'bg-amber-100', icon: <AlertCircle className="w-4 h-4 text-amber-600" />, border: 'border-amber-100' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={cardVariant}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`bg-white rounded-2xl p-4 border ${stat.border} shadow-sm`}
          >
            <div className={`w-8 h-8 rounded-xl ${stat.bgIcon} flex items-center justify-center mb-2`}>{stat.icon}</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
            <p className={`text-base font-extrabold ${stat.color} amount-font mt-0.5`}>৳{stat.value.toLocaleString('bn-BD')}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── Recent Transactions ─── */}
      <motion.div
        variants={fadeUp}
        className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-800">সাম্প্রতিক লেনদেন</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">সর্বশেষ আয়-ব্যয়ের তালিকা</p>
          </div>
          <Link href="/transactions" className="text-xs font-bold text-[#0D5C46] hover:underline">সব দেখুন</Link>
        </div>

        <div className="divide-y divide-slate-50">
          {filteredTxs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 text-center">
              <p className="text-sm font-semibold text-slate-400">এখনো কোনো লেনদেন নেই</p>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                onClick={() => setIsTxModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#0D5C46] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> প্রথম লেনদেন যুক্ত করুন
              </motion.button>
            </motion.div>
          ) : (
            filteredTxs.slice(0, 6).map((tx, idx) => {
              const isIncome   = tx.type === 'income';
              const isTransfer = tx.type === 'transfer';
              const typeMeta   = isIncome
                ? { bg: 'from-emerald-400 to-teal-500', text: 'text-emerald-600', sign: '+', sym: '↑' }
                : isTransfer
                ? { bg: 'from-sky-400 to-blue-500',     text: 'text-sky-600',     sign: '',  sym: '⇄' }
                : { bg: 'from-rose-400 to-pink-500',    text: 'text-slate-800',   sign: '-', sym: '↓' };

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                  className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <motion.div
                      whileHover={{ scale: 1.12, rotate: 5 }}
                      className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${typeMeta.bg} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}
                    >
                      {typeMeta.sym}
                    </motion.div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {isTransfer ? 'ফান্ড ট্রান্সফার' : getCategoryName(tx.category_id)}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${tx.segment === 'personal' ? 'bg-violet-100 text-violet-700' : 'bg-amber-100 text-amber-800'}`}>
                          {tx.segment === 'personal' ? 'পার্সোনাল' : 'বিজনেস'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{tx.note || '—'} · {getAccountName(tx.account_id)} · {tx.date}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-extrabold amount-font shrink-0 pl-3 ${typeMeta.text}`}>
                    {typeMeta.sign}৳{tx.amount.toLocaleString('bn-BD')}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      <TransactionModal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} onRefresh={onRefresh} />
      <TransferModal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} onRefresh={onRefresh} />
    </motion.div>
  );
}
