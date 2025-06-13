import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMySelf } from '../services/api';
import { UserRole } from '../data/enum/UserRole';
import { UserDto } from '../data/models/UserDto';

type User = UserDto;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getMySelf();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user data:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi(email, password);
      console.log('Login response:', response);
      


      // Store token in localStorage
      localStorage.setItem('token', response);

      // Get user data from backend
      if (response) {
            const userData = await getMySelf();
            console.log('User data after login:', userData);
            
            setUser(userData);
        }
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Propagate the original error
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const { user, token } = await registerApi(name, email, password, role);
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};