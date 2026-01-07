import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http } from '../api/http';
import { CartApi } from '../api/cart';
import {
  refreshCart,
  resetCartStore,
} from '../features/cart/store/cartStore';
import { setCurrentUserId } from './userSession';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

export type User = {
  id: number;
  name: string;
  surname: string;
  login: string;
  email: string | null;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;

  login: (loginOrEmail: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  /* =========================
     RESTORE SESSION
     ========================= */
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: User = JSON.parse(stored);
          setUser(parsed);
          setCurrentUserId(parsed.id);
          await refreshCart();
        }
      } finally {
        setInitialized(true);
      }
    };

    restoreUser();
  }, []);

  /* =========================
     LOGIN USER / ADMIN
     ========================= */
  const login = async (
    loginOrEmail: string,
    password: string
  ) => {
    const res = await http.post<User>(
      '/users/login',
      { loginOrEmail, password }
    );

    setUser(res.data);
    setCurrentUserId(res.data.id);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(res.data)
    );

    await refreshCart();
  };

  /* =========================
     LOGIN GUEST
     ========================= */
  const loginAsGuest = async () => {
    const res = await http.post<User>('/users/guest');

    setUser(res.data);
    setCurrentUserId(res.data.id);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(res.data)
    );

    await refreshCart();
  };

  /* =========================
     LOGOUT (VARIANT A)
     ========================= */
  const logout = async () => {
    try {
      // 🔥 TYLKO GOŚĆ → backend cleanup
      if (user?.role === 'GUEST') {
        await CartApi.clear(user.id);
        await http.post('/users/logout', user.id);
      }
    } finally {
      // frontend reset ZAWSZE
      setCurrentUserId(null);
      resetCartStore();
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  if (!initialized) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'ADMIN',
        login,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }
  return context;
}
