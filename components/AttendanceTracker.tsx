
import React, { useState, useEffect } from 'react';
import { HRService } from '../services/hrService';
import { Employee, AttendanceRecord, AttendanceStatus } from '../types';

export const AttendanceTracker: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'mark' | 'history'>('mark');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const emps = await HRService.getEmployees();
    const atts = await HRService.getAttendanceRecords();
    setEmployees(emps);
    setAttendance(atts);
    setLoading(false);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors">Attendance</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Track and manage daily attendance logs.</p>
        </div>
        
        <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
          <button
            onClick={() => setViewMode('mark')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'mark' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
          >
            Mark Daily
          </button>
          <button
            onClick={() => setViewMode('history')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${viewMode === 'history' ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
          >
            Full History
          </button>
        </div>
      </div>

      {viewMode === 'mark' ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
             <div className="flex items-center gap-4">
               <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Select Date:</label>
               <input
                 type="date"
                 className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-xl focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                 value={selectedDate}
                 onChange={e => setSelectedDate(e.target.value)}
               />
             </div>
             <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
               Displaying {employees.length} employees
             </div>
          </div>

          {loading ? (
             <div className="p-12 text-center text-zinc-400 dark:text-zinc-500">Loading roster...</div>
          ) : employees.length === 0 ? (
             <div className="p-20 text-center">
                <p className="text-zinc-500 dark:text-zinc-400">Add employees first to track attendance.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {employees.map(emp => {
                    const record = getAttendanceForEmployeeOnDate(emp.id, selectedDate);
                    return (
                      <tr key={emp.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-200">{emp.fullName}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-500 font-mono">{emp.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          {record ? (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              record.status === AttendanceStatus.PRESENT 
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'
                            }`}>
                              {record.status}
                            </span>
                          ) : (
                            <span className="text-zinc-300 dark:text-zinc-600 text-xs italic">Not marked</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleMarkAttendance(emp.id, AttendanceStatus.PRESENT)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                record?.status === AttendanceStatus.PRESENT 
                                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-md' 
                                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-emerald-300 dark:hover:border-emerald-700'
                              }`}
                            >
                              Mark Present
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(emp.id, AttendanceStatus.ABSENT)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                record?.status === AttendanceStatus.ABSENT 
                                ? 'bg-rose-600 text-white shadow-md' 
                                : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-rose-300 dark:hover:border-rose-700'
                              }`}
                            >
                              Mark Absent
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
        <div className="space-y-6">
          {/* History View */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-6 items-center transition-colors">
            <div className="flex-1 w-full">
               <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">View History for Employee:</label>
               <select 
                 className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-xl outline-none transition-colors appearance-none"
                 value={selectedEmployeeId}
                 onChange={e => setSelectedEmployeeId(e.target.value)}
               >
                 <option value="">Choose an employee...</option>
                 {employees.map(e => <option key={e.id} value={e.id}>{e.fullName} ({e.id})</option>)}
               </select>
            </div>
            {selectedEmployeeId && (
              <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 transition-colors w-full md:w-auto text-center md:text-left">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold uppercase">Total Presence</p>
                <p className="text-2xl font-black text-zinc-900 dark:text-white">{getPresentDaysCount(selectedEmployeeId)} Days</p>
              </div>
            )}
          </div>

          {selectedEmployeeId ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {attendance
                      .filter(a => a.employeeId === selectedEmployeeId)
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map(a => (
                        <tr key={a.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-zinc-700 dark:text-zinc-300">{a.date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              a.status === AttendanceStatus.PRESENT 
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' 
                              : 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    }
                    {attendance.filter(a => a.employeeId === selectedEmployeeId).length === 0 && (
                      <tr>
                        <td colSpan={2} className="p-12 text-center text-zinc-400 dark:text-zinc-600">No records found for this employee.</td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          ) : (
            <div className="p-12 bg-white dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-center text-zinc-400 dark:text-zinc-600 transition-colors">
              Select an employee above to view their individual attendance history.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
