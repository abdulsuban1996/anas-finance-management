'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageAdapter } from '../../lib/storage';
import { Target, Plus, AlertTriangle, CheckCircle2, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import BudgetModal from '../../components/BudgetModal';
import SavingsGoalModal from '../../components/SavingsGoalModal';
import { pageVariant, cardVariant, staggerContainer, fadeUp } from '../../lib/motion';

export default function BudgetsPage({ refreshKey, onRefresh }) {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState(null);
  const [editGoal, setEditGoal] = useState(null);
  const [editBudget, setEditBudget] = useState(null);

  const [deleteBudgetId, setDeleteBudgetId] = useState(null);
  const [deleteGoalId, setDeleteGoalId] = useState(null);

  const loadData = () => {
    setBudgets(StorageAdapter.getBudgets());
    setCategories(StorageAdapter.getCategories());
    setTransactions(StorageAdapter.getTransactions());
    setSavingsGoals(StorageAdapter.getSavingsGoals());
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      window.addEventListener('anas_storage_updated', loadData);
      return () => window.removeEventListener('anas_storage_updated', loadData);
    }
  }, [refreshKey]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const getSpentForCategory = (catId) =>
    transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.category_id === catId && t.type === 'expense' && d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);

  const getCategoryObj = (catId) => categories.find(c => c.id === catId);

  const handleDeleteBudget = (id) => {
    StorageAdapter.saveBudgets(StorageAdapter.getBudgets().filter(b => b.id !== id));
    setDeleteBudgetId(null);
    onRefresh();
  };

  const handleDeleteGoal = (id) => {
    StorageAdapter.saveSavingsGoals(StorageAdapter.getSavingsGoals().filter(g => g.id !== id));
    setDeleteGoalId(null);
    onRefresh();
  };

  const banglaMonths = ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'];

  return (
    <motion.div variants={pageVariant} initial="hidden" animate="visible" className="space-y-8">

      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">বাজেট প্ল্যানিং ও সেভিংস গোল</h1>
          <p className="text-xs text-slate-500 mt-0.5">মাসিক খরচের সীমাবদ্ধতা এবং দীর্ঘমেয়াদী সঞ্চয়ের লক্ষ্য</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => { setEditBudget(null); setIsBudgetModalOpen(true); }}
            className="flex items-center gap-1.5 bg-[#0D5C46] hover:bg-[#094232] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all">
            <Plus className="w-4 h-4" /><span>নতুন বাজেট</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => { setDepositGoal(null); setEditGoal(null); setIsGoalModalOpen(true); }}
            className="flex items-center gap-1.5 bg-[#1A3A5C] hover:bg-[#122840] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all">
            <Plus className="w-4 h-4" /><span>নতুন সেভিংস গোল</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── Monthly Budgets ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-[#0D5C46]" />
          <h2 className="text-base font-bold text-slate-800">
            মাসিক ক্যাটাগরি বাজেট ({banglaMonths[currentMonth - 1]} {currentYear})
          </h2>
        </div>

        {budgets.length === 0 && (
          <p className="text-sm text-slate-400 font-semibold py-4 text-center">কোনো বাজেট সেট করা হয়নি।</p>
        )}

        <motion.div variants={staggerContainer(0.09)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.map((bgt) => {
            const cat = getCategoryObj(bgt.category_id);
            const spent = getSpentForCategory(bgt.category_id);
            const percentage = Math.min(100, Math.round((spent / bgt.budget_amount) * 100));
            const isOver = spent > bgt.budget_amount;
            const isDeleting = deleteBudgetId === bgt.id;

            return (
              <motion.div key={bgt.id} variants={cardVariant} whileHover={{ y: -4, boxShadow: '0 16px 32px -8px rgba(0,0,0,0.09)' }} transition={{ type: 'spring', stiffness: 280, damping: 20 }} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3">
                {isDeleting ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-3">
                    <p className="text-xs font-bold text-red-700">"{cat?.name}" বাজেটটি মুছে ফেলবেন?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteBudgetId(null)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600">বাতিল</button>
                      <button onClick={() => handleDeleteBudget(bgt.id)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white">হ্যাঁ, মুছুন</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{cat ? cat.name : 'ক্যাটাগরি'}</h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{cat?.segment}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isOver && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                            <AlertTriangle className="w-3.5 h-3.5" /><span>ছাড়িয়েছে!</span>
                          </span>
                        )}
                        <button onClick={() => { setEditBudget(bgt); setIsBudgetModalOpen(true); }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-[#0D5C46] hover:bg-emerald-50 transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteBudgetId(bgt.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-600">খরচ: ৳{spent.toLocaleString('bn-BD')}</span>
                        <span className="text-slate-800">বাজেট: ৳{bgt.budget_amount.toLocaleString('bn-BD')}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
                          className={`h-full rounded-full ${isOver ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-[#0D5C46]'}`}
                        />
                      </div>
                      <p className="text-[10px] text-right font-semibold text-slate-400">{percentage}% খরচ শেষ</p>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Savings Goals ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-bold text-slate-800">সেভিংস ও লক্ষ্যপূরণ (Savings Goals)</h2>
        </div>

        {savingsGoals.length === 0 && (
          <p className="text-sm text-slate-400 font-semibold py-4 text-center">কোনো সেভিংস গোল নেই।</p>
        )}

        <motion.div variants={staggerContainer(0.08)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {savingsGoals.map((goal) => {
            const goalPercent = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
            const isAchieved = goal.status === 'achieved' || goal.current_amount >= goal.target_amount;
            const isDeleting = deleteGoalId === goal.id;

            return (
              <motion.div key={goal.id} variants={cardVariant} whileHover={{ y: -4, boxShadow: '0 16px 32px -8px rgba(124,58,237,0.12)' }} transition={{ type: 'spring', stiffness: 280, damping: 20 }} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                {isDeleting ? (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-3">
                    <p className="text-xs font-bold text-red-700">"{goal.name}" গোলটি মুছে ফেলবেন?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteGoalId(null)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600">বাতিল</button>
                      <button onClick={() => handleDeleteGoal(goal.id)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white">হ্যাঁ, মুছুন</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-800 text-sm">{goal.name}</h3>
                        <div className="flex items-center gap-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isAchieved ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'}`}>
                            {isAchieved ? 'অর্জিত ✓' : 'সচল'}
                          </span>
                          <button onClick={() => { setEditGoal(goal); setDepositGoal(null); setIsGoalModalOpen(true); }}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteGoalId(goal.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xl font-extrabold text-slate-900 amount-font mt-1">
                        ৳{goal.current_amount.toLocaleString('bn-BD')}
                        <span className="text-xs font-semibold text-slate-400"> / ৳{goal.target_amount.toLocaleString('bn-BD')}</span>
                      </div>

                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden my-3">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: `${goalPercent}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                          className="h-full bg-purple-600 rounded-full"
                        />
                      </div>

                      <p className="text-[11px] text-slate-500">
                        সময়সীমা: <span className="font-bold text-slate-700">{goal.deadline || 'নির্দিষ্ট নয়'}</span>
                      </p>
                    </div>

                    {!isAchieved && (
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                        onClick={() => { setDepositGoal(goal); setEditGoal(null); setIsGoalModalOpen(true); }}
                        className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-all">
                        + টাকা যোগ করুন
                      </motion.button>
                    )}
                  </>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Modals */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => { setIsBudgetModalOpen(false); setEditBudget(null); }}
        onRefresh={onRefresh}
        editItem={editBudget}
      />
      <SavingsGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => { setIsGoalModalOpen(false); setDepositGoal(null); setEditGoal(null); }}
        onRefresh={onRefresh}
        depositGoal={depositGoal}
        editItem={editGoal}
      />
    </motion.div>
  );
}
