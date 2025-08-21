import { useState, useEffect, type ReactNode } from "react";
import { login as loginApi } from "../services/api";
import { type User } from "../types";
import { AuthContext, type AuthContextType } from "./AuthContext";

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
