// ANAS FINANCE TRACKER - SINGLE USER AUTHENTICATION SYSTEM

const AUTH_KEY = 'anas_fin_auth_session_v1';
const CREDENTIALS_KEY = 'anas_fin_auth_creds_v1';

const DEFAULT_CREDENTIALS = {
  email: 'anas@gmail.com',
  password: 'anas',
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
    const session = localStorage.getItem(AUTH_KEY);
    return session === 'authenticated';
  },

  login: (email, password) => {
    const creds = AuthAdapter.getCredentials();
    const cleanInputEmail = (email || '').trim().toLowerCase();
    const cleanTargetEmail = (creds.email || '').trim().toLowerCase();

    if (cleanInputEmail === cleanTargetEmail && password === creds.password) {
      localStorage.setItem(AUTH_KEY, 'authenticated');
      window.dispatchEvent(new CustomEvent('anas_auth_changed'));
      return { success: true };
    }
    return { success: false, error: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়!' };
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
      window.dispatchEvent(new CustomEvent('anas_auth_changed'));
    }
  },
};
