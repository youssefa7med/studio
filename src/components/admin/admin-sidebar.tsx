"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, CalendarDays, UserCog, LogOut, ShieldCheck, Settings } from 'lucide-react';
import Image from 'next/image';

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout, currentAdmin } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { href: '/admin/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
    { href: '/admin/students', labelKey: 'students', icon: Users },
    { href: '/admin/schedule', labelKey: 'schedule', icon: CalendarDays },
    { href: '/admin/manage-admins', labelKey: 'manageAdmins', icon: UserCog },
  ];

  return (
    <aside className={cn(
      "sticky top-0 h-screen flex flex-col border-e bg-sidebar text-sidebar-foreground shadow-lg",
      language === 'ar' ? 'border-s' : 'border-e',
      "w-60" // Adjusted width to 240px (15rem * 16px/rem = 240px; w-60 in Tailwind is 15rem)
    )}>
      <div className="flex h-16 items-center justify-center border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
          <Image src="https://placehold.co/40x40.png" alt="Tricks Land Icon" width={32} height={32} data-ai-hint="letter T colorful" className="rounded-full"/>
          <span className="font-headline text-lg text-sidebar-primary">{t('admin')}</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Button
              key={item.labelKey}
              variant={pathname === item.href ? 'default' : 'ghost'}
              className={cn(
                "justify-start gap-2",
                pathname === item.href ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90' : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                {t(item.labelKey)}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto border-t p-4">
        {currentAdmin && (
            <div className="mb-2 p-2 rounded-md bg-sidebar-accent/30 text-center">
                <p className="text-sm font-medium text-sidebar-foreground">{currentAdmin.username}</p>
                <p className="text-xs text-sidebar-foreground/70">{t('admin')}</p>
            </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-destructive/20 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {t('logout')}
        </Button>
      </div>
    </aside>
  );
}
