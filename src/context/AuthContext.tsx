// src/context/AuthContext.tsx
import { useState, useEffect, type ReactNode, createContext } from "react";
import { login as loginApi } from "../services/api";
import { type User } from "../types";

// Définition du type du contexte
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: Pick<User, "email" | "password">) => Promise<void>;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials: Pick<User, "email" | "password">) => {
    const { token, user } = await loginApi(credentials);
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextType = { isAuthenticated, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
