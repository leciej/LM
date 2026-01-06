import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { http } from '../api/http';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

export type User = {
  id: number;
  name: string;
  surname: string;
  login: string;
  email: string | null; // 🔥 MUSI BYĆ NULLABLE
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
          setUser(JSON.parse(stored));
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
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(res.data)
    );
  };

  /* =========================
     LOGIN AS GUEST
     ========================= */
  const loginAsGuest = async () => {
    const res = await http.post<User>('/users/guest');

    setUser(res.data);
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(res.data)
    );
  };

  /* =========================
     LOGOUT (DELETE GUEST)
     ========================= */
  const logout = async () => {
    try {
      if (user?.role === 'GUEST') {
        // 🔥 informujemy backend, żeby USUNĄŁ rekord gościa
        await http.post('/users/logout', user.id);
      }
    } catch {
      // nic – logout i tak ma wyczyścić lokalny stan
    } finally {
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  };

  // ⛔ nie renderuj appki zanim nie odtworzysz sesji
  if (!initialized) {
    return null;
  }

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
