// ANAS FINANCE TRACKER - CLEAN MANUAL STORAGE ADAPTER WITH EVENT DRIVEN UPDATES

const INITIAL_ACCOUNTS = [
  { id: 'acc-1', name: 'ক্যাশ (Cash)', type: 'cash', current_balance: 0, opening_balance: 0, icon: 'wallet', account_number: 'N/A' },
  { id: 'acc-2', name: 'bKash (পার্সোনাল)', type: 'mfs', current_balance: 0, opening_balance: 0, icon: 'smartphone', account_number: 'N/A' },
  { id: 'acc-3', name: 'Nagad (পার্সোনাল)', type: 'mfs', current_balance: 0, opening_balance: 0, icon: 'smartphone', account_number: 'N/A' },
  { id: 'acc-4', name: 'ব্যাংক অ্যাকাউন্ট', type: 'bank', current_balance: 0, opening_balance: 0, icon: 'landmark', account_number: 'N/A' },
  { id: 'acc-5', name: 'বিজনেস অ্যাকাউন্ট', type: 'business', current_balance: 0, opening_balance: 0, icon: 'briefcase', account_number: 'N/A' },
];

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'খাবার ও বাজার', segment: 'personal', type: 'expense', icon: 'utensils', color: '#EF4444' },
  { id: 'cat-2', name: 'বাসা ভাড়া', segment: 'personal', type: 'expense', icon: 'home', color: '#F59E0B' },
  { id: 'cat-3', name: 'যাতায়াত ও ফুয়েল', segment: 'personal', type: 'expense', icon: 'car', color: '#3B82F6' },
  { id: 'cat-4', name: 'মেডিকেল ও স্বাস্থ্য', segment: 'personal', type: 'expense', icon: 'heart-pulse', color: '#EC4899' },
  { id: 'cat-5', name: 'বেতন / সেলারি', segment: 'personal', type: 'income', icon: 'briefcase', color: '#10B981' },
  { id: 'cat-6', name: 'ফ্রিল্যান্সিং আয়', segment: 'personal', type: 'income', icon: 'laptop', color: '#3B82F6' },
  
  { id: 'cat-7', name: 'স্টক ও মালামাল ক্রয়', segment: 'business', type: 'expense', icon: 'shopping-bag', color: '#D97706' },
  { id: 'cat-8', name: 'দোকান / অফিস ভাড়া', segment: 'business', type: 'expense', icon: 'building', color: '#B45309' },
  { id: 'cat-9', name: 'বিদ্যুৎ ও ইউটিলিটি বিল', segment: 'business', type: 'expense', icon: 'zap', color: '#EAB308' },
  { id: 'cat-12', name: 'স্টাফ বেতন', segment: 'business', type: 'expense', icon: 'users', color: '#6366F1' },
  { id: 'cat-13', name: 'বিজ্ঞাপন ও মার্কেটিং', segment: 'business', type: 'expense', icon: 'megaphone', color: '#84CC16' },
  { id: 'cat-10', name: 'পণ্য বিক্রয়', segment: 'business', type: 'income', icon: 'shopping-cart', color: '#059669' },
  { id: 'cat-11', name: 'সার্ভিস বিক্রয়', segment: 'business', type: 'income', icon: 'wrench', color: '#0D5C46' },
];

const INITIAL_TRANSACTIONS = [];
const INITIAL_BUDGETS = [];
const INITIAL_SAVINGS_GOALS = [];
const INITIAL_LOANS = [];

// LocalStorage Helper with fresh version key v2
const STORAGE_PREFIX = 'anas_fin_v2_';

function getStored(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
  if (!stored) {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return defaultValue;
  }
}

function setStored(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent('anas_storage_updated', { detail: { key } }));
}

export const StorageAdapter = {
  getAccounts: () => getStored('accounts', INITIAL_ACCOUNTS),
  saveAccounts: (accounts) => setStored('accounts', accounts),
  
  getCategories: () => getStored('categories', INITIAL_CATEGORIES),
  saveCategories: (categories) => setStored('categories', categories),
  
  getTransactions: () => getStored('transactions', INITIAL_TRANSACTIONS),
  saveTransactions: (transactions) => setStored('transactions', transactions),
  
  getBudgets: () => getStored('budgets', INITIAL_BUDGETS),
  saveBudgets: (budgets) => setStored('budgets', budgets),
  
  getSavingsGoals: () => getStored('savings_goals', INITIAL_SAVINGS_GOALS),
  saveSavingsGoals: (goals) => setStored('savings_goals', goals),
  
  getLoans: () => getStored('loans', INITIAL_LOANS),
  saveLoans: (loans) => setStored('loans', loans),

  notifyChange: () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anas_storage_updated'));
    }
  },
  
  resetData: () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      window.location.reload();
    }
  }
};
