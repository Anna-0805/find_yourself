/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  role: 'candidate' | 'employer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'candidate' | 'employer') => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      alert('Пароль має містити щонайменше 6 символів!');
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}