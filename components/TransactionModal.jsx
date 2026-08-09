'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { StorageAdapter } from '../lib/storage';

export default function TransactionModal({ isOpen, onClose, onRefresh, editItem = null }) {
  const [type, setType] = useState('expense');
  const [segment, setSegment] = useState('personal');
  const [accountId, setAccountId] = useState('');
  const [transferToAccountId, setTransferToAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const isEditMode = !!editItem;

  useEffect(() => {
    if (isOpen) {
      const accs = StorageAdapter.getAccounts();
      const cats = StorageAdapter.getCategories();
      setAccounts(accs);
      setCategories(cats);

      if (isEditMode) {
        setType(editItem.type || 'expense');
        setSegment(editItem.segment || 'personal');
        setAccountId(editItem.account_id || (accs[0]?.id ?? ''));
        setTransferToAccountId(editItem.transfer_to_account_id || (accs[1]?.id ?? ''));
        setCategoryId(editItem.category_id || (cats[0]?.id ?? ''));
        setAmount(String(editItem.amount || ''));
        setDate(editItem.date || new Date().toISOString().split('T')[0]);
        setNote(editItem.note || '');
      } else {
        setType('expense');
        setSegment('personal');
        setAccountId(accs[0]?.id ?? '');
        setTransferToAccountId(accs[1]?.id ?? '');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setNote('');
        const expCats = cats.filter(c => c.type === 'expense');
        if (expCats.length > 0) setCategoryId(expCats[0].id);
      }
    }
  }, [isOpen]);

  const filteredCategories = categories.filter(c => c.type === (type === 'income' ? 'income' : 'expense'));

  useEffect(() => {
    if (!isEditMode && isOpen && filteredCategories.length > 0 && type !== 'transfer') {
      setCategoryId(filteredCategories[0].id);
    }
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return alert('সঠিক অ্যামাউন্ট দিন');
    if (!accountId) return alert('অ্যাকাউন্ট নির্বাচন করুন');
    if (type === 'transfer' && (!transferToAccountId || accountId === transferToAccountId)) {
      return alert('ট্রান্সফারের জন্য দুটি আলাদা অ্যাকাউন্ট নির্বাচন করুন');
    }

    const numAmount = parseFloat(amount);
    let allTransactions = StorageAdapter.getTransactions();
    let allAccounts = StorageAdapter.getAccounts();

    if (isEditMode) {
      const oldTx = editItem;
      allAccounts = allAccounts.map(acc => {
        if (acc.id === oldTx.account_id) {
          if (oldTx.type === 'income') return { ...acc, current_balance: acc.current_balance - oldTx.amount };
          if (oldTx.type === 'expense' || oldTx.type === 'transfer') return { ...acc, current_balance: acc.current_balance + oldTx.amount };
        }
        if (oldTx.type === 'transfer' && acc.id === oldTx.transfer_to_account_id) {
          return { ...acc, current_balance: acc.current_balance - oldTx.amount };
        }
        return acc;
      });

      allAccounts = allAccounts.map(acc => {
        if (acc.id === accountId) {
          if (type === 'income') return { ...acc, current_balance: acc.current_balance + numAmount };
          if (type === 'expense' || type === 'transfer') return { ...acc, current_balance: acc.current_balance - numAmount };
        }
        if (type === 'transfer' && acc.id === transferToAccountId) {
          return { ...acc, current_balance: acc.current_balance + numAmount };
        }
        return acc;
      });

      allTransactions = allTransactions.map(t => {
        if (t.id !== editItem.id) return t;
        return {
          ...t,
          type,
          segment,
          account_id: accountId,
          transfer_to_account_id: type === 'transfer' ? transferToAccountId : null,
          category_id: type === 'transfer' ? null : categoryId,
          amount: numAmount,
          date,
          note,
        };
      });

      StorageAdapter.saveTransactions(allTransactions);
      StorageAdapter.saveAccounts(allAccounts);
    } else {
      const newTx = {
        id: `tx-${Date.now()}`,
        type,
        segment,
        account_id: accountId,
        transfer_to_account_id: type === 'transfer' ? transferToAccountId : null,
        category_id: type === 'transfer' ? null : categoryId,
        amount: numAmount,
        date,
        note,
      };

      allAccounts = allAccounts.map(acc => {
        if (acc.id === accountId) {
          if (type === 'income') return { ...acc, current_balance: acc.current_balance + numAmount };
          if (type === 'expense' || type === 'transfer') return { ...acc, current_balance: acc.current_balance - numAmount };
        }
        if (type === 'transfer' && acc.id === transferToAccountId) {
          return { ...acc, current_balance: acc.current_balance + numAmount };
        }
        return acc;
      });

      StorageAdapter.saveTransactions([newTx, ...allTransactions]);
      StorageAdapter.saveAccounts(allAccounts);
    }

    onRefresh();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative z-10 bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto"
          >

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h2 className="text-base font-bold text-slate-800">
                {isEditMode ? '✏️ লেনদেন সম্পাদনা করুন' : 'নতুন লেনদেন যোগ করুন'}
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Type Switcher */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
                {[
                  ['expense',  'ব্যয় (Expense)', 'bg-rose-500 text-white'],
                  ['income',   'আয় (Income)',   'bg-emerald-600 text-white'],
                  ['transfer', 'ট্রান্সফার',     'bg-sky-600 text-white'],
                ].map(([tVal, label, activeCls]) => (
                  <button key={tVal} type="button" onClick={() => setType(tVal)}
                    className={`py-2 text-xs font-bold rounded-xl transition-all ${type === tVal ? activeCls + ' shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Segment Switcher */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['personal', 'পার্সোনাল', 'bg-violet-50 border-violet-200 text-violet-800'],
                  ['business', 'বিজনেস',    'bg-amber-50 border-amber-200 text-amber-800'],
                ].map(([sVal, label, activeCls]) => (
                  <button key={sVal} type="button" onClick={() => setSegment(sVal)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${segment === sVal ? activeCls + ' ring-2 ring-violet-500/20 font-extrabold' : 'border-slate-200 text-slate-600'}`}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">টাকার পরিমাণ (৳)</label>
                <input type="number" step="0.01" required placeholder="0.00" value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full text-xl font-bold px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30 text-slate-800" />
              </div>

              {/* Account + Category/Transfer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{type === 'transfer' ? 'কোথা থেকে (From)' : 'অ্যাকাউন্ট'}</label>
                  <select value={accountId} onChange={e => setAccountId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30">
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} (৳{acc.current_balance})</option>)}
                  </select>
                </div>

                {type === 'transfer' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">কোথায় (To)</label>
                    <select value={transferToAccountId} onChange={e => setTransferToAccountId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30">
                      {accounts.filter(a => a.id !== accountId).map(acc => <option key={acc.id} value={acc.id}>{acc.name} (৳{acc.current_balance})</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">ক্যাটাগরি</label>
                    <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30">
                      {filteredCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Date + Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">তারিখ</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">নোট/বিবরণ</label>
                  <input type="text" placeholder="যেমন: মাসিক বাজার" value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full mt-2 py-3 bg-[#0D5C46] hover:bg-[#094232] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>{isEditMode ? 'পরিবর্তন সংরক্ষণ করুন' : 'সংরক্ষণ করুন'}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
