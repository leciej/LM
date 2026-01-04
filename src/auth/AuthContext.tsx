import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export type UserRole = 'GUEST' | 'USER' | 'ADMIN';

export type User = {
  id: number;
  name: string;
  surname: string;
  login: string;
  email: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;

  login: (loginOrEmail: string, password: string) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

type AuthProviderProps = {
  children: ReactNode;
};

const API_URL = 'http://localhost:5000/api/users';

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(
    null
  );

  /* =========================
     LOGIN USER / ADMIN
     ========================= */
  const login = async (
    loginOrEmail: string,
    password: string
  ) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        loginOrEmail,
        password,
      }),
    });

    if (!res.ok) {
      throw new Error('Niepoprawny login lub hasło');
    }

    const data: User = await res.json();
    setUser(data);
  };

  /* =========================
     LOGIN GUEST (BACKEND)
     ========================= */
  const loginAsGuest = async () => {
    const res = await fetch(`${API_URL}/guest`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error('Nie udało się zalogować jako gość');
    }

    const data: User = await res.json();
    setUser(data);
  };

  /* =========================
     LOGOUT
     ========================= */
  const logout = () => {
    setUser(null);
  };

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
