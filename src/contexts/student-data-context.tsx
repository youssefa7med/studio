
"use client";

import type { Student, StudentGrade, ClassItem } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Initial Data
const initialStudentsData: Student[] = [
  { id: '1', name: 'Ahmed Ali', className: 'Junior Acrobats', gender: 'male', age: 8, grades: { discipline: 4, punctuality: 5, engagement: 4, score: 85, overallScore: 4.3 }, progressDescription: 'Shows good effort in discipline and punctuality. Could be more vocal during activities.', encouragementMessage: 'Keep up the great work, Ahmed!', avatarUrl: 'https://placehold.co/100x100.png', avatarHint: 'boy student' },
  { id: '2', name: 'Fatima Omar', className: 'Advanced Tumblers', gender: 'female', age: 10, grades: { discipline: 5, punctuality: 5, engagement: 5, score: 95, overallScore: 5.0 }, progressDescription: 'Excellent all around. A model student.', encouragementMessage: 'Amazing job, Fatima! You are a star.', avatarUrl: 'https://placehold.co/100x100.png', avatarHint: 'girl student' },
];

const initialClassesData: ClassItem[] = [
  { id: '1', name: 'Junior Acrobats', photoUrl: 'https://placehold.co/600x400.png', photoHint: 'children gymnastics', date: new Date(2024, 6, 20), students: [] },
  { id: '2', name: 'Advanced Tumblers', photoUrl: 'https://placehold.co/600x400.png', photoHint: 'teenagers tumbling', date: new Date(2024, 7, 15), students: [] },
  { id: '3', name: 'Parkour Pros', photoUrl: 'https://placehold.co/600x400.png', photoHint: 'kids parkour', date: new Date(2024, 8, 10), students: [] },
];


interface StudentDataContextType {
  students: Student[];
  getStudentById: (id: string) => Student | undefined;
  addStudent: (studentData: Omit<Student, 'id' | 'grades' | 'encouragementMessage' | 'progressDescription'>) => void;
  updateStudentGrades: (studentId: string, grades: Partial<StudentGrade>, progressDescription: string, encouragementMessage: string) => void;
  deleteStudent: (studentId: string) => void;
  
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

  const getStudentById = useCallback((id: string) => students.find(s => s.id === id), [students]);

  const addStudent = useCallback((studentData: Omit<Student, 'id' | 'grades' | 'encouragementMessage' | 'progressDescription'>) => {
    const defaultAvatarUrl = studentData.avatarUrl || "https://placehold.co/100x100.png";
    let defaultAvatarHint = studentData.avatarHint;
    if (!defaultAvatarHint) {
        defaultAvatarHint = studentData.gender === 'male' ? "boy student" : studentData.gender === 'female' ? "girl student" : "student avatar";
    }

    const newStudent: Student = {
      id: String(Date.now()),
      ...studentData,
      avatarUrl: defaultAvatarUrl,
      avatarHint: defaultAvatarHint,
      grades: { discipline: 3, punctuality: 3, engagement: 3, score: 70, overallScore: 3.0 },
      progressDescription: '',
      encouragementMessage: ''
    };
    setStudents(prev => [...prev, newStudent]);
  }, []);

  const updateStudentGrades = useCallback((studentId: string, newGrades: Partial<StudentGrade>, progressDescription: string, encouragementMessage: string) => {
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
        
        if (newGrades.score !== undefined && newGrades.score !== null) { 
            updatedFullGrades.overallScore = parseFloat(((averageDetailedScore + (newGrades.score / 20) ) / 2).toFixed(1)); 
        } else {
            updatedFullGrades.overallScore = parseFloat(averageDetailedScore.toFixed(1));
        }

        return { ...s, grades: updatedFullGrades, progressDescription, encouragementMessage };
      }
      return s;
    }));
  }, []);

  const deleteStudent = useCallback((studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  }, []);

  const getClassById = useCallback((id: string) => classes.find(c => c.id === id), [classes]);
  
  const getClasses = useCallback(() => classes, [classes]);

  const addClass = useCallback((classData: Omit<ClassItem, 'id' | 'students'>) => {
    const newClass: ClassItem = {
      id: String(Date.now()),
      ...classData,
      students: []
    };
    setClasses(prev => [...prev, newClass]);
  }, []);

  const updateClass = useCallback((updatedClassData: ClassItem) => {
    setClasses(prev => prev.map(c => c.id === updatedClassData.id ? updatedClassData : c));
  }, []);

  const deleteClass = useCallback((classId: string) => {
    const classToDelete = getClassById(classId); 
    if (!classToDelete) return;
    setClasses(prev => prev.filter(c => c.id !== classId));
    setStudents(prevStudents => prevStudents.map(s => s.className === classToDelete.name ? {...s, className: ''} : s));
  }, [getClassById]);


  return (
    <StudentDataContext.Provider value={{
        students, getStudentById, addStudent, updateStudentGrades, deleteStudent,
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
