'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageAdapter } from '../../lib/storage';
import { Plus, Calendar, ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import LoanModal from '../../components/LoanModal';
import { pageVariant, cardVariant, staggerContainer, fadeUp, numberPop } from '../../lib/motion';

export default function LoansPage({ refreshKey, onRefresh }) {
  const [loans, setLoans] = useState([]);
  const [activeTab, setActiveTab] = useState('receivable');

  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [paymentLoan, setPaymentLoan] = useState(null);
  const [editLoan, setEditLoan] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const loadData = () => {
    setLoans(StorageAdapter.getLoans());
  };

  useEffect(() => {
    loadData();
    if (typeof window !== 'undefined') {
      window.addEventListener('anas_storage_updated', loadData);
      return () => window.removeEventListener('anas_storage_updated', loadData);
    }
  }, [refreshKey]);

  const filteredLoans = loans.filter(l => l.type === activeTab);

  const totalReceivable = loans
    .filter(l => l.type === 'receivable')
    .reduce((sum, l) => sum + l.remaining_amount, 0);

  const totalPayable = loans
    .filter(l => l.type === 'payable')
    .reduce((sum, l) => sum + l.remaining_amount, 0);

  const handleDelete = (id) => {
    const updated = StorageAdapter.getLoans().filter(l => l.id !== id);
    StorageAdapter.saveLoans(updated);
    setDeleteConfirmId(null);
    onRefresh();
  };

  return (
    <motion.div variants={pageVariant} initial="hidden" animate="visible" className="space-y-6">

      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">ধার-দেনা ও লোন ম্যানেজমেন্ট</h1>
          <p className="text-xs text-slate-500 mt-0.5">কাউকে টাকা ধার দেওয়া এবং ধার নেওয়ার সঠিক হিসাব</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => { setEditLoan(null); setPaymentLoan(null); setIsLoanModalOpen(true); }}
          className="flex items-center gap-1.5 bg-[#0D5C46] hover:bg-[#094232] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন লোন এন্ট্রি</span>
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={staggerContainer(0.1)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div variants={cardVariant} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300 }} className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-bold">আমি পাব (Receivable)</span>
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
          </div>
          <motion.div variants={numberPop} className="text-3xl font-extrabold text-emerald-900 amount-font">
            ৳{totalReceivable.toLocaleString('bn-BD')}
          </motion.div>
        </motion.div>
        <motion.div variants={cardVariant} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300 }} className="p-5 rounded-3xl bg-red-50 border border-red-200">
          <div className="flex items-center justify-between text-red-800 mb-1">
            <span className="text-xs font-bold">আমি দেব (Payable)</span>
            <ArrowDownLeft className="w-5 h-5 text-red-600" />
          </div>
          <motion.div variants={numberPop} className="text-3xl font-extrabold text-red-900 amount-font">
            ৳{totalPayable.toLocaleString('bn-BD')}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={fadeUp} className="flex border-b border-slate-200">
        {[
          ['receivable', 'আমি ধার দিয়েছি (পাওনা)', 'border-[#0D5C46] text-[#0D5C46]'],
          ['payable', 'আমি ধার নিয়েছি (দেনা)', 'border-red-600 text-red-600']
        ].map(([val, label, activeClass]) => (
          <motion.button
            key={val}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab(val)}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${activeTab === val ? activeClass : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* Loans Grid */}
      <motion.div variants={staggerContainer(0.08)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLoans.length === 0 && (
          <div className="col-span-2 py-10 text-center text-slate-400 font-semibold text-sm">
            কোনো লোন/ধারের তথ্য নেই।
          </div>
        )}
        {filteredLoans.map((loan) => {
          const isPaid = loan.status === 'paid' || loan.remaining_amount === 0;
          const isDeleting = deleteConfirmId === loan.id;

          return (
            <motion.div
              key={loan.id}
              variants={cardVariant}
              whileHover={{ y: -4, boxShadow: '0 16px 32px -8px rgba(0,0,0,0.08)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4"
            >
              <AnimatePresence mode="wait">
                {isDeleting ? (
                  <motion.div
                    key="delete-confirm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-3"
                  >
                    <p className="text-xs font-bold text-red-700">"{loan.person_name}" এর লোন মুছে ফেলবেন?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600">বাতিল</button>
                      <button onClick={() => handleDelete(loan.id)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white">হ্যাঁ, মুছুন</button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="normal-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">{loan.person_name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{loan.note || 'কোনো বিবরণ নেই'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase ${
                          isPaid ? 'bg-emerald-100 text-emerald-800' : loan.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isPaid ? 'পরিশোধিত' : loan.status === 'partial' ? 'আংশিক' : 'বকেয়া'}
                        </span>
                        {/* Edit */}
                        <motion.button
                          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                          onClick={() => { setEditLoan(loan); setPaymentLoan(null); setIsLoanModalOpen(true); }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-[#0D5C46] hover:bg-emerald-50 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </motion.button>
                        {/* Delete */}
                        <motion.button
                          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteConfirmId(loan.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold block">মূল পরিমাণ</span>
                        <span className="font-bold text-slate-800 text-sm amount-font">৳{loan.amount.toLocaleString('bn-BD')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block">বকেয়া</span>
                        <span className="font-extrabold text-red-600 text-sm amount-font">৳{loan.remaining_amount.toLocaleString('bn-BD')}</span>
                      </div>
                    </div>

                    {loan.due_date && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>ফেরতের শেষ তারিখ: <strong className="text-slate-700">{loan.due_date}</strong></span>
                      </div>
                    )}

                    {loan.payments && loan.payments.length > 0 && (
                      <div className="border-t border-slate-100 pt-3">
                        <p className="text-[11px] font-bold text-slate-500 mb-2">পরিশোধের ইতিহাস ({loan.payments.length} টি কিস্তি):</p>
                        <div className="space-y-1.5">
                          {loan.payments.map((p, idx) => (
                            <div key={idx} className="flex justify-between text-xs bg-slate-50 px-2.5 py-1 rounded-lg">
                              <span className="text-slate-600">{p.date} ({p.note})</span>
                              <span className="font-bold text-emerald-700">৳{p.amount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!isPaid && (
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                        onClick={() => { setPaymentLoan(loan); setEditLoan(null); setIsLoanModalOpen(true); }}
                        className="w-full py-2.5 bg-[#0D5C46] hover:bg-[#094232] text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                      >
                        + কিস্তি / আংশিক পরিশোধ জমা দিন
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      <LoanModal
        isOpen={isLoanModalOpen}
        onClose={() => { setIsLoanModalOpen(false); setEditLoan(null); setPaymentLoan(null); }}
        onRefresh={onRefresh}
        paymentLoan={paymentLoan}
        editItem={editLoan}
      />
    </motion.div>
  );
}
