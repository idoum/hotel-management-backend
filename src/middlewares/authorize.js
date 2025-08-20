exports.authorize = (options = {}) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({ message: "Authentification requise" });
      }

      // Vérifier les rôles si spécifiés
      if (options.roles && Array.isArray(options.roles)) {
        const hasRole = options.roles.some(role => user.roles.includes(role));
        if (!hasRole) {
          return res.status(403).json({ 
            message: "Rôle insuffisant", 
            required: options.roles,
            current: user.roles 
          });
        }
      }

      // Vérifier les permissions si spécifiées
      if (options.permissions && Array.isArray(options.permissions)) {
        const hasPermission = options.permissions.some(permission => 
          user.permissions.includes(permission)
        );
        if (!hasPermission) {
          return res.status(403).json({ 
            message: "Permission insuffisante",
            required: options.permissions,
            current: user.permissions 
          });
        }
      }

      // Vérifier si c'est son propre compte (pour certaines actions)
      if (options.ownResource && req.params.id) {
        const resourceId = parseInt(req.params.id);
        if (resourceId !== user.userId && !user.roles.includes('admin')) {
          return res.status(403).json({ message: "Accès autorisé seulement à son propre compte" });
        }
      }

      next();
    } catch (error) {
      console.error('❌ Erreur autorisation:', error);
      return res.status(500).json({ message: "Erreur serveur autorisation" });
    }
  };
};
