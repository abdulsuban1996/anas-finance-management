'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import TransactionModal from './TransactionModal';
import TransferModal from './TransferModal';

export default function ClientLayout({ children }) {
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('PWA ServiceWorker registered:', reg.scope))
        .catch((err) => console.log('ServiceWorker error:', err));
    }
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anas_storage_updated'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FB]">
      
      {/* Top Navbar */}
      <Navbar
        onOpenTransaction={() => setIsTxModalOpen(true)}
        onOpenTransfer={() => setIsTransferModalOpen(true)}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {React.isValidElement(children)
            ? React.cloneElement(children, { refreshKey, onRefresh: handleRefresh })
            : children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onRefresh={handleRefresh}
      />
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onRefresh={handleRefresh}
      />

    </div>
  );
}
