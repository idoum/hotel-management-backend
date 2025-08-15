const User = require('../modules/staff-security/models/user.model');
const Role = require('../modules/staff-security/models/role.model');
const Permission = require('../modules/staff-security/models/permission.model');

// Vérifie que l’utilisateur possède au moins un rôle ou une permission parmi ceux requis
const authorize = ({ roles = [], permissions = [] }) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;
      if (!userId) return res.status(401).json({ message: 'Utilisateur non authentifié' });

      // Récupère l’utilisateur avec ses rôles et permissions
      const user = await User.findByPk(userId, {
        include: {
          model: Role,
          include: Permission,
        },
      });

      if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

      // Récupère tous les noms de rôles et de permissions
      const userRoles = user.Roles.map(r => r.role_name);
      const userPermissions = user.Roles.flatMap(role =>
        role.Permissions.map(p => p.permission_name)
      );

      // Check rôle OU permission (au moins une menée)
      const roleOk = roles.length === 0 || roles.some(role => userRoles.includes(role));
      const permOk = permissions.length === 0 || permissions.some(perm => userPermissions.includes(perm));

      if (!roleOk && !permOk) {
        return res.status(403).json({ message: "Accès refusé : rôle ou permission manquant" });
      }
      next();
    } catch (err) {
      console.error('Erreur authorisation', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
};

module.exports = { authorize };
