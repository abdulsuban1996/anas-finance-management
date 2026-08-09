-- ===================================================
-- ANAS FINANCE TRACKER - SUPABASE DATABASE SCHEMA
-- ===================================================

-- 1. Accounts Table
CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- cash, bank, mfs, business
    opening_balance DECIMAL(15, 2) DEFAULT 0.00,
    current_balance DECIMAL(15, 2) DEFAULT 0.00,
    icon VARCHAR(100) DEFAULT 'wallet',
    account_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    segment VARCHAR(50) NOT NULL, -- personal, business
    type VARCHAR(50) NOT NULL, -- income, expense
    icon VARCHAR(100) DEFAULT 'tag',
    color VARCHAR(50) DEFAULT '#0D5C46',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    transfer_to_account_id UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- income, expense, transfer
    segment VARCHAR(50) NOT NULL DEFAULT 'personal', -- personal, business
    amount DECIMAL(15, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    note TEXT,
    receipt_url TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_frequency VARCHAR(50), -- monthly, weekly
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Budgets Table
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    budget_amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(category_id, month, year)
);

-- 5. Savings Goals Table
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0.00,
    deadline DATE,
    status VARCHAR(50) DEFAULT 'active', -- active, achieved, paused
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Loans Table (ধার-দেনা)
CREATE TABLE IF NOT EXISTS public.loans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    person_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- receivable (আমি পাব), payable (আমি দেব)
    amount DECIMAL(15, 2) NOT NULL,
    remaining_amount DECIMAL(15, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, partial, paid
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Loan Payments Table (কিস্তি/আংশিক পরিশোধ)
CREATE TABLE IF NOT EXISTS public.loan_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Default Bangla Categories
INSERT INTO public.categories (name, segment, type, icon, color) VALUES
-- Personal Expenses
('খাবার ও বাজার', 'personal', 'expense', 'utensils', '#EF4444'),
('বাসা ভাড়া', 'personal', 'expense', 'home', '#F59E0B'),
('মেডিকেল ও স্বাস্থ্য', 'personal', 'expense', 'heart-pulse', '#EC4899'),
('যাতায়াত ও ফুয়েল', 'personal', 'expense', 'car', '#3B82F6'),
('শিক্ষা ও কোর্স', 'personal', 'expense', 'book-open', '#8B5CF6'),
('বিনোদন ও ট্যুর', 'personal', 'expense', 'film', '#10B981'),
('মোবাইল ও ইন্টারনেট', 'personal', 'expense', 'phone', '#06B6D4'),
('অন্যান্য পার্সোনাল', 'personal', 'expense', 'grid', '#6B7280'),

-- Personal Income
('বেতন / সেলারি', 'personal', 'income', 'briefcase', '#10B981'),
('ফ্রিল্যান্সিং আয়', 'personal', 'income', 'laptop', '#3B82F6'),
('উপহার / উপহারপ্রাপ্তি', 'personal', 'income', 'gift', '#8B5CF6'),
('অন্যান্য আয়', 'personal', 'income', 'plus-circle', '#059669'),

-- Business Expenses
('স্টক ও মালামাল ক্রয়', 'business', 'expense', 'shopping-bag', '#D97706'),
('সাপ্লায়ার পেমেন্ট', 'business', 'expense', 'truck', '#EA580C'),
('দোকান / অফিস ভাড়া', 'business', 'expense', 'building', '#B45309'),
('বিদ্যুৎ ও ইউটিলিটি বিল', 'business', 'expense', 'zap', '#EAB308'),
('স্টাফ বেতন', 'business', 'expense', 'users', '#6366F1'),
('বিজ্ঞাপন ও মার্কেটিং', 'business', 'expense', 'megaphone', '#84CC16'),
('অন্যান্য বিজনেস খরচ', 'business', 'expense', 'package', '#4B5563'),

-- Business Income
('পণ্য বিক্রয়', 'business', 'income', 'shopping-cart', '#059669'),
('সার্ভিস বিক্রয়', 'business', 'income', 'wrench', '#0D5C46'),
('অন্যান্য বিজনেস আয়', 'business', 'income', 'trending-up', '#047857')
ON CONFLICT DO NOTHING;
