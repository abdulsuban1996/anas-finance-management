'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { StorageAdapter } from '../lib/storage';

export default function LoanModal({ isOpen, onClose, onRefresh, paymentLoan = null, editItem = null }) {
  const [personName, setPersonName] = useState('');
  const [type, setType] = useState('receivable');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');

  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  const isEditMode = !!editItem;

  useEffect(() => {
    if (isOpen && isEditMode && !paymentLoan) {
      setPersonName(editItem.person_name || '');
      setType(editItem.type || 'receivable');
      setAmount(String(editItem.amount || ''));
      setDueDate(editItem.due_date || '');
      setNote(editItem.note || '');
    } else if (isOpen && !isEditMode && !paymentLoan) {
      setPersonName('');
      setType('receivable');
      setAmount('');
      setDueDate('');
      setNote('');
    }
    if (isOpen && paymentLoan) {
      setPaymentAmount('');
      setPaymentNote('');
    }
  }, [isOpen]);

  const handleAddLoan = (e) => {
    e.preventDefault();
    if (!personName || !amount) return alert('সকল ঘর সঠিকভাবে পূরণ করুন');

    const numAmt = parseFloat(amount);
    const loans = StorageAdapter.getLoans();

    if (isEditMode) {
      const updatedLoans = loans.map(l => {
        if (l.id !== editItem.id) return l;
        const diff = numAmt - l.amount;
        return {
          ...l,
          person_name: personName,
          type,
          amount: numAmt,
          remaining_amount: Math.max(0, l.remaining_amount + diff),
          due_date: dueDate || null,
          note,
        };
      });
      StorageAdapter.saveLoans(updatedLoans);
    } else {
      const newLoan = {
        id: `lon-${Date.now()}`,
        person_name: personName,
        type,
        amount: numAmt,
        remaining_amount: numAmt,
        date: new Date().toISOString().split('T')[0],
        due_date: dueDate || null,
        status: 'pending',
        note: note || '',
        payments: [],
      };
      StorageAdapter.saveLoans([newLoan, ...loans]);
    }

    try {
      if (typeof onRefresh === 'function') onRefresh();
    } catch (e) {}
    try {
      if (typeof onClose === 'function') onClose();
    } catch (e) {}
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) return alert('সঠিক পরিশোধের অ্যামাউন্ট দিন');

    const payAmt = parseFloat(paymentAmount);
    const loans = StorageAdapter.getLoans();

    const updatedLoans = loans.map(l => {
      if (l.id === paymentLoan.id) {
        const newRemaining = Math.max(0, l.remaining_amount - payAmt);
        return {
          ...l,
          remaining_amount: newRemaining,
          status: newRemaining === 0 ? 'paid' : 'partial',
          payments: [...(l.payments || []), {
            id: `pmt-${Date.now()}`,
            amount: payAmt,
            date: new Date().toISOString().split('T')[0],
            note: paymentNote || 'কিস্তি পরিশোধ',
          }],
        };
      }
      return l;
    });

    StorageAdapter.saveLoans(updatedLoans);
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
            {/* Payment Mode */}
            {paymentLoan ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-800">ধার/দেনা পরিশোধ রেকর্ড করুন</h2>
                  <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl mb-4 text-xs font-semibold space-y-1">
                  <p className="text-slate-700">ব্যক্তি: <span className="font-bold text-slate-900">{paymentLoan.person_name}</span></p>
                  <p className="text-slate-700">অবশিষ্ট বকেয়া: <span className="font-bold text-red-600">৳{paymentLoan.remaining_amount}</span></p>
                </div>

                <form onSubmit={handleAddPayment} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">আজকের জমা/পরিশোধের পরিমাণ (৳)</label>
                    <input type="number" step="0.01" required max={paymentLoan.remaining_amount} placeholder="0.00"
                      value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)}
                      className="w-full text-lg font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">নোট (ঐচ্ছিক)</label>
                    <input type="text" placeholder="যেমন: ১ম কিস্তি বকেয়া পরিশোধ"
                      value={paymentNote} onChange={e => setPaymentNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit"
                    className="w-full py-3 bg-[#0D5C46] hover:bg-[#094232] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" /><span>পরিশোধের তথ্য সংরক্ষণ করুন</span>
                  </motion.button>
                </form>
              </>
            ) : (
              /* Add/Edit Mode */
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-slate-800">
                    {isEditMode ? '✏️ লোন/ধার সম্পাদনা করুন' : 'নতুন লোন/ধার-দেনা এন্ট্রি'}
                  </h2>
                  <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleAddLoan} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['receivable', 'আমি পাব', 'bg-emerald-50 border-emerald-300 text-emerald-800 ring-2 ring-emerald-500/20'],
                      ['payable', 'আমি দেব', 'bg-red-50 border-red-300 text-red-800 ring-2 ring-red-500/20']
                    ].map(([val, label, activeClass]) => (
                      <button key={val} type="button" onClick={() => setType(val)}
                        className={`py-2.5 text-xs font-bold rounded-xl border transition-all ${type === val ? activeClass : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">ব্যক্তি বা প্রতিষ্ঠানের নাম</label>
                    <input type="text" required placeholder="যেমন: আরিফ ভাই / রাসেল আহমেদ"
                      value={personName} onChange={e => setPersonName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">মোট পরিমাণ (৳)</label>
                    <input type="number" step="0.01" required placeholder="0.00"
                      value={amount} onChange={e => setAmount(e.target.value)}
                      className="w-full text-base font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">ফেরতের শেষ তারিখ (Due Date)</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">নোট/বিবরণ</label>
                    <input type="text" placeholder="যেমন: ইমার্জেন্সি সাপোর্ট"
                      value={note} onChange={e => setNote(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold" />
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit"
                    className="w-full py-3 bg-[#0D5C46] hover:bg-[#094232] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>{isEditMode ? 'পরিবর্তন সংরক্ষণ করুন' : 'সংরক্ষণ করুন'}</span>
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
