"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Mock data for classes, in a real app this would come from an API
const MOCK_CLASSES = [
  { id: '1', name: { en: 'Junior Acrobats', ar: 'الأكروبات الصغار' }, description: {en: "Basic gymnastic skills and fun games.", ar: "مهارات جمباز أساسية وألعاب ممتعة."} , image: "https://placehold.co/600x400.png", imageHint: "children gymnastics" },
  { id: '2', name: { en: 'Advanced Tumblers', ar: 'المتمرسون المتقدمون' }, description: {en: "Focus on advanced tumbling techniques.", ar: "التركيز على تقنيات الشقلبة المتقدمة."}, image: "https://placehold.co/600x400.png", imageHint: "kids tumbling" },
  { id: '3', name: { en: 'Parkour Pros', ar: 'محترفو الباركور' }, description: {en: "Learn the art of movement and obstacle navigation.", ar: "تعلم فن الحركة وتجاوز العقبات."}, image: "https://placehold.co/600x400.png", imageHint: "kids parkour" },
];

export default function HomePage() {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center space-y-12">
      <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-br from-primary/20 via-background to-background rounded-xl shadow-lg">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-start">
              <div className="space-y-2">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  {t('landingTitle')}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                  {t('landingSubtitle')}
                </p>
              </div>
              <div className="mx-auto lg:mx-0">
                <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
                  <Link href="#classes">
                    {t('viewScoreboard')} <ArrowRight className={`ms-2 h-5 w-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
                  </Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              width={600}
              height={400}
              alt="Happy children doing tricks"
              data-ai-hint="children gymnastics parkour"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-xl"
            />
          </div>
        </div>
      </section>

      <section id="classes" className="w-full max-w-5xl space-y-8">
        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl text-primary">
          {language === 'en' ? 'Our Classes' : 'فصولنا الدراسية'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CLASSES.map((classItem) => (
            <Card key={classItem.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden">
              <CardHeader className="p-0">
                <Image 
                  src={classItem.image} 
                  alt={classItem.name[language]} 
                  width={600} 
                  height={400} 
                  className="w-full h-48 object-cover"
                  data-ai-hint={classItem.imageHint}
                />
              </CardHeader>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <CardTitle className="font-headline text-2xl text-primary mb-2">{classItem.name[language]}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4 min-h-[40px]">{classItem.description[language]}</p>
                <Button asChild variant="default" className="w-full mt-auto">
                  <Link href={`/class/${classItem.id}`}>
                    {t('viewScoreboard')} <ArrowRight className={`ms-2 h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
