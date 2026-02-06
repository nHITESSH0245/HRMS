
import React, { useState } from 'react';
import { HRService } from '../services/hrService';
import { AdminProfile } from '../types';
import { ThemeToggle } from './ThemeToggle';

interface OnboardingProps {
  onComplete: (hrId: string) => void;
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

type OnboardingMode = 'login' | 'setup';

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onBack, theme, onToggleTheme }) => {
  const [mode, setMode] = useState<OnboardingMode>('login');
  const [formData, setFormData] = useState<AdminProfile>({
    adminName: '',
    organizationName: '',
    hrId: ''
  });
  const [statusMessage, setStatusMessage] = useState<{ text: string, type: 'error' | 'success' | 'info' } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.adminName || !formData.organizationName || !formData.hrId) {
      setStatusMessage({ text: 'All fields are required for security.', type: 'error' });
      return;
    }
    
    setSaving(true);
    setStatusMessage({ text: 'Connecting to HRMS Cloud...', type: 'info' });
    
    try {
      const verification = await HRService.verifyProfileDetails(formData);
      
      if (mode === 'login') {
        if (verification === 'match') {
          setStatusMessage({ text: 'Welcome back! Verification successful.', type: 'success' });
          setTimeout(() => onComplete(formData.hrId), 1000);
        } else if (verification === 'mismatch') {
          setStatusMessage({ text: 'Credentials do not match our records for this ID.', type: 'error' });
          setSaving(false);
        } else {
          setStatusMessage({ text: 'No workspace found with this ID. Please switch to Setup.', type: 'error' });
          setSaving(false);
        }
      } else {
        // Setup Mode
        if (verification !== 'new') {
          setStatusMessage({ text: 'This HR ID is already registered. Please try another or Log In.', type: 'error' });
          setSaving(false);
        } else {
          await HRService.saveAdminProfile(formData);
          setStatusMessage({ text: 'Workspace Created! Your HRMS is now live.', type: 'success' });
          setTimeout(() => onComplete(formData.hrId), 1000);
        }
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: "Cloud connection error. Check your network.", type: 'error' });
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex flex-col items-center justify-center p-6 transition-colors duration-300">
      {/* Top Navigation Controls */}
      <div className="absolute top-8 left-8 sm:left-12 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
          title="Back to Landing Page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="hidden sm:inline">Home</span>
        </button>
      </div>

      <div className="absolute top-8 right-8 sm:right-12">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      
      <div className="max-w-md w-full animate-fadeIn">
        {/* Toggle Controls */}
        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 mb-6 shadow-sm transition-colors">
          <button 
            onClick={() => { setMode('login'); setStatusMessage(null); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
          >
            Access Console
          </button>
          <button 
            onClick={() => { setMode('setup'); setStatusMessage(null); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'setup' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
          >
            Setup Workspace
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 dark:shadow-none p-10 border border-zinc-100 dark:border-zinc-800 transition-colors">
          <div className="text-center mb-10">
            
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white transition-colors tracking-tight">
              {mode === 'setup' ? 'Create Workspace' : 'Administrator Login'}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 text-sm font-medium leading-relaxed">
              {mode === 'setup' 
                ? 'Join HRMS Lite. Launch your professional organization dashboard in seconds.' 
                : 'Secure access to your organization dashboard and employee database.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {statusMessage && (
              <div className={`p-4 text-xs rounded-2xl border font-bold uppercase tracking-wider transition-all flex items-center gap-3 animate-slideUp ${
                statusMessage.type === 'error' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900' :
                statusMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' :
                'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
              }`}>
                {statusMessage.type === 'info' ? (
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                )}
                {statusMessage.text}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Admin Name</label>
              <input
                type="text"
                className="w-full px-5 py-4 border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-[1.25rem] focus:border-zinc-900 dark:focus:border-white outline-none transition-all disabled:opacity-50 font-semibold placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                placeholder="Hitesh Kumar"
                disabled={saving}
                value={formData.adminName}
                onChange={e => setFormData({ ...formData, adminName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Organization</label>
              <input
                type="text"
                className="w-full px-5 py-4 border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-[1.25rem] focus:border-zinc-900 dark:focus:border-white outline-none transition-all disabled:opacity-50 font-semibold placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                placeholder="KR Mangalam University"
                disabled={saving}
                value={formData.organizationName}
                onChange={e => setFormData({ ...formData, organizationName: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">HR Workspace ID</label>
              <input
                type="text"
                className="w-full px-5 py-4 border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-[1.25rem] focus:border-zinc-900 dark:focus:border-white outline-none transition-all disabled:opacity-50 font-mono font-bold placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                placeholder="2201010055"
                disabled={saving}
                value={formData.hrId}
                onChange={e => setFormData({ ...formData, hrId: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-all shadow-2xl active:scale-95 mt-6 disabled:opacity-50 flex items-center justify-center gap-4 text-xs"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  Authenticating
                </>
              ) : (
                mode === 'setup' ? "Deploy Workspace" : "Access Console"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
