
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { useStudentData } from '@/contexts/student-data-context';
import type { Student, StudentGrade } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit3, Trash2, UserCircle2 } from 'lucide-react'; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils"; 

const DisciplineIcon = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5 text-primary", className)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const PunctualityIcon = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5 text-primary", className)}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const EngagementIcon = ({className}: {className?: string}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("h-5 w-5 text-primary", className)}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

export default function StudentsPage() {
  const { t, language } = useLanguage();
  const { students, addStudent: addStudentToContext, updateStudentGrades, deleteStudent: deleteStudentFromContext, getClasses } = useStudentData();
  const { toast } = useToast();
  
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'male' | 'female' | 'other'>('male');
  const [newStudentAge, setNewStudentAge] = useState<number | ''>('');
  const [newStudentAvatarUrl, setNewStudentAvatarUrl] = useState('');
  const [newStudentAvatarHint, setNewStudentAvatarHint] = useState('');


  const [grades, setGrades] = useState<Partial<StudentGrade>>({
    discipline: 3,
    punctuality: 3,
    engagement: 3,
    score: 70, 
  });
  const [progressDescription, setProgressDescription] = useState('');
  const [encouragementMessage, setEncouragementMessage] = useState(''); 

  const availableClasses = getClasses();

  const handleAddStudent = () => {
    if (!newStudentName || !newStudentClass || !newStudentGender || newStudentAge === '') {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive"});
      return;
    }
    addStudentToContext({
      name: newStudentName,
      className: newStudentClass,
      gender: newStudentGender,
      age: Number(newStudentAge),
      avatarUrl: newStudentAvatarUrl || undefined, // Pass undefined if empty to let context handle default
      avatarHint: newStudentAvatarHint || undefined,
    });
    setNewStudentName('');
    setNewStudentClass('');
    setNewStudentGender('male');
    setNewStudentAge('');
    setNewStudentAvatarUrl('');
    setNewStudentAvatarHint('');
    setIsStudentModalOpen(false);
    toast({ title: t('addStudent'), description: `${newStudentName} ${language === 'ar' ? 'أضيف بنجاح' : 'added successfully.'}` });
  };

  const openGradeModal = (student: Student) => {
    setCurrentStudent(student);
    setGrades(student.grades || { discipline: 3, punctuality: 3, engagement: 3, score: 70 });
    setProgressDescription(student.progressDescription || '');
    setEncouragementMessage(student.encouragementMessage || ''); 
    setIsGradeModalOpen(true);
  };

  const handleSaveGrades = () => {
    if (!currentStudent) return;
    updateStudentGrades(currentStudent.id, grades, progressDescription, encouragementMessage);
    setIsGradeModalOpen(false);
    toast({ title: t('saveGrades'), description: `${language === 'ar' ? 'تم حفظ درجات ' : 'Grades for '}${currentStudent.name}${language === 'ar' ? ' بنجاح.' : ' saved successfully.'}` });
  };
  
  const handleDeleteStudent = (studentId: string) => {
    deleteStudentFromContext(studentId);
    toast({ title: "Student Deleted", description: "Student removed successfully.", variant: "destructive" });
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
             <UserCircle2 className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="font-headline text-3xl text-primary">{t('manageStudentsPageTitle')}</CardTitle>
                <CardDescription>{t('manageStudentsPageDescription')}</CardDescription>
            </div>
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
                <DialogDescription>{t('studentDetails')}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="newStudentName">{t('studentName')}</Label>
                  <Input id="newStudentName" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="newStudentClass">{t('className')}</Label>
                  <Select onValueChange={setNewStudentClass} value={newStudentClass}>
                    <SelectTrigger id="newStudentClass">
                      <SelectValue placeholder={t('selectClass')} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label htmlFor="newStudentAge">{t('age')}</Label>
                  <Input id="newStudentAge" type="number" value={newStudentAge} onChange={(e) => setNewStudentAge(e.target.value === '' ? '' : parseInt(e.target.value))} />
                </div>
                <div>
                  <Label>{t('gender')}</Label>
                  <RadioGroup
                    defaultValue="male"
                    onValueChange={(value: 'male' | 'female' | 'other') => setNewStudentGender(value)}
                    value={newStudentGender}
                    className="flex space-x-4 rtl:space-x-reverse"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">{t('male')}</Label>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">{t('female')}</Label>
                    </div>
                     <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">{t('other')}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="newStudentAvatarUrl">{t('avatarUrl')}</Label>
                  <Input 
                    id="newStudentAvatarUrl" 
                    value={newStudentAvatarUrl} 
                    onChange={(e) => setNewStudentAvatarUrl(e.target.value)} 
                    placeholder="https://placehold.co/100x100.png"
                  />
                </div>
                <div>
                  <Label htmlFor="newStudentAvatarHint">{t('avatarHint')}</Label>
                  <Input 
                    id="newStudentAvatarHint" 
                    value={newStudentAvatarHint} 
                    onChange={(e) => setNewStudentAvatarHint(e.target.value)} 
                    placeholder={language === 'en' ? 'e.g. smiling student' : 'مثال: طالب مبتسم'}
                  />
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
                <TableHead>{t('avatar')}</TableHead>
                <TableHead>{t('studentName')}</TableHead>
                <TableHead>{t('className')}</TableHead>
                <TableHead>{t('age')}</TableHead>
                <TableHead>{t('gender')}</TableHead>
                <TableHead className="text-center">{t('score')}</TableHead>
                <TableHead className="text-center">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Image 
                        src={student.avatarUrl || `https://placehold.co/40x40.png`} 
                        alt={student.name} 
                        width={40} 
                        height={40} 
                        data-ai-hint={student.avatarHint || (student.gender === 'male' ? "boy student" : "girl student")}
                        className="rounded-full"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{student.age}</TableCell>
                  <TableCell>{t(student.gender)}</TableCell>
                  <TableCell className="text-center">{student.grades?.score?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell className="text-center space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="icon" onClick={() => openGradeModal(student)} title={t('edit')}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                     <Button variant="destructive" size="icon" onClick={() => handleDeleteStudent(student.id)} title={t('delete')}>
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

      <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">{t('editGradesFor')} {currentStudent?.name}</DialogTitle>
            <DialogDescription>{language === 'en' ? 'Set scores for discipline, punctuality, engagement and overall performance. You can also add progress notes and an encouragement message.' : 'قم بتعيين درجات للانضباط والالتزام بالمواعيد والتفاعل والأداء العام. يمكنك أيضًا إضافة ملاحظات التقدم ورسالة تشجيعية.'}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {[
              { labelKey: 'discipline', icon: <DisciplineIcon />, value: grades.discipline, field: 'discipline' as keyof StudentGrade },
              { labelKey: 'punctuality', icon: <PunctualityIcon />, value: grades.punctuality, field: 'punctuality' as keyof StudentGrade },
              { labelKey: 'engagement', icon: <EngagementIcon />, value: grades.engagement, field: 'engagement' as keyof StudentGrade },
              { labelKey: 'score', icon: <UserCircle2 className="h-5 w-5 text-primary"/>, value: grades.score, field: 'score' as keyof StudentGrade},
            ].map(item => (
              <div key={item.labelKey} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={item.labelKey} className="text-right col-span-1 flex items-center justify-end rtl:text-left rtl:justify-start">
                  {item.icon}
                  <span className="ml-2 rtl:mr-2">{t(item.labelKey)}</span>
                </Label>
                <Input
                  id={item.labelKey}
                  type="number"
                  min="0" max={item.labelKey === 'score' ? "100" : "5"} step={item.labelKey === 'score' ? "1" : "0.5"}
                  value={String(item.value ?? '')} 
                  onChange={(e) => {
                    const newValue = e.target.value;
                    const parsedValue = newValue === '' ? undefined : parseFloat(newValue); 
                     setGrades({ 
                        ...grades, 
                        [item.field]: parsedValue
                    });
                  }}
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
            <div>
              <Label htmlFor="encouragementMessageManual">{t('encouragementMessage')}</Label>
              <Textarea 
                id="encouragementMessageManual" 
                value={encouragementMessage} 
                onChange={(e) => setEncouragementMessage(e.target.value)}
                placeholder={language === 'en' ? 'Write an encouraging message for the student...' : 'اكتب رسالة تشجيعية للطالب...'}
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradeModalOpen(false)}>{t('close')}</Button>
            <Button onClick={handleSaveGrades}>{t('saveGrades')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}
