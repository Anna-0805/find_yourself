/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from 'react';

interface User {
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
    try {
      const saved = localStorage.getItem('vv_work_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Помилка парсингу сесії користувача:", e);
      return null;
    }
  });

  const login = (email: string, password: string, role: 'candidate' | 'employer') => {
    if (password.length < 6) {
      return false;
    }

    const userData: User = {
      name: role === 'employer' ? 'Роботодавець' : 'Кандидат',
      email,
      role,
    };

    setUser(userData);
    localStorage.setItem('vv_work_user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vv_work_user'); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}