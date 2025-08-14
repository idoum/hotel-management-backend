const UserRole = require('../modules/staff-security/models/userRole.model');
const User = require('../modules/staff-security/models/user.model');
const Role = require('../modules/staff-security/models/role.model');

// Vérifie si l'utilisateur a le rôle demandé
exports.authorizeRole = (roleName) => {
  return async (req, res, next) => {
    const userId = req.user.userId;
    if (!userId) return res.status(403).json({ message: 'Accès refusé' });

    try {
      // Trouver roles utilisateur
      const roles = await UserRole.findAll({
        where: { user_id: userId },
        include: [{ model: Role, where: { role_name: roleName } }]
      });
      if (roles.length === 0) {
        return res.status(403).json({ message: 'Rôle requis non attribué' });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  };
};
