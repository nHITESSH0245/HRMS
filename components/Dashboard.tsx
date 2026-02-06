
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
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 
    },
    { 
      label: 'Present Today', 
      value: stats?.presentToday || 0, 
      color: 'emerald', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> 
    },
    { 
      label: 'Absent Today', 
      value: stats?.absentToday || 0, 
      color: 'rose', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> 
    },
    { 
      label: 'Pending ', 
      value: stats?.pendingToday || 0, 
      color: 'zinc', 
      isWarning: (stats?.pendingToday || 0) > 0,
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> 
    },
    { 
      label: 'Departments', 
      value: stats?.departmentCount || 0, 
      color: 'amber', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg> 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors">Welcome back, {profile?.adminName?.split(' ')[0] || 'Admin'}</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Here's a quick overview of {profile?.organizationName || 'your organization'}'s status today.</p>
        </div>
        
        <button 
          onClick={onToggleSidebar}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all group font-bold text-sm text-zinc-700 dark:text-zinc-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-500"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-6 rounded-[1.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{card.label}</p>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white transition-colors">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 ${card.isWarning ? 'animate-pulse text-amber-500' : ''}`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
              <span className={`mr-1 ${card.isWarning ? 'text-amber-500' : 'text-emerald-500'}`}>{card.isWarning ? '!' : '✓'}</span> 
              {card.isWarning ? 'Action Required' : 'Synchronized'}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Quick Operations</h4>
            <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 rounded-full">Automated Console</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => onAction('employees')}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 shadow-sm group-hover:bg-zinc-900 dark:group-hover:bg-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white dark:group-hover:text-black transition-colors"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                </div>
                <p className="font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest text-[10px]">Workforce Growth</p>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">Register a new member to the global employee database.</p>
            </button>
            <button 
              onClick={() => onAction('attendance')}
              className="flex flex-col items-start p-6 border border-zinc-100 dark:border-zinc-800 rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-950 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 shadow-sm group-hover:bg-zinc-900 dark:group-hover:bg-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-white dark:group-hover:text-black transition-colors"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                </div>
                <p className="font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest text-[10px]">Session Tracking</p>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">Log attendance for today's active organization session.</p>
            </button>
          </div>
        </div>

        <div className="bg-zinc-900 dark:bg-white p-8 rounded-[2rem] text-white dark:text-black shadow-lg relative overflow-hidden border border-zinc-800 dark:border-zinc-200 flex flex-col justify-between">
          <div className="relative z-10">
            <h4 className="font-black text-xl mb-3 tracking-tight uppercase tracking-widest">Console Tip</h4>
            <p className="text-sm font-medium opacity-70 leading-relaxed">System metrics update in real-time. Ensure all members are logged before the daily report cycle ends.</p>
          </div>
          <div className="relative z-10 mt-8">
            <button 
              onClick={() => onAction('attendance')}
              className="w-full bg-white dark:bg-black text-black dark:text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Process Attendance
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 opacity-5 transform rotate-12">
            <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
};
