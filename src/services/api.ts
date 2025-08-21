import axios from "axios";
import { type User, type CreateUserPayload } from "../types";
import { type Project } from "./types";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return [];
  }
};

export const createUser = async (
  userData: CreateUserPayload
): Promise<User> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("L'utilisateur n'est pas authentifié.");
  }

  try {
    const response = await api.post("/users", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    throw error;
  }
};

// gestion projet
export const getProjects = async (): Promise<Project[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return [];
  }
};

export const createProject = async (
  projectData: Omit<
    Project,
    "id" | "status" | "createdAt" | "updatedAt" | "author"
  >
): Promise<Project> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("L'utilisateur n'est pas authentifié.");
  }

  try {
    const response = await api.post("/projects", projectData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    throw error;
  }
};

export const updateProject = async (
  projectId: number,
  projectData: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>
): Promise<Project> => {
  try {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: number): Promise<void> => {
  try {
    await api.delete(`/projects/${projectId}`);
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    throw error;
  }
};

// Fonction pour la connexion
export const login = async (credentials: Pick<User, "email" | "password">) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

/*
export const logout = () => {
  localStorage.removeItem("token");
}; */
