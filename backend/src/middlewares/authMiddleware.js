const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Accès non autorisé. Token manquant.' });
    }

    // Récupérer le token (supporte "Bearer <token>" ou juste le token)
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.substring(7, authHeader.length) 
      : authHeader;

    if (!process.env.JWT_SECRET) return res.status(500).json({ error: 'Configuration de sécurité incomplète.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Normalisation de l'id utilisateur
    req.user = {
      userId: decoded.userId || decoded.id,
      role: decoded.role
    };

    // Vérifier que le compte existe et n'est pas bloqué
    const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { isBlocked: true } });
    if (!user) return res.status(401).json({ error: 'Votre session n\'est plus valide.' });
    if (user.isBlocked) return res.status(403).json({ error: 'Votre compte a été suspendu par l\'administrateur.' });

    next();
  } catch (error) {
    console.error('❌ Erreur Middleware Auth:', error.message);
    return res.status(401).json({ error: 'Votre session n\'est pas valide.' });
  }
};
