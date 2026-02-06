
import React, { useState, useEffect } from 'react';
import { HRService } from '../services/hrService';
import { Employee } from '../types';

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    email: '',
    department: ''
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await HRService.getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Failed to load employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (emp: Employee) => {
    if (!emp || !emp.id) {
      console.error("Cannot delete: Employee or ID is missing", emp);
      return;
    }
    
    const confirmDelete = confirm(`Are you sure you want to delete ${emp.fullName}? This will permanently remove their records from the cloud database and update all dashboard analytics.`);
    
    if (confirmDelete) {
      setIsDeleting(emp.id);
      try {
        console.log(`Triggering delete for ID: ${emp.id}`);
        await HRService.deleteEmployee(emp.id);
        
        // Optimistic UI update: Remove from local state immediately
        setEmployees(prev => prev.filter(e => e.id !== emp.id));
        console.log("Local state updated after deletion");
      } catch (err: any) {
        console.error("Delete operation failed:", err);
        alert(`Cloud error: ${err.message || 'The deletion failed. Please check your permissions or network.'}`);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({ id: '', fullName: '', email: '', department: '' });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      id: emp.id,
      fullName: emp.fullName,
      email: emp.email,
      department: emp.department
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.id.trim() || !formData.fullName.trim() || !formData.email.trim() || !formData.department.trim()) {
      setError('All fields are mandatory.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      if (editingEmployee) {
        // Update existing
        await HRService.updateEmployee({
          ...editingEmployee,
          fullName: formData.fullName,
          email: formData.email,
          department: formData.department
        });
      } else {
        // Add new
        await HRService.addEmployee(formData);
      }
      
      setFormData({ id: '', fullName: '', email: '', department: '' });
      setIsModalOpen(false);
      setEditingEmployee(null);
      await loadEmployees();
    } catch (err: any) {
      setError(err.message || 'Failed to save employee.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center animate-viewSlide">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors">Employees</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Manage your workforce records and information.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-zinc-900 dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-colors animate-viewSlide">
        {loading ? (
          <div className="p-12 text-center text-zinc-400 dark:text-zinc-500 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-800 dark:border-zinc-700 dark:border-t-zinc-200 rounded-full animate-spin"></div>
            Loading employees...
          </div>
        ) : employees.length === 0 ? (
          <div className="p-20 text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-200 dark:text-zinc-800"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/><path d="M2 17h20"/></svg>
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">No employees found</h3>
            <p className="text-zinc-500 dark:text-zinc-400">Start by adding your first employee to the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 dark:bg-zinc-950/50 border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Employee ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {employees.map((emp) => (
                  <tr key={emp.id} className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors ${isDeleting === emp.id ? 'opacity-50 grayscale pointer-events-none bg-rose-50/20' : ''}`}>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1 rounded text-xs font-mono font-bold">
                        {emp.id}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-200">{emp.fullName}</td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 text-sm">{emp.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-xs font-semibold">
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white p-2 transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          title="Edit Employee"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(emp)}
                          className="text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 p-2 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Delete Employee"
                        >
                          {isDeleting === emp.id ? (
                            <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Unified for Add and Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-slideUp border border-zinc-100 dark:border-zinc-800 my-auto">
            <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900 sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <p className="text-zinc-500 text-sm mt-1">
                  {editingEmployee ? 'Update the details for this employee.' : 'Create a new member record in the organization.'}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {error && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 text-sm rounded-xl border border-rose-100 dark:border-rose-900 font-medium flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Employee ID</label>
                  <input
                    type="text"
                    placeholder="EMP-001"
                    disabled={!!editingEmployee}
                    className={`w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-xl focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-colors ${editingEmployee ? 'opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-900' : ''}`}
                    value={formData.id}
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                  />
                  {editingEmployee && <p className="text-[10px] text-zinc-400 mt-1 uppercase font-bold tracking-tighter">ID cannot be changed</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Department</label>
                  <select
                    className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-xl focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none appearance-none transition-colors"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                  >
                    <option value="">Select Dept.</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full legal name"
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-xl focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-colors"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="email@company.com"
                  className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white rounded-xl focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white outline-none transition-colors"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 px-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-all shadow-xl shadow-zinc-200/50 dark:shadow-none active:scale-95"
                >
                  {editingEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
