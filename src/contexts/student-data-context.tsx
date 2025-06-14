
"use client";

import type { Student, StudentGrade, ClassItem } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateEncouragementMessage, type GenerateEncouragementMessageInput } from '@/ai/flows/generate-encouragement-message';

// Initial Data
const initialStudentsData: Student[] = [
  { id: '1', name: 'Ahmed Ali', className: 'Junior Acrobats', gender: 'male', age: 8, grades: { discipline: 4, punctuality: 5, engagement: 4, score: 85, overallScore: 4.3 }, progressDescription: 'Shows good effort in discipline and punctuality. Could be more vocal during activities.', avatarUrl: 'https://placehold.co/100x100.png', avatarHint: 'boy student' },
  { id: '2', name: 'Fatima Omar', className: 'Advanced Tumblers', gender: 'female', age: 10, grades: { discipline: 5, punctuality: 5, engagement: 5, score: 95, overallScore: 5.0 }, progressDescription: 'Excellent all around. A model student.', avatarUrl: 'https://placehold.co/100x100.png', avatarHint: 'girl student' },
];

const initialClassesData: ClassItem[] = [
  { id: '1', name: 'Junior Acrobats', photoUrl: 'https://placehold.co/600x400.png', photoHint: 'children gymnastics', date: new Date(2024, 6, 20), students: [] },
  { id: '2', name: 'Advanced Tumblers', photoUrl: 'https://placehold.co/600x400.png', photoHint: 'teenagers tumbling', date: new Date(2024, 7, 15), students: [] },
  { id: '3', name: 'Parkour Pros', photoUrl: 'https://placehold.co/600x400.png', photoHint: 'kids parkour', date: new Date(2024, 8, 10), students: [] },
];


interface StudentDataContextType {
  students: Student[];
  getStudentById: (id: string) => Student | undefined;
  addStudent: (studentData: Omit<Student, 'id' | 'grades' | 'avatarUrl' | 'avatarHint' | 'encouragementMessage' | 'progressDescription'> & { avatarUrl?: string, avatarHint?: string }) => void;
  updateStudentGrades: (studentId: string, grades: Partial<StudentGrade>, progressDescription: string) => void;
  deleteStudent: (studentId: string) => void;
  updateStudentEncouragement: (studentId: string, encouragementMessage: string) => void;
  fetchAndSetEncouragement: (student: Student) => Promise<string>;

  classes: ClassItem[];
  addClass: (classData: Omit<ClassItem, 'id' | 'students'>) => void;
  updateClass: (classData: ClassItem) => void;
  deleteClass: (classId: string) => void;
  getClassById: (id: string) => ClassItem | undefined;
  getClasses: () => ClassItem[];
}

const StudentDataContext = createContext<StudentDataContextType | undefined>(undefined);

export const StudentDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudentsData);
  const [classes, setClasses] = useState<ClassItem[]>(initialClassesData);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStudentById = (id: string) => students.find(s => s.id === id);

  const addStudent = (studentData: Omit<Student, 'id' | 'grades' | 'avatarUrl' | 'avatarHint' | 'encouragementMessage' | 'progressDescription'> & { avatarUrl?: string, avatarHint?: string }) => {
    const newStudent: Student = {
      id: String(Date.now()),
      ...studentData,
      avatarUrl: studentData.avatarUrl || `https://placehold.co/100x100.png`,
      avatarHint: studentData.avatarHint || (studentData.gender === 'male' ? "boy student" : studentData.gender === 'female' ? "girl student" : "student"),
      grades: { discipline: 3, punctuality: 3, engagement: 3, score: 70, overallScore: 3.0 } 
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudentGrades = (studentId: string, newGrades: Partial<StudentGrade>, progressDescription: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const currentGrades = s.grades || { discipline: 0, punctuality: 0, engagement: 0, score: 0, overallScore: 0 };
        const updatedFullGrades: StudentGrade = {
            discipline: newGrades.discipline ?? currentGrades.discipline,
            punctuality: newGrades.punctuality ?? currentGrades.punctuality,
            engagement: newGrades.engagement ?? currentGrades.engagement,
            score: newGrades.score ?? currentGrades.score,
            overallScore: 0 
        };
        const totalDetailedScore = (updatedFullGrades.discipline) + (updatedFullGrades.punctuality) + (updatedFullGrades.engagement);
        const averageDetailedScore = totalDetailedScore / 3;
        updatedFullGrades.overallScore = parseFloat(averageDetailedScore.toFixed(1)); // overallScore is average of 3 criteria only. Max 5.
         if (newGrades.score !== undefined) { // If direct score is provided, factor it in
            updatedFullGrades.overallScore = parseFloat(((averageDetailedScore + (newGrades.score / 20) ) / 2).toFixed(1)); // Assuming score is out of 100, scale to 5 for averaging
         }


        return { ...s, grades: updatedFullGrades, progressDescription };
      }
      return s;
    }));
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const updateStudentEncouragement = (studentId: string, encouragementMessage: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, encouragementMessage } : s));
  };
  
  const fetchAndSetEncouragement = async (student: Student): Promise<string> => {
    if (!student.id) {
        console.error("Student ID is undefined, cannot fetch encouragement.");
        return "Error: Student ID missing.";
    }
    const input: GenerateEncouragementMessageInput = {
        studentName: student.name,
        className: student.className,
        progressDescription: student.progressDescription || `Overall score: ${student.grades?.overallScore || 'N/A'}. Score: ${student.grades?.score || 'N/A'}. Discipline: ${student.grades?.discipline || 'N/A'}, Punctuality: ${student.grades?.punctuality || 'N/A'}, Engagement: ${student.grades?.engagement || 'N/A'}.`,
    };
    try {
        const result = await generateEncouragementMessage(input);
        updateStudentEncouragement(student.id, result.encouragementMessage);
        return result.encouragementMessage;
    } catch (error) {
        console.error("Failed to generate encouragement:", error);
        return "Failed to generate message.";
    }
  };

  const getClassById = (id: string) => classes.find(c => c.id === id);
  const getClasses = () => classes;

  const addClass = (classData: Omit<ClassItem, 'id' | 'students'>) => {
    const newClass: ClassItem = {
      id: String(Date.now()), 
      ...classData,
      students: [] 
    };
    setClasses(prev => [...prev, newClass]);
  };

  const updateClass = (updatedClassData: ClassItem) => {
    setClasses(prev => prev.map(c => c.id === updatedClassData.id ? updatedClassData : c));
  };

  const deleteClass = (classId: string) => {
    const classToDelete = getClassById(classId);
    if (!classToDelete) return;
    setClasses(prev => prev.filter(c => c.id !== classId));
    setStudents(prevStudents => prevStudents.map(s => s.className === classToDelete.name ? {...s, className: ''} : s));
  };

  if (!isMounted) return null;

  return (
    <StudentDataContext.Provider value={{ 
        students, getStudentById, addStudent, updateStudentGrades, deleteStudent, updateStudentEncouragement, fetchAndSetEncouragement,
        classes, addClass, updateClass, deleteClass, getClassById, getClasses
    }}>
      {children}
    </StudentDataContext.Provider>
  );
};

export const useStudentData = (): StudentDataContextType => {
  const context = useContext(StudentDataContext);
  if (context === undefined) {
    throw new Error('useStudentData must be used within a StudentDataProvider');
  }
  return context;
};

