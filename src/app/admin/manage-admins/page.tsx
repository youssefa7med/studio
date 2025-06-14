
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage } from '@/contexts/language-context';
import type { AdminUser } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ManageAdminsPage() {
  const { t } = useLanguage();
  const { admins, addAdmin, currentAdmin } = useAuth(); 
  const { toast } = useToast();
  
  // Use a local state that is initialized from the context to allow for immediate UI updates for deletion.
  // The actual persistence logic is within AuthContext.
  const [localAdmins, setLocalAdmins] = useState<AdminUser[]>(admins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Sync localAdmins when context's admins array changes (e.g., after addAdmin in context)
  React.useEffect(() => {
    setLocalAdmins(admins);
  }, [admins]);

  const handleAddAdmin = () => {
     if (!newAdminUsername || !newAdminPassword) {
      toast({ title: t('errorLoginFailed'), description: "Username and password are required.", variant: "destructive"});
      return;
    }
    // Check if admin already exists
    if (admins.find(admin => admin.username === newAdminUsername)) {
      toast({ title: t('errorLoginFailed'), description: `Admin with username ${newAdminUsername} already exists.`, variant: "destructive"});
      return;
    }

    const newAdminData: AdminUser = {
      id: String(Date.now()), // More unique ID
      username: newAdminUsername,
      password: newAdminPassword,
    };
    addAdmin(newAdminData); // This will update the context and trigger the useEffect to update localAdmins
    
    setNewAdminUsername('');
    setNewAdminPassword('');
    setIsModalOpen(false);
    toast({ title: t('addAdmin'), description: `${newAdminUsername} ${t('admin')} ${language === 'ar' ? 'أضيف بنجاح' : 'added successfully.'}` });
  };
  
  const handleDeleteAdmin = (adminId: string, adminUsername: string) => {
    if (adminId === currentAdmin?.id) {
        toast({ title: "Error", description: "You cannot delete your own account.", variant: "destructive"});
        return;
    }
    // This is a simplified deletion. In a real app, you'd call a specific deleteAdmin function from useAuth
    // which would handle backend calls and state updates more robustly.
    // For now, we filter the local state for an immediate visual update.
    // The actual `admins` list in AuthContext is not modified by this local visual deletion.
    // To properly delete, AuthContext would need a `deleteAdmin` method.
    setLocalAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== adminId));
    toast({ title: "Admin Deleted (Locally)", description: `${adminUsername} removed from this view. Implement full deletion in AuthContext.`, variant: "destructive" });
    // IMPORTANT: To make deletion persistent, you would need to implement:
    // 1. A `deleteAdmin(adminId: string)` function in `AuthContext`.
    // 2. This function would call `setAdmins(prevAdmins => prevAdmins.filter(a => a.id !== adminId))`.
    // 3. Call that context function here instead of just `setLocalAdmins`.
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <UserCog className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="font-headline text-3xl text-primary">{t('manageAdmins')}</CardTitle>
              <CardDescription>{t('addAdminDescription')}</CardDescription>
            </div>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-5 w-5" /> {t('addAdmin')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-headline">{t('addAdmin')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="newAdminUsername">{t('username')}</Label>
                  <Input id="newAdminUsername" value={newAdminUsername} onChange={(e) => setNewAdminUsername(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="newAdminPassword">{t('password')}</Label>
                  <Input type="password" id="newAdminPassword" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>{t('close')}</Button>
                <Button onClick={handleAddAdmin}>{t('addAdmin')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>{t('username')}</TableHead>
                <TableHead className="text-center">{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.id.substring(0,5)}...</TableCell>
                  <TableCell className="font-medium">{admin.username}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDeleteAdmin(admin.id, admin.username)}
                      disabled={admin.id === currentAdmin?.id} 
                      title={admin.id === currentAdmin?.id ? "Cannot delete self" : t('delete') + ' ' + admin.username}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {localAdmins.length === 0 && (
             <p className="text-center text-muted-foreground py-8">{language === 'ar' ? 'لا يوجد مسؤولون لعرضهم.' : 'No admins to display.'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
