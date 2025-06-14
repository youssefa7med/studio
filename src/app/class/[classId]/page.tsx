"use client";

import { useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/language-context';
import type { Student, StudentGrade } from '@/types'; // Assuming types are defined
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Star, Shield, Clock, MessageSquare, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { Progress } from "@/components/ui/progress";

// Mock data - in a real app, this would be fetched based on classId
const MOCK_STUDENTS_DATA: Record<string, Student[]> = {
  '1': [ // Junior Acrobats
    { id: 's1', name: 'Omar Yasser', className: 'Junior Acrobats', grades: { discipline: 5, punctuality: 4, engagement: 5, overallScore: 4.7 }, encouragementMessage: "Omar, your energy is fantastic! Keep practicing those rolls, you're getting so strong! (عمر، طاقتك رائعة! استمر في التدرب على اللفات، أنت تصبح قوياً جداً!)", image: "https://placehold.co/100x100.png", imageHint: "child smiling" },
    { id: 's2', name: 'Layla Kareem', className: 'Junior Acrobats', grades: { discipline: 4, punctuality: 5, engagement: 4, overallScore: 4.3 }, encouragementMessage: "Layla, your listening ears are super helpful! Your cartwheels are looking beautiful. (ليلى، أذنيك المصغيتين مفيدتان جداً! حركات العجلة تبدو جميلة.)", image: "https://placehold.co/100x100.png", imageHint: "girl happy" },
  ],
  '2': [ // Advanced Tumblers
    { id: 's3', name: 'Zayn Ali', className: 'Advanced Tumblers', grades: { discipline: 5, punctuality: 5, engagement: 5, overallScore: 5.0 }, encouragementMessage: "Zayn, you're a tumbling superstar! Your focus is amazing, and your backflips are almost perfect. (زين، أنت نجم الشقلبة! تركيزك مذهل، وشقلباتك الخلفية شبه مثالية.)", image: "https://placehold.co/100x100.png", imageHint: "boy confident" },
  ],
  '3': [], // Parkour Pros - empty for now
};

const CLASS_NAMES: Record<string, { en: string, ar: string }> = {
  '1': { en: 'Junior Acrobats', ar: 'الأكروبات الصغار' },
  '2': { en: 'Advanced Tumblers', ar: 'المتمرسون المتقدمون' },
  '3': { en: 'Parkour Pros', ar: 'محترفو الباركور' },
};

const GradeIcon = ({ type }: { type: keyof StudentGrade | 'overallScore' }) => {
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

  const students = MOCK_STUDENTS_DATA[classId] || [];
  const className = CLASS_NAMES[classId]?.[language] || CLASS_NAMES[classId]?.['en'] || t('className');

  return (
    <div className="space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader className="text-center py-8">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="font-headline text-4xl text-primary">{className} - {t('classScoreboard')}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            {language === 'en' ? 'Celebrating the awesome efforts of our students!' : 'نحتفل بالجهود الرائعة لطلابنا!'}
          </CardDescription>
        </CardHeader>
      </Card>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student.id} className="shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 flex flex-col overflow-hidden group">
              <CardHeader className="flex flex-col items-center p-6 bg-accent/10">
                <Image
                  src={student.image || "https://placehold.co/100x100.png"}
                  alt={student.name}
                  width={100}
                  height={100}
                  data-ai-hint={student.imageHint || "student portrait"}
                  className="rounded-full border-4 border-primary shadow-md mb-3 group-hover:scale-110 transition-transform"
                />
                <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">{student.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex-grow space-y-4">
                {student.grades && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-muted-foreground flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-accent" /> {language === 'en' ? 'Performance:' : 'الأداء:'}</h4>
                    {(['discipline', 'punctuality', 'engagement', 'overallScore'] as const).map(key => (
                      student.grades && typeof student.grades[key] === 'number' && (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="flex items-center"><GradeIcon type={key} /><span className="ml-2 rtl:mr-2">{t(key)}</span></span>
                          <div className="flex items-center w-1/2">
                            <Progress value={(student.grades[key] / 5) * 100} className="w-full h-2 mr-2 rtl:ml-2" />
                            <span className="font-semibold text-primary">{student.grades[key].toFixed(1)}</span>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
                {student.encouragementMessage && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-xs italic text-primary/80 leading-relaxed">{student.encouragementMessage}</p>
                  </div>
                )}
              </CardContent>
               {student.grades && <CardFooter className="p-4 bg-muted/30 justify-center">
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
            <p className="text-xl text-muted-foreground">{t('noStudentsInClass')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
