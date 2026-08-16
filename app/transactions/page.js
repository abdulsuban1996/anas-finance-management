'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageAdapter } from '../../lib/storage';
import {
  Search, Plus, Calendar, CreditCard, Pencil, Trash2,
  TrendingUp, TrendingDown, ArrowLeftRight, SlidersHorizontal,
  ArrowUpRight, ArrowDownLeft, FileX
} from 'lucide-react';
import TransactionModal from '../../components/TransactionModal';
import { pageVariant, cardVariant, staggerContainer, fadeUp } from '../../lib/motion';

export default function TransactionsPage({ refreshKey, onRefresh }) {
  const [transactions, setTransactions]   = useState([]);
  const [categories,   setCategories]     = useState([]);
  const [accounts,     setAccounts]       = useState([]);

  const [searchQuery,   setSearchQuery]   = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [typeFilter,    setTypeFilter]    = useState('all');
  const [accountFilter, setAccountFilter] = useState('all');

  const [isTxModalOpen,    setIsTxModalOpen]    = useState(false);
  const [editTx,           setEditTx]           = useState(null);
  const [deleteConfirmId,  setDeleteConfirmId]  = useState(null);

  const loadData = () => {
    setTransactions(StorageAdapter.getTransactions());
    setCategories(StorageAdapter.getCategories());
    setAccounts(StorageAdapter.getAccounts());
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      window.addEventListener('anas_storage_updated', loadData);
      return () => window.removeEventListener('anas_storage_updated', loadData);
    }
  }, [refreshKey]);

  /* ── Filter ── */
  const filtered = transactions.filter(t => {
    const matchSearch  = (t.note || '').toLowerCase().includes(searchQuery.toLowerCase()) || String(t.amount || '').includes(searchQuery);
    const matchSegment = segmentFilter === 'all' || t.segment === segmentFilter;
    const matchType    = typeFilter    === 'all' || t.type    === typeFilter;
    const matchAcc     = accountFilter === 'all' || t.account_id === accountFilter;
    return matchSearch && matchSegment && matchType && matchAcc;
  });

  /* ── Summary ── */
  const sumIncome   = filtered.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
  const sumExpense  = filtered.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  const sumTransfer = filtered.filter(t => t.type === 'transfer').reduce((s,t) => s + t.amount, 0);

  const getCategoryName = id => categories.find(c => c.id === id)?.name ?? 'সাধারণ';
  const getAccountName  = id => accounts.find(a => a.id === id)?.name  ?? '—';

  /* ── Delete ── */
  const handleDelete = (tx) => {
    let accs = StorageAdapter.getAccounts().map(a => {
      if (a.id === tx.account_id) {
        if (tx.type === 'income')   return { ...a, current_balance: a.current_balance - tx.amount };
        if (tx.type !== 'income')   return { ...a, current_balance: a.current_balance + tx.amount };
      }
      if (tx.type === 'transfer' && a.id === tx.transfer_to_account_id)
        return { ...a, current_balance: a.current_balance - tx.amount };
      return a;
    });
    StorageAdapter.saveTransactions(StorageAdapter.getTransactions().filter(t => t.id !== tx.id));
    StorageAdapter.saveAccounts(accs);
    setDeleteConfirmId(null);
    onRefresh();
  };

  /* ── Type meta ── */
  const typeMeta = (tx) => {
    if (tx.type === 'income')   return { label: 'আয়',        icon: '↑', iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',   badge: 'bg-emerald-100 text-emerald-700', amtColor: 'text-emerald-600', sign: '+' };
    if (tx.type === 'transfer') return { label: 'ট্রান্সফার', icon: '⇄', iconBg: 'bg-gradient-to-br from-sky-400 to-blue-500',       badge: 'bg-sky-100 text-sky-700',          amtColor: 'text-sky-600',     sign: ''  };
    return                             { label: 'ব্যয়',       icon: '↓', iconBg: 'bg-gradient-to-br from-rose-400 to-pink-500',      badge: 'bg-rose-100 text-rose-700',        amtColor: 'text-rose-600',    sign: '-' };
  };

  return (
    <motion.div variants={pageVariant} initial="hidden" animate="visible" className="space-y-5">

      {/* ══════════════ HEADER ══════════════ */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">লেনদেন রেজিস্টার</h1>
          <p className="text-xs text-slate-500 mt-0.5">পার্সোনাল ও বিজনেসের সব আয়-ব্যয়ের ইতিহাস</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => { setEditTx(null); setIsTxModalOpen(true); }}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          নতুন লেনদেন
        </motion.button>
      </motion.div>

      {/* ══════════════ SUMMARY CHIPS ══════════════ */}
      <motion.div variants={staggerContainer(0.08)} className="grid grid-cols-3 gap-3">
        {[
          { label: 'মোট আয়',       value: sumIncome,   icon: <TrendingUp   className="w-4 h-4" />, from: 'from-emerald-500', to: 'to-teal-600',   shadow: 'shadow-emerald-500/20' },
          { label: 'মোট ব্যয়',      value: sumExpense,  icon: <TrendingDown className="w-4 h-4" />, from: 'from-rose-500',    to: 'to-pink-600',   shadow: 'shadow-rose-500/20'    },
          { label: 'মোট ট্রান্সফার', value: sumTransfer, icon: <ArrowLeftRight className="w-4 h-4" />, from: 'from-sky-500',  to: 'to-blue-600',   shadow: 'shadow-sky-500/20'     },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={cardVariant}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${s.from} ${s.to} text-white shadow-lg ${s.shadow}`}
          >
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-2">
                {s.icon}
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/70">{s.label}</p>
              <p className="text-base font-extrabold text-white amount-font mt-0.5">৳{s.value.toLocaleString('bn-BD')}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ══════════════ FILTER BAR ══════════════ */}
      <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-3">
        
        {/* Row 1: search + segment */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="নোট বা পরিমাণ দিয়ে খুঁজুন…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
            />
          </div>

          {/* Segment toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
            {[
              { val: 'all',      label: 'সব',        ac: 'bg-[#0D5C46] text-white' },
              { val: 'personal', label: 'পার্সোনাল', ac: 'bg-violet-600 text-white' },
              { val: 'business', label: 'বিজনেস',    ac: 'bg-amber-600  text-white' },
            ].map(b => (
              <motion.button
                key={b.val}
                whileTap={{ scale: 0.94 }}
                onClick={() => setSegmentFilter(b.val)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${segmentFilter === b.val ? b.ac + ' shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {b.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Row 2: type + account selects */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none">
              <option value="all">সব ধরন (আয়/ব্যয়/ট্রান্সফার)</option>
              <option value="income">✅ শুধু আয় (Income)</option>
              <option value="expense">❌ শুধু ব্যয় (Expense)</option>
              <option value="transfer">🔄 শুধু ট্রান্সফার</option>
            </select>
          </div>

          <div className="relative flex-1">
            <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select value={accountFilter} onChange={e => setAccountFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none">
              <option value="all">সব অ্যাকাউন্ট</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

      </motion.div>

      {/* ══════════════ TRANSACTION LIST ══════════════ */}
      <motion.div variants={fadeUp} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">

        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[2fr_1fr_auto] px-5 py-3 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">লেনদেন</span>
          <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">তারিখ / অ্যাকাউন্ট</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 text-right">পরিমাণ</span>
        </div>

        {/* Count bar */}
        <div className="flex items-center justify-between px-5 py-2 bg-white border-b border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400">
            {filtered.length} টি লেনদেন পাওয়া গেছে
          </span>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-700 transition-colors">
              ফিল্টার মুছুন ✕
            </button>
          )}
        </div>

        {/* Empty */}
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <FileX className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-400">কোনো লেনদেন পাওয়া যায়নি</p>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => { setEditTx(null); setIsTxModalOpen(true); }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline"
            >
              <Plus className="w-3.5 h-3.5" /> নতুন লেনদেন যুক্ত করুন
            </motion.button>
          </motion.div>
        ) : (
          <div className="divide-y divide-slate-100/80">
            {filtered.map((tx, idx) => {
              const meta      = typeMeta(tx);
              const isDeleting = deleteConfirmId === tx.id;

              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className="group transition-colors hover:bg-slate-50/70"
                >
                  <AnimatePresence mode="wait">
                    {/* Delete confirm row */}
                    {isDeleting ? (
                      <motion.div
                        key="delete-confirm"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="mx-4 my-2 flex items-center justify-between gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3"
                      >
                        <p className="text-xs font-bold text-red-700 flex-1">এই লেনদেনটি স্থায়ীভাবে মুছে ফেলবেন?</p>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => setDeleteConfirmId(null)}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                            বাতিল
                          </button>
                          <button onClick={() => handleDelete(tx)}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm">
                            হ্যাঁ, মুছুন
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      /* Normal row */
                      <div className="flex items-center gap-3 px-5 py-3.5">

                        {/* ── Icon ── */}
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 6 }}
                          className={`w-10 h-10 rounded-2xl ${meta.iconBg} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md`}
                        >
                          {meta.icon}
                        </motion.div>

                        {/* ── Info (left) ── */}
                        <div className="flex-1 min-w-0">
                          {/* Title row */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-800 truncate">
                              {tx.type === 'transfer' ? 'ফান্ড ট্রান্সফার' : getCategoryName(tx.category_id)}
                            </span>
                            {/* type badge */}
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${meta.badge}`}>
                              {meta.label}
                            </span>
                            {/* segment badge */}
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                              tx.segment === 'personal' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tx.segment === 'personal' ? 'পার্সোনাল' : 'বিজনেস'}
                            </span>
                          </div>

                          {/* Meta row */}
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 shrink-0" />
                              {tx.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3 shrink-0" />
                              {getAccountName(tx.account_id)}
                            </span>
                            {tx.note && (
                              <span className="text-slate-400 truncate max-w-[140px]">• {tx.note}</span>
                            )}
                          </div>
                        </div>

                        {/* ── Amount + Actions (right) ── */}
                        <div className="flex items-center gap-1.5 shrink-0 pl-2">

                          {/* Amount block */}
                          <div className="text-right mr-2">
                            <p className={`text-sm font-extrabold amount-font leading-tight ${meta.amtColor}`}>
                              {meta.sign}৳{tx.amount.toLocaleString('bn-BD')}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase">{meta.label}</p>
                          </div>

                          {/* Edit button */}
                          <motion.button
                            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                            onClick={() => { setEditTx(tx); setIsTxModalOpen(true); }}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                            title="সম্পাদনা"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </motion.button>

                          {/* Delete button */}
                          <motion.button
                            whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                            onClick={() => setDeleteConfirmId(tx.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="মুছুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>

                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-medium">সর্বশেষ এন্ট্রি সবার উপরে প্রদর্শিত হচ্ছে</span>
            <div className="flex items-center gap-4 text-[11px] font-bold">
              <span className="text-emerald-600 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />৳{sumIncome.toLocaleString('bn-BD')}
              </span>
              <span className="text-rose-500 flex items-center gap-1">
                <ArrowDownLeft className="w-3 h-3" />৳{sumExpense.toLocaleString('bn-BD')}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => { setIsTxModalOpen(false); setEditTx(null); }}
        onRefresh={onRefresh}
        editItem={editTx}
      />
    </motion.div>
  );
}
