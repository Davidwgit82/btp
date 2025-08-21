const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "9f4b2c8d7e3a1f6b0d2e4c9f7a8b6c3d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b"; 

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Ajoute les infos de l'utilisateur à la requête
    next(); // Passe au prochain middleware ou à la route
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
