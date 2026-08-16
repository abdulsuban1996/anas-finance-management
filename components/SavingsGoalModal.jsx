'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { StorageAdapter } from '../lib/storage';

export default function SavingsGoalModal({ isOpen, onClose, onRefresh, depositGoal = null, editItem = null }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const isEditMode = !!editItem && !depositGoal;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setName(editItem.name || '');
        setTargetAmount(String(editItem.target_amount || ''));
        setCurrentAmount(String(editItem.current_amount || ''));
        setDeadline(editItem.deadline || '');
      } else if (!depositGoal) {
        setName(''); setTargetAmount(''); setCurrentAmount(''); setDeadline('');
      }
      setDepositAmount('');
    }
  }, [isOpen]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!name || !targetAmount) return alert('সকল ঘর পূরণ করুন');

    const goals = StorageAdapter.getSavingsGoals();
    const tgt = parseFloat(targetAmount);
    const cur = parseFloat(currentAmount) || 0;

    if (isEditMode) {
      const updatedGoals = goals.map(g =>
        g.id === editItem.id
          ? { ...g, name, target_amount: tgt, current_amount: cur, deadline: deadline || null, status: cur >= tgt ? 'achieved' : 'active' }
          : g
      );
      StorageAdapter.saveSavingsGoals(updatedGoals);
    } else {
      const newGoal = {
        id: `svg-${Date.now()}`,
        name, target_amount: tgt, current_amount: cur,
        deadline: deadline || null,
        status: cur >= tgt ? 'achieved' : 'active',
      };
      StorageAdapter.saveSavingsGoals([newGoal, ...goals]);
    }

    try {
      if (typeof onRefresh === 'function') onRefresh();
    } catch (e) {}
    try {
      if (typeof onClose === 'function') onClose();
    } catch (e) {}
  };

  const handleAddDeposit = (e) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) return alert('সঠিক জমা এমাউন্ট দিন');

    const addAmt = parseFloat(depositAmount);
    const goals = StorageAdapter.getSavingsGoals();
    const updatedGoals = goals.map(g => {
      if (g.id === depositGoal.id) {
        const newTotal = g.current_amount + addAmt;
        return { ...g, current_amount: newTotal, status: newTotal >= g.target_amount ? 'achieved' : 'active' };
      }
      return g;
    });

    StorageAdapter.saveSavingsGoals(updatedGoals);
    try {
      if (typeof onRefresh === 'function') onRefresh();
    } catch (e) {}
    try {
      if (typeof onClose === 'function') onClose();
    } catch (e) {}
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
            {depositGoal ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-800">সেভিংস গোল টাকা জমা করুন</h2>
                  <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl mb-4 text-xs font-semibold space-y-1">
                  <p className="text-slate-700">গোল: <span className="font-bold text-slate-900">{depositGoal.name}</span></p>
                  <p className="text-slate-700">বর্তমান জমা: <span className="font-bold text-[#0D5C46]">৳{depositGoal.current_amount}</span> / ৳{depositGoal.target_amount}</p>
                </div>
                <form onSubmit={handleAddDeposit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">জমার পরিমাণ (৳)</label>
                    <input type="number" step="0.01" required placeholder="0.00"
                      value={depositAmount} onChange={e => setDepositAmount(e.target.value)}
                      className="w-full text-lg font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit"
                    className="w-full py-3 bg-[#0D5C46] hover:bg-[#094232] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /><span>টাকা যোগ করুন</span>
                  </motion.button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-800">
                    {isEditMode ? '✏️ সেভিংস গোল সম্পাদনা করুন' : 'নতুন সেভিংস গোল'}
                  </h2>
                  <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">গোলের নাম</label>
                    <input type="text" required placeholder="যেমন: নতুন ল্যাপটপ / ইমার্জেন্সি ফান্ড"
                      value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">টার্গেট এমাউন্ট (৳)</label>
                    <input type="number" step="0.01" required placeholder="0.00"
                      value={targetAmount} onChange={e => setTargetAmount(e.target.value)}
                      className="w-full text-base font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">প্রাথমিক জমা (ঐচ্ছিক)</label>
                    <input type="number" step="0.01" placeholder="0.00"
                      value={currentAmount} onChange={e => setCurrentAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">সময়সীমা / ড্যাডলাইন</label>
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit"
                    className="w-full py-3 bg-[#0D5C46] hover:bg-[#094232] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>{isEditMode ? 'পরিবর্তন সংরক্ষণ করুন' : 'গোল তৈরি করুন'}</span>
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
