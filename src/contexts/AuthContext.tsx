import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  canAccessMine: (mineId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulated login - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user based on email pattern
    let mockUser: User = {
      id: 'user-1',
      name: 'Demo User',
      email: email,
      role: 'visitor',
      createdAt: new Date(),
    };

    if (email.includes('operator')) {
      mockUser = {
        ...mockUser,
        id: 'op-42',
        name: 'John Operator',
        role: 'operator',
        assignedMineId: 'mine-12',
      };
    } else if (email.includes('inspector')) {
      mockUser = {
        ...mockUser,
        id: 'ins-01',
        name: 'Sarah Inspector',
        role: 'inspector',
      };
    } else if (email.includes('admin')) {
      mockUser = {
        ...mockUser,
        id: 'adm-01',
        name: 'Admin User',
        role: 'main_admin',
      };
    } else if (email.includes('site')) {
      mockUser = {
        ...mockUser,
        id: 'site-01',
        name: 'Site Admin',
        role: 'site_admin',
      };
    }

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const canAccessMine = (mineId: string) => {
    if (!user) return false;
    if (hasRole(['main_admin', 'site_admin'])) return true;
    if (user.role === 'operator' && user.assignedMineId === mineId) return true;
    if (user.role === 'inspector') return true;
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
        canAccessMine,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}