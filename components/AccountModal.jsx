'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { StorageAdapter } from '../lib/storage';

export default function AccountModal({ isOpen, onClose, onRefresh, editItem = null }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('bank');
  const [openingBalance, setOpeningBalance] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const isEditMode = !!editItem;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setName(editItem.name || '');
        setType(editItem.type || 'bank');
        setOpeningBalance(String(editItem.opening_balance ?? ''));
        setAccountNumber(editItem.account_number === 'N/A' ? '' : (editItem.account_number || ''));
      } else {
        setName('');
        setType('bank');
        setOpeningBalance('');
        setAccountNumber('');
      }
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('অ্যাকাউন্টের নাম দিন');

    const existingAccs = StorageAdapter.getAccounts();

    if (isEditMode) {
      const updatedAccs = existingAccs.map(acc => {
        if (acc.id !== editItem.id) return acc;
        const oldOpening = acc.opening_balance;
        const newOpening = parseFloat(openingBalance) || 0;
        const diff = newOpening - oldOpening;
        return {
          ...acc,
          name,
          type,
          account_number: accountNumber || 'N/A',
          opening_balance: newOpening,
          current_balance: acc.current_balance + diff,
          icon: type === 'bank' ? 'landmark' : type === 'mfs' ? 'smartphone' : type === 'business' ? 'briefcase' : 'wallet',
        };
      });
      StorageAdapter.saveAccounts(updatedAccs);
    } else {
      const initialBal = parseFloat(openingBalance) || 0;
      const newAcc = {
        id: `acc-${Date.now()}`,
        name,
        type,
        opening_balance: initialBal,
        current_balance: initialBal,
        account_number: accountNumber || 'N/A',
        icon: type === 'bank' ? 'landmark' : type === 'mfs' ? 'smartphone' : type === 'business' ? 'briefcase' : 'wallet',
      };
      StorageAdapter.saveAccounts([...existingAccs, newAcc]);
    }

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
              <h2 className="text-base font-bold text-slate-800">
                {isEditMode ? '✏️ অ্যাকাউন্ট সম্পাদনা করুন' : 'নতুন অ্যাকাউন্ট যোগ করুন'}
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">অ্যাকাউন্টের নাম</label>
                <input type="text" required placeholder="যেমন: City Bank / Nagad Personal"
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">অ্যাকাউন্টের ধরন</label>
                <select value={type} onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30">
                  <option value="cash">ক্যাশ (Cash)</option>
                  <option value="bank">ব্যাংক (Bank)</option>
                  <option value="mfs">মোবাইল ব্যাংকিং (bKash/Nagad/Rocket)</option>
                  <option value="business">বিজনেস অ্যাকাউন্ট (Business)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">শুরুর ব্যালেন্স (Opening Balance)</label>
                <input type="number" step="0.01" placeholder="0.00"
                  value={openingBalance} onChange={e => setOpeningBalance(e.target.value)}
                  className="w-full text-base font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/30" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">অ্যাকাউন্ট নম্বর (ঐচ্ছিক)</label>
                <input type="text" placeholder="যেমন: 017xxxxxxxx বা ব্যাংক অ্যাকাউন্ট নং"
                  value={accountNumber} onChange={e => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full py-3 bg-[#0D5C46] hover:bg-[#094232] text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>{isEditMode ? 'পরিবর্তন সংরক্ষণ করুন' : 'অ্যাকাউন্ট তৈরি করুন'}</span>
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
