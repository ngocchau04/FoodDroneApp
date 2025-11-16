import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types/user';
import { login as loginApi } from '../services/api/authApi';
import { setAuthToken } from '../services/api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: false,
  });

  const login = async (email: string, password: string) => {
    try {
      setState((s) => ({ ...s, loading: true }));
      const data = await loginApi(email, password);
      setAuthToken(data.accessToken);

      setState({
        user: data.user,
        token: data.accessToken,
        loading: false,
      });
    } catch (err) {
      setState((s) => ({ ...s, loading: false }));
      throw err;
    }
  };

  const logout = () => {
    setAuthToken(undefined);
    setState({
      user: null,
      token: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
