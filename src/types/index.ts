
export interface AdminUser {
  id: string;
  username: string;
  password?: string; // Password might be optional if just displaying usernames or for new admin forms
}

export interface StudentGrade {
  discipline: number; // e.g., 1-5
  punctuality: number; // e.g., 1-5
  engagement: number; // e.g., 1-5
  overallScore: number; // calculated or manually set
}

export interface Student {
  id: string;
  name: string;
  className: string; // Or classId if classes are separate objects
  grades?: StudentGrade; // For a single session, or array for history
  encouragementMessage?: string;
  progressDescription?: string;
}

export interface ClassItem {
  id: string;
  name: string; // Could be localized object {en: ..., ar: ...}
  students: Student[];
}

export interface Session {
  id: string;
  date: Date;
  className: string; // or classId
  notes?: string;
}
