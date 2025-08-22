import { useEffect, useState } from "react";
import { getUsers } from "../services/api";
import UserForm from "../components/UserForm";
import { type User } from "../types";
import { useAuth } from "../hooks/useAuth";

function Accueil() {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth(); // Récupérez les infos de l'utilisateur connecté

  const fetchUsers = async () => {
    const usersList: User[] = await getUsers();
    setUsers(usersList);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isAdmin = user && user.role === "admin";

  return (
    <div className="row">
      <div className="col-12 col-md-6">
        <h2 className="mb-3">Ajouter un utilisateur</h2>
        {isAdmin ? (
          <UserForm onUserCreated={fetchUsers} />
        ) : (
          <div className="alert alert-warning">
            Seuls les administrateurs peuvent créer des utilisateurs.
          </div>
        )}
      </div>
      <div className="col-12 col-md-6">
        <h2 className="mb-3">Liste des utilisateurs</h2>
        {users.length > 0 ? (
          <ul className="list-group">
            {users.map((u) => (
              <li
                key={u.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {u.name || "Nom non défini"} - {u.email}
                <span className="badge bg-primary rounded-pill">{u.role}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="alert alert-info">Aucun utilisateur trouvé.</div>
        )}
      </div>
    </div>
  );
}

export default Accueil;
