'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorageAdapter } from '../../lib/storage';
import { Landmark, Smartphone, Wallet, Briefcase, Plus, ArrowLeftRight, CreditCard, Pencil, Trash2 } from 'lucide-react';
import AccountModal from '../../components/AccountModal';
import TransferModal from '../../components/TransferModal';
import { pageVariant, cardVariant, staggerContainer, fadeUp, numberPop } from '../../lib/motion';

export default function AccountsPage({ refreshKey, onRefresh }) {
  const [accounts, setAccounts] = useState([]);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    setAccounts(StorageAdapter.getAccounts());
  }, [refreshKey]);

  const totalBalance = accounts.reduce((acc, a) => acc + (a.current_balance || 0), 0);

  const getAccountIcon = (type) => {
    switch (type) {
      case 'bank': return Landmark;
      case 'mfs': return Smartphone;
      case 'business': return Briefcase;
      default: return Wallet;
    }
  };

  const handleDelete = (accId) => {
    const updated = StorageAdapter.getAccounts().filter(a => a.id !== accId);
    StorageAdapter.saveAccounts(updated);
    setDeleteConfirmId(null);
    onRefresh();
  };

  return (
    <motion.div variants={pageVariant} initial='hidden' animate='visible' className="space-y-6">

      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">অ্যাকাউন্ট ও ওয়ালেট ম্যানেজমেন্ট</h1>
          <p className="text-xs text-slate-500 mt-0.5">সবগুলো ব্যাংকিং, ক্যাশ ও ডিজিটাল ওয়ালেটের ব্যালেন্স</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setIsTransferModalOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all">
            <ArrowLeftRight className="w-4 h-4 text-[#1A3A5C]" />
            <span>ফান্ড ট্রান্সফার</span>
          </motion.button>
          <motion.button
            onClick={() => { setEditAccount(null); setIsAccountModalOpen(true); }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="flex items-center gap-1.5 bg-[#0D5C46] hover:bg-[#094232] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all">
            <Plus className="w-4 h-4" />
            <span>নতুন অ্যাকাউন্ট</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        variants={fadeUp}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="p-5 rounded-3xl bg-gradient-to-r from-[#1A3A5C] via-[#122840] to-[#0D5C46] text-white shadow-xl shadow-[#0D5C46]/20">
        <p className="text-xs text-emerald-200 font-bold uppercase tracking-wider">সর্বমোট লাইভ ব্যালেন্স</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold amount-font mt-1 text-white">
          <motion.span variants={numberPop}>
            ৳{totalBalance.toLocaleString('bn-BD')}
          </motion.span>
        </h2>
        <p className="text-xs text-emerald-100/90 mt-2 font-medium">{accounts.length} টি সচল ওয়ালেট</p>
      </motion.div>

      {/* Accounts Grid */}
      <motion.div variants={staggerContainer(0.09)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const Icon = getAccountIcon(acc.type);
          const isDeleting = deleteConfirmId === acc.id;

          return (
            <motion.div
              key={acc.id}
              variants={cardVariant}
              whileHover={{ y: -5, boxShadow: '0 16px 32px -8px rgba(0,0,0,0.1)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">

              <AnimatePresence mode="wait">
                {isDeleting ? (
                  <motion.div
                    key="delete-confirm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-3">
                    <p className="text-xs font-bold text-red-700">"{acc.name}" অ্যাকাউন্টটি মুছে ফেলবেন?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                        বাতিল
                      </button>
                      <button onClick={() => handleDelete(acc.id)}
                        className="flex-1 py-1.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white">
                        হ্যাঁ, মুছুন
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="account-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#0D5C46]/10 text-[#0D5C46] flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{acc.name}</h3>
                          <span className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 mt-0.5">
                            {acc.type === 'cash' ? 'ক্যাশ' : acc.type === 'bank' ? 'ব্যাংক' : acc.type === 'mfs' ? 'মোবাইল ওয়ালেট' : 'বিজনেস'}
                          </span>
                        </div>
                      </div>

                      {/* Edit / Delete */}
                      <div className="flex items-center gap-1">
                        <motion.button
                          onClick={() => { setEditAccount(acc); setIsAccountModalOpen(true); }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-[#0D5C46] hover:bg-emerald-50 transition-colors" title="সম্পাদনা">
                          <Pencil className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => setDeleteConfirmId(acc.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="মুছুন">
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>বর্তমান ব্যালেন্স</span>
                        <span>শুরুর: ৳{acc.opening_balance}</span>
                      </div>
                      <div className="text-2xl font-extrabold text-slate-900 amount-font">
                        ৳{acc.current_balance.toLocaleString('bn-BD')}
                      </div>
                    </div>

                    {acc.account_number && acc.account_number !== 'N/A' && (
                      <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>নম্বর: <strong className="text-slate-700">{acc.account_number}</strong></span>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => { setIsAccountModalOpen(false); setEditAccount(null); }}
        onRefresh={onRefresh}
        editItem={editAccount}
      />
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onRefresh={onRefresh}
      />
    </motion.div>
  );
}
