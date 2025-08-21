import { useState, useEffect, type FormEvent } from "react";
import { createProject, updateProject } from "../services/api";
import { type User } from "../types";
import type { Project } from "../services/types";

interface ProjectFormProps {
  onProjectCreated: () => void;
  users: User[];
  projectToEdit: Project | null;
}

const ProjectForm = ({
  onProjectCreated,
  users,
  projectToEdit,
}: ProjectFormProps) => {
  const [title, setTitle] = useState(projectToEdit?.title || "");
  const [description, setDescription] = useState(
    projectToEdit?.description || ""
  );
  const [startDate, setStartDate] = useState(
    projectToEdit?.startDate.substring(0, 10) || ""
  );
  const [endDate, setEndDate] = useState(
    projectToEdit?.endDate.substring(0, 10) || ""
  );
  const [authorId, setAuthorId] = useState<string>(
    projectToEdit?.authorId.toString() || ""
  );
  const [status, setStatus] = useState(projectToEdit?.status || "planning");
  const [error, setError] = useState("");

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setDescription(projectToEdit.description || "");
      setStartDate(projectToEdit.startDate.substring(0, 10));
      setEndDate(projectToEdit.endDate.substring(0, 10));
      setAuthorId(projectToEdit.authorId.toString());
      setStatus(projectToEdit.status);
    } else {
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setAuthorId("");
      setStatus("planning");
    }
  }, [projectToEdit]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      if (!authorId) {
        setError("Veuillez sélectionner un auteur.");
        return;
      }

      const projectData = {
        title,
        description,
        startDate,
        endDate,
        authorId: parseInt(authorId),
        status,
      };

      if (projectToEdit) {
        await updateProject(projectToEdit.id, projectData);
      } else {
        await createProject(projectData);
      }
      onProjectCreated();
    } catch {
      setError("Échec de la sauvegarde du projet. Veuillez réessayer.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {/* ...champs du formulaire existants ... */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Titre
        </label>
        <input
          type="text"
          className="form-control"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          className="form-control"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="startDate" className="form-label">
          Date de début
        </label>
        <input
          type="date"
          className="form-control"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="endDate" className="form-label">
          Date de fin
        </label>
        <input
          type="date"
          className="form-control"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="author" className="form-label">
          Auteur
        </label>
        <select
          className="form-select"
          id="author"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          required
        >
          <option value="">Sélectionner un auteur</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Statut
        </label>
        <select
          className="form-select"
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="planning">Planification</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
        </select>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-primary">
        {projectToEdit ? "Mettre à jour le projet" : "Créer le projet"}
      </button>
    </form>
  );
};

export default ProjectForm;
