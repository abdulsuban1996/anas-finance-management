# 💼 ANAS FINANCE - Financial Management System (PWA)

A premium, modern, high-performance Personal & Business Financial Tracking Application built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Framer Motion**, and **PWA (Progressive Web App)** capabilities.

---

## ✨ Features Overview

### 1. 📊 Interactive Dashboard & Financial Overview
- **Real-Time Balance & Cash Flow:** Instant calculations of Total Income, Total Expenses, and Net Savings/Deficit.
- **Multi-Account Support:** Cash, bKash, Nagad, Bank, and Business accounts with balance sync.
- **Fund Transfer:** Transfer money smoothly between different wallets/accounts.
- **Visual Analytics:** Interactive monthly trend charts (Area & Pie charts with custom gradients).

### 2. 💼 Personal & Business Segmentation
- Separate income and expense logging for Personal lifestyle vs. Business operations.
- Dedicated **Business Profit & Loss Statement** (Gross revenue, operating expenses, and net profit margin).

### 3. 🎯 Budgets & Savings Goals
- Category-wise monthly budget caps with percentage progress bars.
- Savings goals tracker with milestone progress and target deadlines.

### 4. 🤝 Loans & Debt Management
- Track money given to others (Receivables) and money taken from others (Payables).
- Partial installment payment tracking with transaction history.

### 5. 📑 Export & Reporting
- **🖼️ High-DPI PNG Statement Image:** Generate and download a beautifully styled financial summary statement card in 1-click.
- **📊 CSV Data Export:** Export full transaction history for Excel / Google Sheets.

### 6. 📱 PWA & Mobile Optimization
- **Offline Capable:** Service Worker (`sw.js`) caching for fast loading.
- **Standalone Mobile Mode:** Installable on Android & iOS home screens with high-resolution 3D icons.
- **Touch Navigation:** High-contrast mobile bottom navigation bar.

### 7. 🔒 Single-User Security
- Protected single-user access with email & password authentication.
- Zero public registration surface.
- Persistent one-time login for installed app mode.

---

## 🔑 Default Login Credentials
- **Gmail:** `anas@gmail.com`
- **Password:** `anas`

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Database (Optional):** Supabase (PostgreSQL with Row Level Security)
- **PWA Engine:** Web Manifest + Custom Service Worker

---

## 🚀 Quick Start & Installation

### Local Development:
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open browser at http://localhost:3000
```

### Production Build:
```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🌐 Deploy to Vercel (1-Click Deployment)
1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import this repository and click **Deploy**.

---

## 🗄️ Supabase Cloud Database (Optional Setup)
If you wish to sync data with Supabase Cloud Database:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in Supabase and paste the contents of `supabase_schema.sql`.
3. Add the following environment variables in `.env.local` or Vercel:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## 📄 License
Private & Proprietary - Created for Anas.
