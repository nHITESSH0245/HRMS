
export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent'
}

export interface Employee {
  id: string; // Unique Employee ID within an organization
  ownerId: string; // The HR ID of the administrator who owns this record
  fullName: string;
  email: string;
  department: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  ownerId: string; // The HR ID of the administrator
  employeeId: string;
  date: string; // ISO string YYYY-MM-DD
  status: AttendanceStatus;
}

export interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  departmentCount: number;
}

export interface AdminProfile {
  adminName: string;
  organizationName: string;
  hrId: string;
}
