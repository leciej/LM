import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export type UserRole = 'USER' | 'ADMIN';

export type User = {
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
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);
  const [role, setRole] =
    useState<UserRole | null>(null);
  const [user, setUser] =
    useState<User | null>(null);

  /* ===== LOGIN ===== */

  const loginAsGuest = () => {
    setUser({
      name: 'Gość',
      email: 'guest@demo.pl',
    });
    setRole('USER');
    setIsLoggedIn(true);
  };

  const loginAsAdmin = () => {
    setUser({
      name: 'Admin',
      email: 'admin@demo.pl',
    });
    setRole('ADMIN');
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
