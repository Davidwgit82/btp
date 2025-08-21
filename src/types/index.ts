// src/types/index.ts
export interface User {
  id: number;
  email: string;
  password?: string; // Le mot de passe peut être optionnel ou non présent lors de la récupération
  name?: string; // Le nom peut être optionnel
  role: "user" | "admin"; // string
  createdAt?: string; // Dates peuvent être des strings ou Date selon la conversion
  updatedAt?: string;
}

export type CreateUserPayload = Omit<User, "id" | "createdAt" | "updatedAt">;
