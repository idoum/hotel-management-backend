
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header manquant ou invalide (format Bearer attendu)' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token d’authentification manquant' });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide ou expiré' });
    }

    // Vérifier que le payload contient les infos nécessaires
    if (!payload.userId) {
      return res.status(403).json({ message: 'Token incomplet: userId manquant' });
    }

    req.user = payload; // { userId, staffId, ... }
    next();
  });
};
