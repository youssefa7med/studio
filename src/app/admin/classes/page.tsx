
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { useStudentData } from '@/contexts/student-data-context';
import type { ClassItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlusCircle, Edit3, Trash2, CalendarIcon, School } from 'lucide-react';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { arSA, enUS } from 'date-fns/locale';

export default function ClassesPage() {
  const { t, language } = useLanguage();
  const { classes, addClass: addClassToContext, updateClass: updateClassInContext, deleteClass: deleteClassFromContext } = useStudentData();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  const [currentClassName, setCurrentClassName] = useState('');
  const [currentClassPhotoUrl, setCurrentClassPhotoUrl] = useState('');
  const [currentClassPhotoHint, setCurrentClassPhotoHint] = useState('');
  const [currentClassDate, setCurrentClassDate] = useState<Date | undefined>(new Date());
  
  const currentLocale = language === 'ar' ? arSA : enUS;

  const openAddModal = () => {
    setEditingClass(null);
    setCurrentClassName('');
    setCurrentClassPhotoUrl('https://placehold.co/600x400.png');
    setCurrentClassPhotoHint('');
    setCurrentClassDate(new Date());
    setIsModalOpen(true);
  };

  const openEditModal = (classItem: ClassItem) => {
    setEditingClass(classItem);
    setCurrentClassName(classItem.name);
    setCurrentClassPhotoUrl(classItem.photoUrl);
    setCurrentClassPhotoHint(classItem.photoHint);
    setCurrentClassDate(classItem.date);
    setIsModalOpen(true);
  };

  const handleSaveClass = () => {
    if (!currentClassName || !currentClassPhotoUrl || !currentClassDate) {
      toast({ title: "Error", description: "All fields are required.", variant: "destructive"});
      return;
    }

    const classDetails = { 
      name: currentClassName, 
      photoUrl: currentClassPhotoUrl, 
      photoHint: currentClassPhotoHint || 'class activity', 
      date: currentClassDate,
    };

    if (editingClass) {
      updateClassInContext({ ...editingClass, ...classDetails });
      toast({ title: t('edit') + ' ' + t('className'), description: `${currentClassName} updated successfully.` });
    } else {
      addClassToContext(classDetails);
      toast({ title: t('addClass'), description: `${currentClassName} added successfully.` });
    }
    setIsModalOpen(false);
  };
  
  const handleDeleteClass = (classId: string) => {
    deleteClassFromContext(classId);
    toast({ title: "Class Deleted", description: "Class removed successfully.", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
             <School className="h-8 w-8 text-primary" />
            <div>
                <CardTitle className="font-headline text-3xl text-primary">{t('manageClassesPageTitle')}</CardTitle>
                <CardDescription>{t('manageClassesPageDescription')}</CardDescription>
            </div>
          </div>
          <Button onClick={openAddModal}>
            <PlusCircle className="mr-2 h-5 w-5" /> {t('addClass')}
          </Button>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('noClassesDefined')}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((classItem) => (
                <Card key={classItem.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <Image 
                    src={classItem.photoUrl} 
                    alt={classItem.name} 
                    width={400} 
                    height={200} 
                    data-ai-hint={classItem.photoHint}
                    className="w-full h-48 object-cover" 
                  />
                  <CardHeader>
                    <CardTitle className="font-headline text-xl text-primary">{classItem.name}</CardTitle>
                    <CardDescription>
                      {t('classDate')}: {format(classItem.date, 'PPP', { locale: currentLocale })}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-end space-x-2 rtl:space-x-reverse">
                    <Button variant="outline" size="icon" onClick={() => openEditModal(classItem)} title={t('edit')}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteClass(classItem.id)} title={t('delete')}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">
              {editingClass ? t('edit') + ' ' + t('className') : t('addClass')}
            </DialogTitle>
            <DialogDescription>{t('addClassDetails')}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="classNameInput">{t('className')}</Label>
              <Input id="classNameInput" value={currentClassName} onChange={(e) => setCurrentClassName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="classPhotoUrl">{t('photoUrl')}</Label>
              <Input 
                id="classPhotoUrl" 
                value={currentClassPhotoUrl} 
                onChange={(e) => setCurrentClassPhotoUrl(e.target.value)} 
                placeholder="https://placehold.co/600x400.png"
              />
            </div>
             <div>
              <Label htmlFor="classPhotoHint">{language === 'en' ? 'Photo Description (for AI)' : 'وصف الصورة (للذكاء الاصطناعي)'}</Label>
              <Input 
                id="classPhotoHint" 
                value={currentClassPhotoHint} 
                onChange={(e) => setCurrentClassPhotoHint(e.target.value)} 
                placeholder={language === 'en' ? 'e.g. kids yoga class' : 'مثال: فصل يوجا للأطفال'}
              />
            </div>
            <div>
                <Label htmlFor="classDate">{t('classDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!currentClassDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentClassDate ? format(currentClassDate, "PPP", { locale: currentLocale }) : <span>{language === 'en' ? 'Pick a date' : 'اختر تاريخًا'}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentClassDate}
                      onSelect={setCurrentClassDate}
                      initialFocus
                      locale={currentLocale}
                      dir={language === 'ar' ? 'rtl' : 'ltr'}
                    />
                  </PopoverContent>
                </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t('close')}</Button>
            <Button onClick={handleSaveClass}>{editingClass ? t('saveGrades') : t('addClass')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
