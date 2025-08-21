import { useEffect, useState } from "react";
import {
  getProjects,
  getUsers,
  deleteProject,
  //  updateProject,
} from "../services/api";
import ProjectForm from "../components/ProjectForm";
import { type User } from "../types";
import { type Project } from "../services/types";

const Projets = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    const projectsList = await getProjects();
    setProjects(projectsList);
  };

  const fetchUsers = async () => {
    const usersList = await getUsers();
    setUsers(usersList);
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const handleDelete = async (projectId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      try {
        await deleteProject(projectId);
        fetchProjects(); // Rafraîchir la liste
      } catch (err) {
        console.error("Échec de la suppression:", err);
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
  };

  const handleFormSubmitted = () => {
    fetchProjects();
    setEditingProject(null); // Réinitialiser le formulaire
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h2 className="mb-3">
          {editingProject ? "Modifier le projet" : "Ajouter un projet"}
        </h2>
        <ProjectForm
          onProjectCreated={handleFormSubmitted}
          users={users}
          projectToEdit={editingProject}
        />
      </div>
      <div className="col-md-6">
        <h2 className="mb-3">Liste des projets</h2>
        {projects.length > 0 ? (
          <ul className="list-group">
            {projects.map((project) => (
              <li key={project.id} className="list-group-item">
                <h5>{project.title}</h5>
                <p>
                  <strong>Description:</strong> {project.description}
                </p>
                <p>
                  <strong>Auteur:</strong>{" "}
                  {project.author?.name || project.author?.email}
                </p>
                <p>
                  <strong>Statut:</strong> {project.status}
                </p>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(project)}
                >
                  Modifier
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(project.id)}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="alert alert-info">Aucun projet trouvé.</div>
        )}
      </div>
    </div>
  );
};

export default Projets;
