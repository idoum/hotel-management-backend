const Permission = require('../models/permission.model');
const Role = require('../models/role.model');
const RolePermission = require('../models/rolePermission.model');

// Récupérer toutes les permissions
const getAllPermissions = async (req, res) => {
  try {
    console.log('🚀 Récupération des permissions...');
    
    // Solution immédiate : raw query sans associations
    const permissions = await Permission.findAll({
      attributes: ['permission_id', 'permission_name', 'description'],
      raw: true,
      logging: console.log // Voir la requête SQL générée
    });
    
    console.log('✅ Permissions récupérées:', permissions.length);
    
    // Enrichir les données pour le frontend
    const enrichedPermissions = permissions.map(permission => ({
      ...permission,
      canDelete: true, // Par défaut - sera calculé plus tard selon les relations
      roles: [] // Par défaut vide - sera rempli plus tard si nécessaire
    }));
    
    res.json(enrichedPermissions);
  } catch (error) {
    console.error('❌ Erreur détaillée permissions:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({ 
      message: "Erreur serveur permissions", 
      error: error.message,
      type: error.name 
    });
  }
};

// Récupérer une permission par ID
const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀 Récupération permission ${id}...`);
    
    const permission = await Permission.findByPk(id, {
      raw: true
    });
    
    if (!permission) {
      return res.status(404).json({ message: "Permission non trouvée" });
    }
    
    const enrichedPermission = {
      ...permission,
      canDelete: true,
      roles: []
    };
    
    res.json(enrichedPermission);
  } catch (error) {
    console.error(`❌ Erreur get permission ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Créer une permission
const createPermission = async (req, res) => {
  try {
    const { permission_name, description } = req.body;
    console.log('🚀 Création permission:', { permission_name, description });
    
    if (!permission_name) {
      return res.status(400).json({ message: "Le nom de la permission est requis" });
    }
    
    const newPermission = await Permission.create({
      permission_name,
      description: description || null
    });
    
    console.log('✅ Permission créée:', newPermission.toJSON());
    res.status(201).json(newPermission);
  } catch (error) {
    console.error('❌ Erreur create permission:', error);
    
    // Gestion des erreurs spécifiques
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: "Cette permission existe déjà" });
    }
    
    res.status(500).json({ message: "Erreur lors de la création", error: error.message });
  }
};

// Mettre à jour une permission
const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { permission_name, description } = req.body;
    console.log(`🚀 Mise à jour permission ${id}:`, { permission_name, description });
    
    const [updatedRowsCount] = await Permission.update(
      { permission_name, description },
      { where: { permission_id: id } }
    );
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Permission non trouvée" });
    }
    
    const updatedPermission = await Permission.findByPk(id, { raw: true });
    console.log('✅ Permission mise à jour:', updatedPermission);
    res.json(updatedPermission);
  } catch (error) {
    console.error(`❌ Erreur update permission ${req.params.id}:`, error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: "Cette permission existe déjà" });
    }
    
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// Supprimer une permission
const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀 Suppression permission ${id}...`);
    
    // Vérifier si la permission est utilisée par des rôles
    try {
      const rolesUsingPermission = await RolePermission.count({
        where: { permission_id: id }
      });
      
      if (rolesUsingPermission > 0) {
        return res.status(409).json({ 
          message: `Cette permission ne peut pas être supprimée car elle est utilisée par ${rolesUsingPermission} rôle(s)` 
        });
      }
    } catch (relationError) {
      console.warn('⚠️ Erreur vérification relations (table peut ne pas exister):', relationError.message);
    }
    
    const deletedRowsCount = await Permission.destroy({
      where: { permission_id: id }
    });
    
    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: "Permission non trouvée" });
    }
    
    console.log(`✅ Permission ${id} supprimée`);
    res.json({ message: "Permission supprimée avec succès" });
  } catch (error) {
    console.error(`❌ Erreur delete permission ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// Vérifier si une permission peut être supprimée
const canDeletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀 Vérification suppression permission ${id}...`);
    
    let rolesCount = 0;
    try {
      rolesCount = await RolePermission.count({
        where: { permission_id: id }
      });
    } catch (error) {
      console.warn('⚠️ Erreur vérification relations, table peut ne pas exister:', error.message);
    }
    
    const canDelete = rolesCount === 0;
    
    console.log(`✅ Permission ${id} - canDelete: ${canDelete}, rolesCount: ${rolesCount}`);
    res.json({
      canDelete,
      rolesCount
    });
  } catch (error) {
    console.error(`❌ Erreur canDelete permission ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer toutes les permissions avec leurs rôles (version avancée pour plus tard)
const getAllPermissionsWithRoles = async (req, res) => {
  try {
    console.log('🚀 Récupération permissions avec rôles...');
    
    // Version avec associations (à utiliser quand les modèles seront correctement configurés)
    const permissions = await Permission.findAll({
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['role_id', 'role_name'],
          through: { attributes: [] }, // Exclure les colonnes de la table de liaison
          required: false // LEFT JOIN
        }
      ],
      order: [['permission_name', 'ASC']]
    });
    
    const enrichedPermissions = permissions.map(permission => ({
      permission_id: permission.permission_id,
      permission_name: permission.permission_name,
      description: permission.description,
      roles: permission.roles || [],
      canDelete: !permission.roles || permission.roles.length === 0
    }));
    
    res.json(enrichedPermissions);
  } catch (error) {
    console.error('❌ Erreur getAllPermissionsWithRoles:', error);
    // Fallback vers la version simple
    return getAllPermissions(req, res);
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  canDeletePermission,
  getAllPermissionsWithRoles
};

// Debug : Vérifier que toutes les méthodes sont exportées
console.log('🔍 Exported permission controller methods:', Object.keys(module.exports));
