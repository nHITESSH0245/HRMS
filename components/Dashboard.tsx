
import React, { useEffect, useState, useMemo } from 'react';
import { HRService } from '../services/hrService';
import { DashboardStats } from '../types';

interface DashboardProps {
  onAction: (view: 'employees' | 'attendance') => void;
  onToggleSidebar: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAction, onToggleSidebar }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const profile = useMemo(() => HRService.getAdminProfile(), []);

  useEffect(() => {
    HRService.getDashboardStats().then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const cards = [
    { 
      label: 'Total Employees', 
      value: stats?.totalEmployees || 0, 
      color: 'zinc', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 
    },
    { 
      label: 'Present Today', 
      value: stats?.presentToday || 0, 
      color: 'emerald', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 
    },
    { 
      label: 'Absent Today', 
      value: stats?.absentToday || 0, 
      color: 'rose', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> 
    },
    { 
      label: 'Departments', 
      value: stats?.departmentCount || 0, 
      color: 'amber', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg> 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors">Welcome back, {profile?.adminName?.split(' ')[0] || 'Admin'}</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Here's a quick overview of {profile?.organizationName || 'your organization'}'s status today.</p>
        </div>
        
        {/* Sidebar Toggle Button in Dashboard */}
        <button 
          onClick={onToggleSidebar}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all group font-bold text-sm text-zinc-700 dark:text-zinc-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-500"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{card.label}</p>
                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-2 transition-colors">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              <span className="text-emerald-500 mr-1">↑</span> Updated just now
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <h4 className="font-semibold text-zinc-900 dark:text-white mb-4 transition-colors">Quick Actions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => onAction('employees')}
              className="flex flex-col items-start p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors">New Onboarding</p>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 ml-6">Register a new employee member</p>
            </button>
            <button 
              onClick={() => onAction('attendance')}
              className="flex flex-col items-start p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                <p className="font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-black dark:group-hover:text-white transition-colors">Daily Log</p>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 ml-6">Mark current session attendance</p>
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 dark:bg-white p-6 rounded-2xl text-white dark:text-black shadow-lg relative overflow-hidden border border-zinc-800 dark:border-zinc-200">
          <div className="relative z-10">
            <h4 className="font-bold text-lg mb-2">System Insight</h4>
            <p className="text-sm opacity-80">Ensure all attendance is marked before 10:00 AM for accurate reporting.</p>
            <button 
              onClick={onToggleSidebar}
              className="mt-4 bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              Quick Menu
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-10 transform rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};
