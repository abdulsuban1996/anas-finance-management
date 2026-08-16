// ANAS FINANCE TRACKER - DUAL MODE AUTHENTICATION SYSTEM (PWA APP VS BROWSER)

const PWA_AUTH_KEY = 'anas_fin_pwa_auth_session_v1';
const BROWSER_AUTH_KEY = 'anas_fin_browser_auth_session_v1';
const CREDENTIALS_KEY = 'anas_fin_auth_creds_v1';

const DEFAULT_CREDENTIALS = {
  email: 'anas@gmail.com',
  password: 'anas',
};

// Detect if running inside Installed PWA App mode vs Web Browser
export const isStandalonePWA = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
};

export const AuthAdapter = {
  getCredentials: () => {
    if (typeof window === 'undefined') return DEFAULT_CREDENTIALS;
    const stored = localStorage.getItem(CREDENTIALS_KEY);
    if (!stored) {
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
      return DEFAULT_CREDENTIALS;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return DEFAULT_CREDENTIALS;
    }
  },

  updateCredentials: (newEmail, newPassword) => {
    if (typeof window === 'undefined') return;
    const current = AuthAdapter.getCredentials();
    const updated = {
      email: (newEmail || current.email).trim().toLowerCase(),
      password: newPassword || current.password,
    };
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));
  },

  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    const standalone = isStandalonePWA();

    if (standalone) {
      // PWA App Mode: Persistent login saved in localStorage (logged in forever once authenticated)
      return localStorage.getItem(PWA_AUTH_KEY) === 'authenticated';
    } else {
      // Browser Mode: Temporary session in sessionStorage (requires login every time browser opens)
      return sessionStorage.getItem(BROWSER_AUTH_KEY) === 'authenticated';
    }
  },

  login: (email, password) => {
    const creds = AuthAdapter.getCredentials();
    const cleanInputEmail = (email || '').trim().toLowerCase();
    const cleanTargetEmail = (creds.email || '').trim().toLowerCase();

    if (cleanInputEmail === cleanTargetEmail && password === creds.password) {
      const standalone = isStandalonePWA();
      if (standalone) {
        localStorage.setItem(PWA_AUTH_KEY, 'authenticated');
      } else {
        sessionStorage.setItem(BROWSER_AUTH_KEY, 'authenticated');
      }
      window.dispatchEvent(new CustomEvent('anas_auth_changed'));
      return { success: true };
    }
    return { success: false, error: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়!' };
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PWA_AUTH_KEY);
      sessionStorage.removeItem(BROWSER_AUTH_KEY);
      window.dispatchEvent(new CustomEvent('anas_auth_changed'));
    }
  },
};
