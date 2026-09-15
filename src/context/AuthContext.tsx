/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, type ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  role: 'candidate' | 'employer';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'candidate' | 'employer') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('vv_work_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('vv_work_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('vv_work_user');
    }
  }, [user]);

  const login = (email: string, password: string, role: 'candidate' | 'employer') => {
    if (password.length < 6) {
      return false;
    }

    setUser({
      name: role === 'employer' ? 'Роботодавець ЄС' : 'Кандидат',
      email,
      role,
    });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
