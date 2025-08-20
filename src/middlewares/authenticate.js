const jwt = require('jsonwebtoken');
const User = require('../modules/staff-security/models/user.model');

const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: "Token d'authentification requis" });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ message: "Format de token invalide" });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Vérifier que l'utilisateur existe toujours et est actif
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.active) {
      return res.status(401).json({ message: "Token invalide ou utilisateur désactivé" });
    }

    // Ajouter les infos utilisateur à la requête
    req.user = {
      userId: decoded.userId,
      staffId: decoded.staffId,
      username: decoded.username,
      roles: decoded.roles || [],
      permissions: decoded.permissions || []
    };

    next();
  } catch (error) {
    console.error('❌ Erreur authentification:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Token invalide" });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expiré" });
    }
    
    return res.status(500).json({ message: "Erreur serveur authentification" });
  }
};
