const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
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

    next();
  } catch (error) {
    console.error('❌ Erreur Middleware Auth:', error.message);
    return res.status(401).json({ error: 'Votre session n\'est pas valide.' });
  }
};
