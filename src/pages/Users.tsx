import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users as UsersIcon, UserPlus, Search, Edit, 
  Trash2, Shield, Activity, Mail, MapPin
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from '@/types';

export default function Users() {
  const { user: currentUser, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'operator' as User['role'],
    assignedMineId: '',
  });

  // Mock users data
  const users: User[] = [
    {
      id: 'adm-01',
      name: 'Admin User',
      email: 'admin@mining.com',
      role: 'main_admin',
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'site-01',
      name: 'Site Admin',
      email: 'site@mining.com',
      role: 'site_admin',
      createdAt: new Date('2024-01-15'),
    },
    {
      id: 'op-42',
      name: 'John Operator',
      email: 'john.op@mining.com',
      role: 'operator',
      assignedMineId: 'mine-12',
      createdAt: new Date('2024-02-01'),
    },
    {
      id: 'op-43',
      name: 'Sarah Miller',
      email: 'sarah.m@mining.com',
      role: 'operator',
      assignedMineId: 'mine-12',
      createdAt: new Date('2024-02-15'),
    },
    {
      id: 'ins-01',
      name: 'Sarah Inspector',
      email: 'sarah.ins@mining.com',
      role: 'inspector',
      createdAt: new Date('2024-03-01'),
    },
    {
      id: 'ins-02',
      name: 'Mike Johnson',
      email: 'mike.j@mining.com',
      role: 'inspector',
      createdAt: new Date('2024-03-10'),
    },
    {
      id: 'vis-01',
      name: 'Guest User',
      email: 'guest@example.com',
      role: 'visitor',
      createdAt: new Date('2024-04-01'),
    },
  ];

  const getRoleBadge = (role: User['role']) => {
    const roleColors = {
      main_admin: 'bg-purple-500',
      site_admin: 'bg-blue-500',
      operator: 'bg-green-500',
      inspector: 'bg-orange-500',
      visitor: 'bg-gray-500',
    };
    
    const roleLabels = {
      main_admin: 'Main Admin',
      site_admin: 'Site Admin',
      operator: 'Operator',
      inspector: 'Inspector',
      visitor: 'Visitor',
    };
    
    return (
      <Badge className={`${roleColors[role]} text-white`}>
        {roleLabels[role]}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterRole !== 'all' && user.role !== filterRole) {
      return false;
    }
    return true;
  });

  const handleAddUser = () => {
    // In real app, this would call the API
    console.log('Adding user:', newUser);
    setShowAddDialog(false);
    setNewUser({ name: '', email: '', role: 'operator', assignedMineId: '' });
  };

  const handleEditUser = () => {
    if (editingUser) {
      // In real app, this would call the API
      console.log('Updating user:', editingUser);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    // In real app, this would call the API
    console.log('Deleting user:', userId);
  };

  // Only admins can access this page
  if (!hasRole(['main_admin', 'site_admin'])) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="p-8 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground">
            You don't have permission to access user management.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage system users and permissions
          </p>
        </div>
        {hasRole('main_admin') && (
          <Button onClick={() => setShowAddDialog(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <UsersIcon className="w-8 h-8 text-primary" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Operators</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.role === 'operator').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inspectors</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.role === 'inspector').length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">
                {users.filter(u => u.role.includes('admin')).length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="pl-10"
            />
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="main_admin">Main Admin</SelectItem>
              <SelectItem value="site_admin">Site Admin</SelectItem>
              <SelectItem value="operator">Operator</SelectItem>
              <SelectItem value="inspector">Inspector</SelectItem>
              <SelectItem value="visitor">Visitor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* User List */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </span>
                        {user.assignedMineId && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            Mine {user.assignedMineId}
                          </span>
                        )}
                        <span>
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getRoleBadge(user.role)}
                    {hasRole('main_admin') && user.id !== currentUser?.id && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with role assignment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Full name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="email@example.com"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select 
                value={newUser.role} 
                onValueChange={(value: User['role']) => 
                  setNewUser({...newUser, role: value})
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operator">Operator</SelectItem>
                  <SelectItem value="inspector">Inspector</SelectItem>
                  <SelectItem value="site_admin">Site Admin</SelectItem>
                  <SelectItem value="main_admin">Main Admin</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newUser.role === 'operator' && (
              <div>
                <label className="text-sm font-medium">Assigned Mine</label>
                <Input
                  value={newUser.assignedMineId}
                  onChange={(e) => setNewUser({...newUser, assignedMineId: e.target.value})}
                  placeholder="Mine ID"
                  className="mt-1"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and role
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select 
                  value={editingUser.role} 
                  onValueChange={(value: User['role']) => 
                    setEditingUser({...editingUser, role: value})
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="inspector">Inspector</SelectItem>
                    <SelectItem value="site_admin">Site Admin</SelectItem>
                    <SelectItem value="main_admin">Main Admin</SelectItem>
                    <SelectItem value="visitor">Visitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}