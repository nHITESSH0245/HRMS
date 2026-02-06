
import { db } from './firebaseConfig';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { Employee, AttendanceRecord, AttendanceStatus, DashboardStats, AdminProfile } from '../types';

const COLLECTIONS = {
  EMPLOYEES: 'employees',
  ATTENDANCE: 'attendance',
  PROFILES: 'profiles'
};

export class HRService {
  private static cachedProfile: AdminProfile | null = null;

  // --- Admin Profile Management ---

  static async fetchAdminProfile(hrId: string): Promise<AdminProfile | null> {
    try {
      const docRef = doc(db, COLLECTIONS.PROFILES, hrId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        this.cachedProfile = docSnap.data() as AdminProfile;
        return this.cachedProfile;
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
    }
    return null;
  }

  static async verifyProfileDetails(details: AdminProfile): Promise<'match' | 'mismatch' | 'new'> {
    const existing = await this.fetchAdminProfile(details.hrId);
    if (!existing) return 'new';
    
    const isMatch = (
      existing.adminName.trim().toLowerCase() === details.adminName.trim().toLowerCase() &&
      existing.organizationName.trim().toLowerCase() === details.organizationName.trim().toLowerCase() &&
      existing.hrId.trim().toLowerCase() === details.hrId.trim().toLowerCase()
    );

    return isMatch ? 'match' : 'mismatch';
  }

  static getAdminProfile(): AdminProfile | null {
    return this.cachedProfile;
  }

  static async saveAdminProfile(profile: AdminProfile): Promise<void> {
    const docRef = doc(db, COLLECTIONS.PROFILES, profile.hrId);
    await setDoc(docRef, profile);
    this.cachedProfile = profile;
  }

  static logout(): void {
    this.cachedProfile = null;
    localStorage.removeItem('hrms_session_active');
    localStorage.removeItem('hrms_active_hr_id');
  }

  // --- Employee Management ---

  static async getEmployees(): Promise<Employee[]> {
    if (!this.cachedProfile) return [];
    try {
      const q = query(
        collection(db, COLLECTIONS.EMPLOYEES), 
        where("ownerId", "==", this.cachedProfile.hrId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Employee));
    } catch (err) {
      console.error("Error fetching employees:", err);
      return [];
    }
  }

  static async addEmployee(employee: Omit<Employee, 'createdAt' | 'ownerId'>): Promise<Employee> {
    if (!this.cachedProfile) throw new Error("No active session.");
    if (!employee.id) throw new Error("Employee ID is required.");
    
    const normalizedId = `${this.cachedProfile.hrId}_${employee.id.trim()}`;
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, normalizedId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      throw new Error(`Employee ID ${employee.id} already exists in your organization.`);
    }

    const newEmployee: Employee = {
      ...employee,
      ownerId: this.cachedProfile.hrId,
      id: normalizedId,
      createdAt: new Date().toISOString()
    };

    await setDoc(docRef, newEmployee);
    return newEmployee;
  }

  static async updateEmployee(updatedEmployee: Employee): Promise<Employee> {
    const docRef = doc(db, COLLECTIONS.EMPLOYEES, updatedEmployee.id);
    await setDoc(docRef, updatedEmployee);
    return updatedEmployee;
  }

  static async deleteEmployee(id: string): Promise<void> {
    const empDocRef = doc(db, COLLECTIONS.EMPLOYEES, id);
    await deleteDoc(empDocRef);
    
    const q = query(collection(db, COLLECTIONS.ATTENDANCE), where("employeeId", "==", id));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const batchDeletes = snapshot.docs.map(d => deleteDoc(doc(db, COLLECTIONS.ATTENDANCE, d.id)));
      await Promise.all(batchDeletes);
    }
  }

  // --- Attendance Management ---

  static async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    if (!this.cachedProfile) return [];
    try {
      const q = query(
        collection(db, COLLECTIONS.ATTENDANCE), 
        where("ownerId", "==", this.cachedProfile.hrId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as AttendanceRecord));
    } catch (err) {
      console.error("Error fetching attendance:", err);
      return [];
    }
  }

  static async markAttendance(record: Omit<AttendanceRecord, 'id' | 'ownerId'>): Promise<AttendanceRecord> {
    if (!this.cachedProfile) throw new Error("No active session.");

    const q = query(
      collection(db, COLLECTIONS.ATTENDANCE), 
      where("employeeId", "==", record.employeeId),
      where("date", "==", record.date)
    );
    const existingSnapshot = await getDocs(q);

    if (!existingSnapshot.empty) {
      const existingId = existingSnapshot.docs[0].id;
      const existingRef = doc(db, COLLECTIONS.ATTENDANCE, existingId);
      await updateDoc(existingRef, { status: record.status });
      return { id: existingId, ownerId: this.cachedProfile.hrId, ...record } as AttendanceRecord;
    } else {
      const fullRecord = { ...record, ownerId: this.cachedProfile.hrId };
      const docRef = await addDoc(collection(db, COLLECTIONS.ATTENDANCE), fullRecord);
      return { id: docRef.id, ...fullRecord } as AttendanceRecord;
    }
  }

  // --- Dashboard Logic ---

  static async getDashboardStats(): Promise<DashboardStats> {
    const [employees, attendance] = await Promise.all([
      this.getEmployees(),
      this.getAttendanceRecords()
    ]);
    
    const today = new Date().toLocaleDateString('en-CA');
    const todayAttendance = attendance.filter(a => a.date === today);
    
    // Explicitly count Present and Absent status
    const presentCount = todayAttendance.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const absentCount = todayAttendance.filter(a => a.status === AttendanceStatus.ABSENT).length;
    
    // Calculate how many employees have NO entry for today
    const pendingCount = Math.max(0, employees.length - (presentCount + absentCount));
    
    const departments = new Set(employees.map(e => e.department));

    return {
      totalEmployees: employees.length,
      presentToday: presentCount,
      absentToday: absentCount,
      pendingToday: pendingCount,
      departmentCount: departments.size
    };
  }
}
