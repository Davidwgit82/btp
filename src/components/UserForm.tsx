import { useState, type FormEvent } from "react";
import { createUser } from "../services/api";
import { type User } from "../types";

const UserForm = ({ onUserCreated }: { onUserCreated: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      const userData: Omit<User, "id" | "createdAt" | "updatedAt"> = {
        name,
        email,
        password,
        role: "user",
      };
      await createUser(userData);
      onUserCreated();
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setError("Échec de la création de l'utilisateur. Veuillez réessayer.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Nom
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Mot de passe
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button type="submit" className="btn btn-success">
        Ajouter l'utilisateur
      </button>
    </form>
  );
};

export default UserForm;
