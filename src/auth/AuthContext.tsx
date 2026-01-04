import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

/* =========================
   TYPY
   ========================= */

export type UserRole = 'USER' | 'ADMIN';

export type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  role: UserRole | null;
  user: User | null;

  loginAsGuest: () => void;
  loginAsAdmin: () => void;

  register: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
};

/* =========================
   CONTEXT
   ========================= */

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

type AuthProviderProps = {
  children: ReactNode;
};

/* =========================
   PROVIDER
   ========================= */

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);
  const [role, setRole] =
    useState<UserRole | null>(null);
  const [user, setUser] =
    useState<User | null>(null);

  /* ===== LOGIN (MOCKI) ===== */

  const loginAsGuest = () => {
    setUser({
      id: 1,
      name: 'Gość',
      email: 'guest@demo.pl',
    });
    setRole('USER');
    setIsLoggedIn(true);
  };

  const loginAsAdmin = () => {
    setUser({
      id: 999,
      name: 'Admin',
      email: 'admin@demo.pl',
    });
    setRole('ADMIN');
    setIsLoggedIn(true);
  };

  /* ===== LOGIN (BACKEND) ===== */

  const login = (loggedUser: User) => {
    setUser(loggedUser);
    setRole('USER');
    setIsLoggedIn(true);
  };

  /* ===== REGISTER ===== */

  const register = (newUser: User) => {
    setUser(newUser);
    setRole('USER');
    setIsLoggedIn(true);
  };

  /* ===== LOGOUT ===== */

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        role,
        user,
        loginAsGuest,
        loginAsAdmin,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =========================
   HOOK
   ========================= */

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }
  return context;
}
