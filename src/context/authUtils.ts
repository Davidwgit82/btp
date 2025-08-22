import { createContext } from "react";
import { type User } from "../types";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: Pick<User, "email" | "password">) => Promise<void>;
  logout: () => void;
}

// Contexte (pas de composant ici)
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
