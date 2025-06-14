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
import { PlusCircle, Trash2 } from 'lucide-react';
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
  const { admins, addAdmin } = useAuth(); // Assuming deleteAdmin is not yet implemented in context
  const { toast } = useToast();
  const [localAdmins, setLocalAdmins] = useState<AdminUser[]>(admins); // Use local state for display & deletion
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  const handleAddAdmin = () => {
     if (!newAdminUsername || !newAdminPassword) {
      toast({ title: "Error", description: "Username and password are required.", variant: "destructive"});
      return;
    }
    const newAdminData: AdminUser = {
      id: String(localAdmins.length + 1), // Simple ID generation
      username: newAdminUsername,
      password: newAdminPassword,
    };
    addAdmin(newAdminData); // Update context
    setLocalAdmins(prev => [...prev, newAdminData]); // Update local display state
    setNewAdminUsername('');
    setNewAdminPassword('');
    setIsModalOpen(false);
    toast({ title: t('addAdmin'), description: `${newAdminUsername} added successfully.` });
  };
  
  // Deletion would be more complex if need to sync with AuthContext and avoid deleting self.
  // For now, this is a visual deletion from localAdmins for demonstration.
  const handleDeleteAdmin = (adminId: string) => {
    // Basic protection: don't delete the first admin or current admin if implemented
    if (adminId === '1') {
        toast({ title: "Error", description: "Cannot delete the primary admin.", variant: "destructive"});
        return;
    }
    setLocalAdmins(localAdmins.filter(admin => admin.id !== adminId));
    // In a real app, you'd call a method on useAuth() to update the persisted admin list.
    toast({ title: "Admin Deleted", description: "Admin removed successfully (visual only).", variant: "destructive" });
  };


  return (
    <div className="space-y-6">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-3xl text-primary">{t('manageAdmins')}</CardTitle>
            <CardDescription>{t('addAdmin')}</CardDescription>
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
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.id}</TableCell>
                  <TableCell className="font-medium">{admin.username}</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDeleteAdmin(admin.id)}
                      disabled={admin.id === '1'}  // Disable deleting the first admin
                      title="Delete Admin (visual only)"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
