
import React from 'react';
import { HRService } from '../services/hrService';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: any) => void;
  onExit: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate, 
  onExit, 
  theme, 
  onToggleTheme,
  isSidebarOpen,
  onToggleSidebar
}) => {
  const profile = HRService.getAdminProfile();

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> 
    },
    { 
      id: 'employees', 
      label: 'Employees', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 
    },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> 
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-black transition-colors duration-300 relative">
      {/* Overlay for mobile/tablet */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onToggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white">HRMS</h1>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-widest font-bold">Cloud Console</p>
          </div>
          {/* Internal Close Button */}
          <button 
            onClick={onToggleSidebar}
            className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-900 flex items-center justify-center"
            title="Close Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (window.innerWidth < 1024) onToggleSidebar();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                currentView === item.id
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="opacity-70">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile & Sign Out Section */}
        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-black font-bold shadow-sm flex-shrink-0">
              {profile?.adminName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{profile?.adminName || 'Admin User'}</p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-500 font-bold uppercase tracking-tighter truncate opacity-80">
                {profile?.organizationName || 'System Admin'}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-1 font-bold">{profile?.hrId || 'ID: NOT-SET'}</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExit();
            }}
            className="w-full mt-5 py-3 px-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-100 dark:hover:border-rose-900 transition-all uppercase tracking-wider flex items-center justify-center gap-2 active:scale-[0.97] shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 md:px-8 z-10 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={onToggleSidebar}
                className="p-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg hover:scale-105 transition-all flex items-center justify-center"
                aria-label="Open Sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            )}
            
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 capitalize">
                  {currentView}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-sm text-zinc-400 dark:text-zinc-500 font-medium hidden lg:block mr-2">
               {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </div>
             <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto animate-fadeIn pb-12">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
