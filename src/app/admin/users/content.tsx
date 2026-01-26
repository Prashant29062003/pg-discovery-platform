'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUserRole, getAllUsers } from '@/modules/admin/admin.actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function UserManagementContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Record<string, 'owner' | 'visitor'>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setIsLoading(true);
      const data = await getAllUsers();
      setUsers(data as User[]);
      
      // Initialize selected roles
      const roleMap: Record<string, 'owner' | 'visitor'> = {};
      (data as User[]).forEach(user => {
        roleMap[user.id] = (user.role || 'visitor') as 'owner' | 'visitor';
      });
      setSelectedRole(roleMap);
    } catch (error) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: 'owner' | 'visitor') {
    try {
      setSelectedRole(prev => ({
        ...prev,
        [userId]: newRole
      }));
      
      await updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update role');
      console.error(error);
      // Revert
      loadUsers();
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user roles (owner vs visitor)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-muted-foreground">No users found</p>
            ) : (
              <div className="space-y-2">
                {users.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.id}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={selectedRole[user.id] === 'owner' ? 'default' : 'secondary'}
                      >
                        {selectedRole[user.id]}
                      </Badge>

                      <Select
                        value={selectedRole[user.id] || 'visitor'}
                        onValueChange={(value) =>
                          handleRoleChange(user.id, value as 'owner' | 'visitor')
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Owner</SelectItem>
                          <SelectItem value="visitor">Visitor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={loadUsers} variant="outline" className="w-full mt-4">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
