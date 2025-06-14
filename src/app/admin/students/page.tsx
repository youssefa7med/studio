"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import type { Student, StudentGrade } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit3, Trash2, Smile, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { generateEncouragementMessage, type GenerateEncouragementMessageInput } from '@/ai/flows/generate-encouragement-message';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

// Custom Icons (placeholders)
const DisciplineIcon = () => <ShieldCheck className="h-5 w-5 text-blue-500" />;
const PunctualityIcon = () => <Clock3 className="h-5 w-5 text-green-500" />;
const EngagementIcon = () => <Users2 className="h-5 w-5 text-yellow-500" />;


// Mock initial students
const initialStudents: Student[] = [
  { id: '1', name: 'Ahmed Ali', className: 'Junior Acrobats', grades: { discipline: 4, punctuality: 5, engagement: 4, overallScore: 4.3 }, progressDescription: 'Shows good effort in discipline and punctuality. Could be more vocal during activities.' },
  { id: '2', name: 'Fatima Omar', className: 'Advanced Tumblers', grades: { discipline: 5, punctuality: 5, engagement: 5, overallScore: 5.0 }, progressDescription: 'Excellent all around. A model student.' },
];

export default function StudentsPage() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [isEncouragementModalOpen, setIsEncouragementModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');
  
  const [grades, setGrades] = useState<Partial<StudentGrade>>({
    discipline: 3,
    punctuality: 3,
    engagement: 3,
  });
  const [progressDescription, setProgressDescription] = useState('');
  const [encouragement, setEncouragement] = useState('');
  const [isLoadingEncouragement, setIsLoadingEncouragement] = useState(false);

  const handleAddStudent = () => {
    if (!newStudentName || !newStudentClass) {
      toast({ title: "Error", description: "Name and class are required.", variant: "destructive"});
      return;
    }
    const newStudent: Student = {
      id: String(students.length + 1),
      name: newStudentName,
      className: newStudentClass,
    };
    setStudents([...students, newStudent]);
    setNewStudentName('');
    setNewStudentClass('');
    setIsStudentModalOpen(false);
    toast({ title: t('addStudent'), description: `${newStudentName} ${language === 'ar' ? 'أضيف بنجاح' : 'added successfully.'}` });
  };

  const openGradeModal = (student: Student) => {
    setCurrentStudent(student);
    setGrades(student.grades || { discipline: 3, punctuality: 3, engagement: 3 });
    setProgressDescription(student.progressDescription || '');
    setIsGradeModalOpen(true);
  };

  const handleSaveGrades = () => {
    if (!currentStudent) return;
    const overallScore = ((grades.discipline || 0) + (grades.punctuality || 0) + (grades.engagement || 0)) / 3;
    const updatedStudent: Student = { 
        ...currentStudent, 
        grades: { ...grades, overallScore: parseFloat(overallScore.toFixed(1)) } as StudentGrade,
        progressDescription: progressDescription
    };
    setStudents(students.map(s => s.id === currentStudent.id ? updatedStudent : s));
    setIsGradeModalOpen(false);
    toast({ title: t('saveGrades'), description: `${language === 'ar' ? 'تم حفظ درجات ' : 'Grades for '}${currentStudent.name}${language === 'ar' ? ' بنجاح.' : ' saved successfully.'}` });
  };

  const openEncouragementModal = async (student: Student) => {
    setCurrentStudent(student);
    setEncouragement(student.encouragementMessage || '');
     if (!student.progressDescription && !student.grades) {
      toast({ title: "Info", description: "Please add grades or progress description first.", variant: "default"});
      return;
    }
    setIsEncouragementModalOpen(true);

    if (!student.encouragementMessage) { // Generate only if not already present
        setIsLoadingEncouragement(true);
        try {
            const input: GenerateEncouragementMessageInput = {
                studentName: student.name,
                className: student.className,
                progressDescription: student.progressDescription || `Overall score: ${student.grades?.overallScore || 'N/A'}. Discipline: ${student.grades?.discipline}, Punctuality: ${student.grades?.punctuality}, Engagement: ${student.grades?.engagement}.`,
            };
            const result = await generateEncouragementMessage(input);
            setEncouragement(result.encouragementMessage);
            setStudents(students.map(s => s.id === student.id ? { ...s, encouragementMessage: result.encouragementMessage } : s));
        } catch (error) {
            console.error("Failed to generate encouragement:", error);
            toast({ title: "Error", description: "Failed to generate encouragement message.", variant: "destructive" });
        } finally {
            setIsLoadingEncouragement(false);
        }
    }
  };
  
  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId));
    toast({ title: "Student Deleted", description: "Student removed successfully.", variant: "destructive" });
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-3xl text-primary">{t('students')}</CardTitle>
            <CardDescription>{language === 'en' ? 'Manage student profiles, grades, and motivational messages.' : 'إدارة ملفات الطلاب ودرجاتهم ورسائلهم التحفيزية.'}</CardDescription>
          </div>
          <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-5 w-5" /> {t('addStudent')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline">{t('addStudent')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="newStudentName">{t('studentName')}</Label>
                  <Input id="newStudentName" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="newStudentClass">{t('className')}</Label>
                  <Input id="newStudentClass" value={newStudentClass} onChange={(e) => setNewStudentClass(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStudentModalOpen(false)}>{t('close')}</Button>
                <Button onClick={handleAddStudent}>{t('addStudent')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('studentName')}</TableHead>
                <TableHead>{t('className')}</TableHead>
                <TableHead className="text-center">{t('overallScore')}</TableHead>
                <TableHead className="text-center">{language === 'en' ? 'Actions' : 'الإجراءات'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell className="text-center">{student.grades?.overallScore?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell className="text-center space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="icon" onClick={() => openGradeModal(student)} title={language === 'en' ? 'Edit Grades' : 'تعديل الدرجات'}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openEncouragementModal(student)} title={t('generateEncouragement')}>
                      <Smile className="h-4 w-4" />
                    </Button>
                     <Button variant="destructive" size="icon" onClick={() => handleDeleteStudent(student.id)} title={language === 'en' ? 'Delete Student' : 'حذف الطالب'}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {students.length === 0 && (
            <p className="text-center text-muted-foreground py-8">{t('noStudentsInClass')}</p>
          )}
        </CardContent>
      </Card>

      {/* Grade Modal */}
      <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{language === 'en' ? 'Grades for' : 'درجات'} {currentStudent?.name}</DialogTitle>
            <DialogDescription>{language === 'en' ? 'Set scores for discipline, punctuality, and engagement.' : 'قم بتعيين درجات للانضباط والالتزام بالمواعيد والتفاعل.'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              { labelKey: 'discipline', icon: <DisciplineIcon />, value: grades.discipline },
              { labelKey: 'punctuality', icon: <PunctualityIcon />, value: grades.punctuality },
              { labelKey: 'engagement', icon: <EngagementIcon />, value: grades.engagement },
            ].map(item => (
              <div key={item.labelKey} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={item.labelKey} className="text-right col-span-1 flex items-center justify-end">
                  {item.icon}
                  <span className="ml-2 rtl:mr-2">{t(item.labelKey)}</span>
                </Label>
                <Input
                  id={item.labelKey}
                  type="number"
                  min="1" max="5" step="0.5"
                  value={item.value}
                  onChange={(e) => setGrades({ ...grades, [item.labelKey]: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            ))}
            <div>
              <Label htmlFor="progressDescription">{t('progressDescription')}</Label>
              <Textarea 
                id="progressDescription" 
                value={progressDescription} 
                onChange={(e) => setProgressDescription(e.target.value)}
                placeholder={language === 'en' ? 'Describe student progress, strengths, areas for improvement...' : 'صف تقدم الطالب ونقاط القوة ومجالات التحسين...'}
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradeModalOpen(false)}>{t('close')}</Button>
            <Button onClick={handleSaveGrades}>{t('saveGrades')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Encouragement Modal */}
      <Dialog open={isEncouragementModalOpen} onOpenChange={setIsEncouragementModalOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="font-headline flex items-center"><Award className="mr-2 h-6 w-6 text-primary"/>{t('encouragementMessage')}</DialogTitle>
                <DialogDescription>{language === 'en' ? 'For' : 'للطالب'} {currentStudent?.name}</DialogDescription>
            </DialogHeader>
            <div className="py-4 min-h-[150px]">
                {isLoadingEncouragement ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="ml-2 rtl:mr-2">{language === 'en' ? 'Generating...' : 'جاري الإنشاء...'}</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[200px] p-2 border rounded-md bg-background/50">
                      <pre className="whitespace-pre-wrap text-sm">{encouragement}</pre>
                    </ScrollArea>
                )}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">{t('close')}</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Placeholder icons if not found in lucide-react or if custom ones are preferred
const ShieldCheck = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const Clock3 = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const Users2 = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

