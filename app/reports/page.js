'use client';

import React, { useState, useEffect } from 'react';
import { StorageAdapter } from '../../lib/storage';
import { PieChart as PieIcon, TrendingUp, TrendingDown, Download, BarChart2, Briefcase, FileSpreadsheet } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';

export default function ReportsPage({ refreshKey }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setTransactions(StorageAdapter.getTransactions());
    setCategories(StorageAdapter.getCategories());
  }, [refreshKey]);

  // Aggregate monthly data for line/area chart
  const monthlyTrendData = [
    { month: 'মার্চ', income: 45000, expense: 28000 },
    { month: 'এপ্রিল', income: 52000, expense: 31000 },
    { month: 'মে', income: 60000, expense: 35000 },
    { month: 'জুন', income: 48000, expense: 29000 },
    { month: 'জুলাই', income: 75000, expense: 42000 },
    { month: 'আগস্ট', income: 85000, expense: 33700 },
  ];

  // Business segment Profit/Loss summary
  const businessTxs = transactions.filter(t => t.segment === 'business');
  const businessIncome = businessTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const businessExpense = businessTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const businessNetProfit = businessIncome - businessExpense;

  // Category breakdown data for Pie Chart
  const expenseTxs = transactions.filter(t => t.type === 'expense');
  const categoryTotals = {};
  expenseTxs.forEach(t => {
    const cat = categories.find(c => c.id === t.category_id);
    const catName = cat ? cat.name : 'অন্যান্য';
    categoryTotals[catName] = (categoryTotals[catName] || 0) + t.amount;
  });

  const pieChartData = Object.keys(categoryTotals).map(name => ({
    name,
    value: categoryTotals[name]
  }));

  const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#10B981', '#6B7280'];

  // CSV Export Handler
  const exportToCSV = () => {
    const headers = ["ID", "Date", "Type", "Segment", "Amount", "Note"];
    const rows = transactions.map(t => [t.id, t.date, t.type, t.segment, t.amount, `"${t.note || ''}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `anas_finance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & CSV Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">রিপোর্ট ও প্রফিট/লস এনালিটিক্স</h1>
          <p className="text-xs text-slate-500 mt-0.5">আয়-ব্যয়ের ট্রেন্ড, বিজনেসের লাভ-ক্ষতি ও বিস্তারিত বিবরণী</p>
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>ডেটা এক্সপোর্ট (CSV)</span>
        </button>
      </div>

      {/* Business Profit & Loss Card */}
      <div className="card-glass p-6 rounded-3xl bg-white border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-slate-800 text-base">বিজনেস সেগমেন্ট - প্রফিট ও লস স্টেটমেন্ট</h2>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
            বিজনেস অ্যাকাউন্ট
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block">মোট বিজনেস বিক্রয়/আয়</span>
            <span className="text-xl font-extrabold text-emerald-600 amount-font">৳{businessIncome.toLocaleString('bn-BD')}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 block">মোট বিজনেস পরিচালন খরচ</span>
            <span className="text-xl font-extrabold text-red-600 amount-font">৳{businessExpense.toLocaleString('bn-BD')}</span>
          </div>

          <div className={`p-4 rounded-2xl border ${businessNetProfit >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <span className="text-xs font-bold text-slate-700 block">নীট লাভ / (ক্ষতি)</span>
            <span className={`text-2xl font-extrabold amount-font ${businessNetProfit >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
              ৳{businessNetProfit.toLocaleString('bn-BD')}
            </span>
          </div>
        </div>
      </div>

      {/* Income vs Expense Line Chart */}
      <div className="card-glass p-5 rounded-3xl bg-white border border-slate-200/80 space-y-4">
        <h2 className="font-bold text-slate-800 text-base flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-[#0D5C46]" />
          <span>আয় বনাম ব্যয় ট্রেন্ড (গত ৬ মাস)</span>
        </h2>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="income" name="আয় (৳)" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" name="ব্যয় (৳)" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Expense Breakdown Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="card-glass p-5 rounded-3xl bg-white border border-slate-200/80 space-y-4">
          <h2 className="font-bold text-slate-800 text-base flex items-center space-x-2">
            <PieIcon className="w-5 h-5 text-purple-600" />
            <span>ক্যাটাগরি-ভিত্তিক খরচ ব্রেকডাউন</span>
          </h2>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div className="card-glass p-5 rounded-3xl bg-white border border-slate-200/80 space-y-3">
          <h2 className="font-bold text-slate-800 text-sm">ক্যাটাগরি তালিকা ও খরচের হার</h2>
          {pieChartData.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-semibold text-xs">
              এখনো কোনো খরচের ডেটা যুক্ত করা হয়নি। লেনদেন সেকশন থেকে নতুন খরচ ইনপুট দিন।
            </div>
          ) : (
            <div className="space-y-2">
              {pieChartData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 amount-font">
                    ৳{cat.value.toLocaleString('bn-BD')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
