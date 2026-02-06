
import React, { useState, useEffect, useRef } from 'react';
import { HRService } from '../services/hrService';
import { Employee, AttendanceRecord, AttendanceStatus } from '../types';

export const AttendanceTracker: React.FC = () => {
  const getTodayStr = () => new Date().toLocaleDateString('en-CA'); // More reliable YYYY-MM-DD than ISO for local time
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [viewMode, setViewMode] = useState<'mark' | 'history'>('mark');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');
  
  // Use a ref to track what the system "thought" today was to detect rollover
  const lastTodayRef = useRef(getTodayStr());

  useEffect(() => {
    loadData();

    // Real-time date rollover detection
    const interval = setInterval(() => {
      const currentRealToday = getTodayStr();
      
      if (lastTodayRef.current !== currentRealToday) {
        console.log(`Real-time rollover detected: ${lastTodayRef.current} -> ${currentRealToday}`);
        
        // Update selectedDate IF the user was looking at the old "today"
        // This ensures they are always marking for the correct current day.
        setSelectedDate(prevDate => {
          if (prevDate === lastTodayRef.current) {
            return currentRealToday;
          }
          return prevDate;
        });

        // Update our reference for the next check
        lastTodayRef.current = currentRealToday;
      }
    }, 10000); // Check every 10 seconds for high responsiveness

    return () => clearInterval(interval);
  }, []);

  // Reload data when selected date changes
  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const emps = await HRService.getEmployees();
      const atts = await HRService.getAttendanceRecords();
      setEmployees(emps);
      setAttendance(atts);
    } catch (err) {
      console.error("Failed to load attendance data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (employeeId: string, status: AttendanceStatus) => {
    try {
      await HRService.markAttendance({
        employeeId,
        date: selectedDate,
        status
      });
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getAttendanceForEmployeeOnDate = (empId: string, date: string) => {
    return attendance.find(a => a.employeeId === empId && a.date === date);
  };

  const getPresentDaysCount = (empId: string) => {
    return attendance.filter(a => a.employeeId === empId && a.status === AttendanceStatus.PRESENT).length;
  };

  const resetToToday = () => {
    setSelectedDate(getTodayStr());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors tracking-tight">Attendance</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Track and manage daily attendance logs in real-time.</p>
        </div>
        
        <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <button
            onClick={() => setViewMode('mark')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'mark' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
          >
            Mark Daily
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'history' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}`}
          >
            Full History
          </button>
        </div>
      </div>

      {viewMode === 'mark' ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] shadow-sm overflow-hidden transition-colors animate-viewSlide">
          <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6 transition-colors">
             <div className="flex items-center gap-4 relative">
               <div className="flex flex-col">
                 <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1 mb-1">Select Session Date</label>
                 <div className="flex items-center gap-3">
                   <input
                     type="date"
                     className="px-5 py-3 border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-2xl focus:border-zinc-900 dark:focus:border-white outline-none transition-all font-bold [color-scheme:light] dark:[color-scheme:dark]"
                     value={selectedDate}
                     onChange={e => setSelectedDate(e.target.value)}
                   />
                   {selectedDate === getTodayStr() ? (
                     <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900 animate-pulse">
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                       <span className="text-[10px] font-black uppercase tracking-widest">Today</span>
                     </div>
                   ) : (
                     <button 
                       onClick={resetToToday}
                       className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                     >
                       Go to Today
                     </button>
                   )}
                 </div>
               </div>
             </div>
             <div className="text-right">
               <div className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Active Employees</div>
               <div className="text-xl font-bold text-zinc-900 dark:text-white">{employees.length} Members</div>
             </div>
          </div>

          {loading ? (
             <div className="p-20 text-center flex flex-col items-center gap-4">
               <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div>
               <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">Syncing Records</p>
             </div>
          ) : employees.length === 0 ? (
             <div className="p-24 text-center">
                <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No Employees Found</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">Add organization members to start tracking attendance.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Identity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">Current Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {employees.map(emp => {
                    const record = getAttendanceForEmployeeOnDate(emp.id, selectedDate);
                    return (
                      <tr key={emp.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-all">
                        <td className="px-8 py-5">
                          <div className="font-bold text-zinc-900 dark:text-zinc-200">{emp.fullName}</div>
                          <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
                            {emp.id.includes('_') ? emp.id.split('_').slice(1).join('_') : emp.id}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          {record ? (
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              record.status === AttendanceStatus.PRESENT 
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900' 
                              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900'
                            }`}>
                              {record.status}
                            </span>
                          ) : (
                            <span className="text-zinc-300 dark:text-zinc-700 text-[10px] font-black uppercase tracking-widest italic">Pending</span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleMarkAttendance(emp.id, AttendanceStatus.PRESENT)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                record?.status === AttendanceStatus.PRESENT 
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-lg scale-105' 
                                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-emerald-500 hover:text-emerald-600'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(emp.id, AttendanceStatus.ABSENT)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                record?.status === AttendanceStatus.ABSENT 
                                ? 'bg-rose-600 text-white shadow-lg scale-105' 
                                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-rose-500 hover:text-rose-600'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8 animate-viewSlide">
          {/* History View */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-8 items-center transition-colors">
            <div className="flex-1 w-full space-y-1.5">
               <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Select Identity</label>
               <div className="relative">
                 <select 
                   className="w-full px-5 py-4 border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-2xl outline-none focus:border-zinc-900 dark:focus:border-white transition-all font-bold appearance-none cursor-pointer"
                   value={selectedEmployeeId}
                   onChange={e => setSelectedEmployeeId(e.target.value)}
                 >
                   <option value="">Search employee database...</option>
                   {employees.map(e => <option key={e.id} value={e.id}>{e.fullName} ({e.id.split('_').slice(1).join('_')})</option>)}
                 </select>
                 <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                 </div>
               </div>
            </div>
            {selectedEmployeeId && (
              <div className="bg-zinc-900 dark:bg-white px-8 py-5 rounded-3xl transition-all w-full md:w-auto text-center md:text-left shadow-xl">
                <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-400 uppercase tracking-widest mb-1">Lifetime Presence</p>
                <p className="text-3xl font-black text-white dark:text-black leading-none">{getPresentDaysCount(selectedEmployeeId)} <span className="text-xs uppercase opacity-60">Days</span></p>
              </div>
            )}
          </div>

          {selectedEmployeeId ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-sm overflow-hidden transition-colors">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-8 py-5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Session Date</th>
                      <th className="px-8 py-5 text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-right">Logged Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {attendance
                      .filter(a => a.employeeId === selectedEmployeeId)
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map(a => (
                        <tr key={a.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-8 py-5 font-bold text-zinc-700 dark:text-zinc-300">
                            {new Date(a.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              a.status === AttendanceStatus.PRESENT 
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    }
                    {attendance.filter(a => a.employeeId === selectedEmployeeId).length === 0 && (
                      <tr>
                        <td colSpan={2} className="p-20 text-center text-zinc-400 dark:text-zinc-600 font-bold text-xs uppercase tracking-widest">No logs found for this member.</td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          ) : (
            <div className="p-24 bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] text-center transition-colors">
              <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h3 className="text-zinc-900 dark:text-white font-bold text-lg">Detailed History View</h3>
              <p className="text-zinc-400 text-sm mt-1">Select an organization member above to retrieve their full attendance archive.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
