const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// ==========================================
// 1. INSCRIPTION (POST /api/auth/register)
// ==========================================
exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Vérification des champs requis
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe sont requis.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ 
      where: { email: cleanEmail } 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    // Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Rôles autorisés dans schema.prisma (Enum)
    const VALID_ROLES = ['CANDIDATE', 'RECRUITER', 'ADMIN'];

    // Mappage automatique du rôle :
    // Si le frontend envoie "DIRECTEUR / DIRIGEANT", "RH" ou un texte hors Enum, on attribue RECRUITER.
    let userRole = 'CANDIDATE';
    if (role) {
      const formattedRole = String(role).toUpperCase().trim();
      if (VALID_ROLES.includes(formattedRole)) {
        userRole = formattedRole;
      } else {
        userRole = 'RECRUITER';
      }
    }

    // Création de l'utilisateur dans MySQL
    const newUser = await prisma.user.create({
      data: {
        email: cleanEmail,
        passwordHash,
        role: userRole,
      },
      select: { 
        id: true, 
        email: true, 
        role: true, 
        createdAt: true 
      },
    });

    return res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: newUser,
    });
  } catch (error) {
    console.error('❌ Erreur Register:', error);
    return res.status(500).json({ 
      error: error.message || 'Erreur serveur lors de l inscription.' 
    });
  }
};

// ==========================================
// 2. CONNEXION (POST /api/auth/login)
// ==========================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe sont requis.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // Recherche de l'utilisateur
    const user = await prisma.user.findUnique({ 
      where: { email: cleanEmail } 
    });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    // Génération du token JWT (avec id et userId pour éviter tout conflit)
    const token = jwt.sign(
      { 
        userId: user.id, 
        id: user.id, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    // Réponse au format exact attendu par Next.js
    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('❌ Erreur Login:', error);
    return res.status(500).json({ 
      error: error.message || 'Erreur serveur lors de la connexion.' 
    });
  }
};

// ==========================================
// 3. RECUPERER LA SESSION (GET /api/auth/me)
// ==========================================
exports.getMe = async (req, res) => {
  try {
    // Récupération de l'ID utilisateur injecté par authMiddleware
    const userId = req.user?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Session invalide ou token expiré.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        role: true, 
        createdAt: true 
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    // Réponse au double format (objet `user` et propriétés au niveau racine)
    return res.status(200).json({
      success: true,
      user: user,
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('❌ Erreur GetMe:', error);
    return res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération de la session.' 
    });
  }
};