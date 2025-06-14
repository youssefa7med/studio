
export interface AdminUser {
  id: string;
  username: string;
  password?: string; // Password might be optional if just displaying usernames or for new admin forms
}

export interface StudentGrade {
  discipline: number; // e.g., 1-5
  punctuality: number; // e.g., 1-5
  engagement: number; // e.g., 1-5
  score: number; // Direct score input
  overallScore: number; // calculated or manually set
}

export interface Student {
  id: string;
  name: string;
  className: string; // Or classId if classes are separate objects
  gender: 'male' | 'female' | 'other';
  age: number;
  grades?: StudentGrade; // For a single session, or array for history
  encouragementMessage?: string;
  progressDescription?: string;
  avatarUrl?: string; // URL for the student's avatar
  avatarHint?: string; // AI hint for avatar
}

export interface ClassItem {
  id: string;
  name: string;
  photoUrl: string; // URL for the class photo
  photoHint: string; // AI hint for class photo
  date: Date; // Date of the class
  students: Student[]; // Students in this class - can be populated later
}

export interface Session {
  id: string;
  date: Date;
  className: string; // or classId
  notes?: string;
}
