
import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface LandingPageProps {
  onStart: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, theme, onToggleTheme }) => {
  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400 tracking-tight">HRMS</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button 
              onClick={onStart}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center animate-fadeIn">
          <h1 className="text-5xl md:text-7xl font-black text-zinc-900 dark:text-white leading-tight tracking-tight">
            Manage your workforce <br />
            <span className="text-zinc-500 dark:text-zinc-400">with precision.</span>
          </h1>
          <p className="mt-8 text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            The all-in-one platform for modern HR teams. Track attendance, manage employee data, and gain real-time insights with ease.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black text-lg font-bold rounded-2xl hover:bg-black dark:hover:bg-zinc-200 transition-all shadow-xl shadow-zinc-200 dark:shadow-none active:scale-95"
            >
              Get Started Now
            </button>
            <button 
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-10 py-4 text-zinc-600 dark:text-zinc-300 text-lg font-semibold rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all text-center flex items-center justify-center"
            >
              View Features
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-50 dark:bg-zinc-900/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Powerful Core Features</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-4">Everything you need to run a high-performing team.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Employee Management</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Centralized database for all employee records. Easily add, update, or remove personnel while keeping data organized by department.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Attendance Tracking</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Simplified daily logging. Mark attendance with a single click and access full historical records with advanced filtering.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-2xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">Real-time Dashboard</h3>
              <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Visualized insights for quick decision making. Monitor presence, absence, and total workforce strength at a glance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-800 text-center dark:bg-black">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl font-bold text-zinc-800 dark:text-white">HRMS</span>
        </div>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm">© {new Date().getFullYear()} Professional Workforce Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
};
