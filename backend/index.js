const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "9f4b2c8d7e3a1f6b0d2e4c9f7a8b6c3d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b";

const authMiddleware = require("./middleware/auth");
const roleMiddleware = require("./middleware/role");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Route de test
app.get("/", (req, res) => {
  res.send("API est en cours!");
});

// Routes pour les utilisateurs
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    // Le reste du code est inchangé
    const { name, email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

// NOUVELLES ROUTES POUR LES PROJETS
app.get("/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { author: true }, // Inclut les informations de l'auteur du projet
    });
    res.json(projects);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

app.post("/projects", authMiddleware, async (req, res) => {
  const { title, description, startDate, endDate, authorId } = req.body;
  if (!title || !startDate || !endDate || !authorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        author: {
          connect: { id: parseInt(authorId) },
        },
      },
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

app.put("/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, status, authorId } = req.body;
  try {
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        status,
        author: authorId ? { connect: { id: parseInt(authorId) } } : undefined,
      },
    });
    res.json(updatedProject);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Route pour supprimer un projet (DELETE)
app.delete("/projects/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProject = await prisma.project.delete({
      where: { id: parseInt(id) },
    });
    res.json(deletedProject);
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    res.status(500).json({ error: "Impossible de supprimer le projet." });
  }
});

// NOUVELLE ROUTE POUR LA CONNEXION
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "credits invalides" });
    }

    // Compare le mot de passe fourni avec le mot de passe haché
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "credits invalides" });
    }

    // Crée un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "10h" } // Le token expire après 10 heure
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({ error: "An error occurred during login" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
