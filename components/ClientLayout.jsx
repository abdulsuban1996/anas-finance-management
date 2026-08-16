'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import TransactionModal from './TransactionModal';
import TransferModal from './TransferModal';
import LoginScreen from './LoginScreen';
import { AuthAdapter } from '../lib/auth';

export default function ClientLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const checkAuth = () => {
    setIsAuthenticated(AuthAdapter.isAuthenticated());
  };

  useEffect(() => {
    setIsMounted(true);
    checkAuth();

    if (typeof window !== 'undefined') {
      window.addEventListener('anas_auth_changed', checkAuth);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => console.log('PWA ServiceWorker registered:', reg.scope))
          .catch((err) => console.log('ServiceWorker error:', err));
      }
      return () => window.removeEventListener('anas_auth_changed', checkAuth);
    }
  }, []);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anas_storage_updated'));
    }
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#070f1e]" />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

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
