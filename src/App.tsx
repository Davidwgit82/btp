import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import PrivateRoute from "./components/PrivateRoute";
import Accueil from "./pages/Accueil";
import Projets from "./pages/Projets";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthNav = () => {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
      {isAuthenticated ? (
        <>
          <li className="nav-item">
            <span className="nav-link">
              Bonjour, {user?.name || user?.email}
            </span>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" onClick={logout}>
              Déconnexion
            </button>
          </li>
        </>
      ) : (
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Se connecter
          </Link>
        </li>
      )}
    </ul>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="container mt-4">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                Vernetis BTP
              </Link>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Accueil
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/projets">
                      Projets
                    </Link>
                  </li>
                </ul>
                <AuthNav />
              </div>
            </div>
          </nav>

          <h1 className="text-center my-4">
            Application BTP : Gestion de projets
          </h1>
          <hr className="my-4" />

          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route
              path="/projets"
              element={
                <PrivateRoute>
                  <Projets />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
