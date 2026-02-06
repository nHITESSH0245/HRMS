
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { EmployeeList } from './components/EmployeeList';
import { AttendanceTracker } from './components/AttendanceTracker';
import { LandingPage } from './components/LandingPage';
import { Onboarding } from './components/Onboarding';
import { HRService } from './services/hrService';

type AppState = 'loading' | 'landing' | 'onboarding' | 'dashboard';
type View = 'dashboard' | 'employees' | 'attendance';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('loading');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('hrms_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const initCloud = async () => {
      const activeHrId = localStorage.getItem('hrms_active_hr_id');
      const sessionActive = localStorage.getItem('hrms_session_active') === 'true';
      
      if (activeHrId && sessionActive) {
        const profile = await HRService.fetchAdminProfile(activeHrId);
        if (profile) {
          setAppState('dashboard');
          return;
        }
      }
      setAppState('landing');
    };
    initCloud();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('hrms_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleStart = () => {
    setAppState('onboarding');
  };

  const handleExit = () => {
    HRService.logout();
    setIsSidebarOpen(false);
    setCurrentView('dashboard');
    setAppState('landing');
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center gap-4 transition-colors">
        <div className="w-10 h-10 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div>
        <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest font-mono">HRMS Console Booting</p>
      </div>
    );
  }

  if (appState === 'landing') {
    return <LandingPage onStart={handleStart} theme={theme} onToggleTheme={toggleTheme} />;
  }

  if (appState === 'onboarding') {
    return (
      <Onboarding 
        onComplete={(hrId) => {
          localStorage.setItem('hrms_session_active', 'true');
          localStorage.setItem('hrms_active_hr_id', hrId);
          setAppState('dashboard');
        }} 
        onBack={() => setAppState('landing')}
        theme={theme} 
        onToggleTheme={toggleTheme} 
      />
    );
  }

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={setCurrentView} 
      onExit={handleExit}
      theme={theme}
      onToggleTheme={toggleTheme}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={toggleSidebar}
    >
      {currentView === 'dashboard' && <Dashboard onAction={setCurrentView} onToggleSidebar={toggleSidebar} />}
      {currentView === 'employees' && <EmployeeList />}
      {currentView === 'attendance' && <AttendanceTracker />}
    </Layout>
  );
};

export default App;
