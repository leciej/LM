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
  loginAsUser: () => void;
  loginAsAdmin: () => void;
  register: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const loginAsUser = (): void => {
    setIsLoggedIn(true);
    setRole('USER');
  };

  const loginAsAdmin = (): void => {
    setIsLoggedIn(true);
    setRole('ADMIN');
  };

  const register = (newUser: User): void => {
    setUser(newUser);
    setIsLoggedIn(true);
    setRole('USER');
  };

  const logout = (): void => {
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
        loginAsUser,
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
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
