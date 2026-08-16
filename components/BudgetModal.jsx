'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { StorageAdapter } from '../lib/storage';

export default function BudgetModal({ isOpen, onClose, onRefresh, editItem = null }) {
  const [categoryId, setCategoryId] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [categories, setCategories] = useState([]);

  const isEditMode = !!editItem;

  useEffect(() => {
    if (isOpen) {
      const cats = StorageAdapter.getCategories().filter(c => c.type === 'expense');
      setCategories(cats);

      if (isEditMode) {
        setCategoryId(editItem.category_id || (cats[0]?.id ?? ''));
        setBudgetAmount(String(editItem.budget_amount || ''));
        setMonth(editItem.month || new Date().getMonth() + 1);
        setYear(editItem.year || new Date().getFullYear());
      } else {
        if (cats.length > 0) setCategoryId(cats[0].id);
        setBudgetAmount('');
        setMonth(new Date().getMonth() + 1);
        setYear(new Date().getFullYear());
      }
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) return alert('সঠিক বাজেট এমাউন্ট দিন');

    const numAmt = parseFloat(budgetAmount);
    const budgets = StorageAdapter.getBudgets();

    if (isEditMode) {
      const updatedBudgets = budgets.map(b =>
        b.id === editItem.id ? { ...b, category_id: categoryId, budget_amount: numAmt, month: parseInt(month), year: parseInt(year) } : b
      );
      StorageAdapter.saveBudgets(updatedBudgets);
    } else {
      const existingIndex = budgets.findIndex(
        b => b.category_id === categoryId && b.month === parseInt(month) && b.year === parseInt(year)
      );
      let updatedBudgets = [...budgets];
      if (existingIndex >= 0) {
        updatedBudgets[existingIndex].budget_amount = numAmt;
      } else {
        updatedBudgets.push({ id: `bgt-${Date.now()}`, category_id: categoryId, month: parseInt(month), year: parseInt(year), budget_amount: numAmt });
      }
      StorageAdapter.saveBudgets(updatedBudgets);
    }

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
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-800">
                {isEditMode ? '✏️ বাজেট সম্পাদনা করুন' : 'মাসিক বাজেট সেট করুন'}
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">ক্যাটাগরি</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30">
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name} ({cat.segment === 'personal' ? 'পার্সোনাল' : 'বিজনেস'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">বাজেট পরিমাণ (৳)</label>
                <input type="number" step="0.01" required placeholder="0.00"
                  value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)}
                  className="w-full text-base font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit"
                className="w-full py-3 bg-[#0D5C46] hover:bg-[#094232] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                <span>{isEditMode ? 'পরিবর্তন সংরক্ষণ করুন' : 'বাজেট সেভ করুন'}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
