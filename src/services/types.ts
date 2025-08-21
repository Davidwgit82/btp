export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

// table projets
export interface Project {
  id: number;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  authorId: number;
  author?: User; // On peut inclure l'auteur si on le demande dans la requête
}
