
"use client";

import { useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import { useStudentData } from '@/contexts/student-data-context';
import type { Student, StudentGrade, ClassItem } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Star, Shield, Clock, MessageSquare, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from 'react';

const GradeIcon = ({ type }: { type: keyof Pick<StudentGrade, 'discipline' | 'punctuality' | 'engagement'> | 'overallScore' }) => {
  if (type === 'discipline') return <Shield className="h-4 w-4 text-blue-500" />;
  if (type === 'punctuality') return <Clock className="h-4 w-4 text-green-500" />;
  if (type === 'engagement') return <MessageSquare className="h-4 w-4 text-yellow-500" />;
  if (type === 'overallScore') return <Star className="h-4 w-4 text-orange-500" />;
  return null;
};

export default function ClassScoreboardPage() {
  const params = useParams();
  const classId = params.classId as string;
  const { t, language } = useLanguage();
  const { students: allStudents, getClassById, getClasses } = useStudentData();
  
  const [currentClass, setCurrentClass] = useState<ClassItem | undefined>(undefined);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (classId) {
      const foundClass = getClassById(classId) || getClasses().find(c => c.name.toLowerCase().replace(/\s+/g, '-') === classId.toLowerCase());
      setCurrentClass(foundClass);
      if (foundClass) {
        setFilteredStudents(allStudents.filter(student => student.className === foundClass.name));
      } else {
        setFilteredStudents([]);
      }
    }
  }, [classId, allStudents, getClassById, getClasses]);


  const classNameDisplay = currentClass?.name || t('className');

  return (
    <div className="space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader className="text-center py-8">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="font-headline text-4xl text-primary">{classNameDisplay} - {t('classScoreboard')}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {language === 'en' ? 'Celebrating the awesome efforts of our students!' : 'نحتفل بالجهود الرائعة لطلابنا!'}
          </CardDescription>
        </CardHeader>
      </Card>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col overflow-hidden group">
              <CardHeader className="flex flex-col items-center p-6 bg-accent/10">
                <Image
                  src={student.avatarUrl || "https://placehold.co/100x100.png"}
                  alt={student.name}
                  width={100}
                  height={100}
                  data-ai-hint={student.avatarHint || "student portrait"}
                  className="rounded-full border-4 border-primary shadow-md mb-3 group-hover:scale-110 transition-transform"
                />
                <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">{student.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-grow space-y-4">
                {student.grades && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-muted-foreground flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-accent" /> {language === 'en' ? 'Performance:' : 'الأداء:'}</h4>
                    {(['discipline', 'punctuality', 'engagement', 'overallScore'] as const).map(key => {
                      const gradeValue = student.grades?.[key as keyof StudentGrade];
                      if (gradeValue !== undefined && gradeValue !== null) {
                        const maxValue = key === 'overallScore' ? 5 : (key === 'score' ? 100 : 5); // Score is out of 100, others out of 5 for progress bar
                        const progressValue = key === 'score' ? gradeValue : (gradeValue / maxValue) * 100;
                        return (
                          <div key={key} className="flex items-center justify-between text-sm">
                            <span className="flex items-center">
                              {key !== 'score' && <GradeIcon type={key as 'discipline' | 'punctuality' | 'engagement' | 'overallScore'} />}
                              <span className="ml-2 rtl:mr-2">{t(key)}</span>
                            </span>
                            <div className="flex items-center w-1/2">
                              {key !== 'score' && <Progress value={progressValue} className="w-full h-2 mr-2 rtl:ml-2" /> }
                              <span className="font-semibold text-primary">{gradeValue.toFixed(1)}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
                {student.encouragementMessage && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-xs italic text-primary/80 leading-relaxed">{student.encouragementMessage}</p>
                  </div>
                )}
              </CardContent>
               {student.grades && typeof student.grades.overallScore === 'number' && 
                <CardFooter className="p-4 bg-muted/30 justify-center">
                 <p className="text-sm font-bold text-primary flex items-center">
                    <Star className="mr-1 h-5 w-5 text-yellow-400 fill-yellow-400" /> 
                    {t('overallScore')}: {student.grades.overallScore.toFixed(1)} / 5.0
                  </p>
              </CardFooter>}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-xl text-muted-foreground">{currentClass ? t('noStudentsInClass') : (language === 'en' ? 'Class not found or no students assigned.' : 'الفصل غير موجود أو لا يوجد طلاب معينون.')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
