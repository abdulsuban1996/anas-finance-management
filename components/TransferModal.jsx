'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeftRight, Check } from 'lucide-react';
import { StorageAdapter } from '../lib/storage';

export default function TransferModal({ isOpen, onClose, onRefresh }) {
  const [fromAccId, setFromAccId] = useState('');
  const [toAccId, setToAccId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const accs = StorageAdapter.getAccounts();
      setAccounts(accs);
      if (accs.length > 0) setFromAccId(accs[0].id);
      if (accs.length > 1) setToAccId(accs[1].id);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('সঠিক অ্যামাউন্ট দিন');
      return;
    }
    if (fromAccId === toAccId) {
      alert('একই অ্যাকাউন্টে ট্রান্সফার সম্ভব নয়');
      return;
    }

    const numAmount = parseFloat(amount);
    const allTxs = StorageAdapter.getTransactions();
    const allAccs = StorageAdapter.getAccounts();

    const transferTx = {
      id: `tx-${Date.now()}`,
      account_id: fromAccId,
      transfer_to_account_id: toAccId,
      category_id: null,
      type: 'transfer',
      segment: 'personal',
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      note: note || 'ফান্ড ট্রান্সফার',
      is_recurring: false,
    };

    const updatedAccs = allAccs.map(acc => {
      if (acc.id === fromAccId) return { ...acc, current_balance: acc.current_balance - numAmount };
      if (acc.id === toAccId) return { ...acc, current_balance: acc.current_balance + numAmount };
      return acc;
    });

    StorageAdapter.saveTransactions([transferTx, ...allTxs]);
    StorageAdapter.saveAccounts(updatedAccs);
    onRefresh();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative z-10 bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <ArrowLeftRight className="w-5 h-5 text-[#1A3A5C]" />
                <h2 className="text-base font-bold text-slate-800">ফান্ড ট্রান্সফার</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">কোথা থেকে (From)</label>
                <select
                  value={fromAccId}
                  onChange={(e) => setFromAccId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (৳{acc.current_balance})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">কোথায় যাবে (To)</label>
                <select
                  value={toAccId}
                  onChange={(e) => setToAccId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30"
                >
                  {accounts.filter(a => a.id !== fromAccId).map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (৳{acc.current_balance})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">টাকার পরিমাণ (৳)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-lg font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">নোট (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="যেমন: ক্যাশ আউট"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 bg-[#1A3A5C] hover:bg-[#122840] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Check className="w-5 h-5" />
                <span>ট্রান্সফার সম্পন্ন করুন</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
