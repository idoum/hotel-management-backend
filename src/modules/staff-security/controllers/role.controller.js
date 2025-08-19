const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const RolePermission = require('../models/rolePermission.model');
const { Op } = require('sequelize');

// Récupérer tous les rôles avec leurs permissions
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['permission_id', 'permission_name', 'description'],
          through: { attributes: [] } // Exclure les colonnes de la table de liaison
        }
      ],
      order: [['role_name', 'ASC']]
    });

    // Enrichir avec des métadonnées
    const enrichedRoles = roles.map(role => ({
      role_id: role.role_id,
      role_name: role.role_name,
      description: role.description,
      permissions: role.permissions || [],
      permissionsCount: role.permissions ? role.permissions.length : 0,
      usersCount: 0, // À implémenter selon votre modèle User
      canDelete: true // À adapter selon la logique métier
    }));

    res.json(enrichedRoles);
  } catch (error) {
    console.error('Erreur getAllRoles:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer un rôle avec ses permissions
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['permission_id', 'permission_name', 'description'],
          through: { attributes: [] }
        }
      ]
    });

    if (!role) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    const enrichedRole = {
      role_id: role.role_id,
      role_name: role.role_name,
      description: role.description,
      permissions: role.permissions || [],
      permissionsCount: role.permissions ? role.permissions.length : 0,
      usersCount: 0,
      canDelete: true
    };

    res.json(enrichedRole);
  } catch (error) {
    console.error('Erreur getRoleById:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Créer un rôle
exports.createRole = async (req, res) => {
  try {
    const { role_name, description, permissionIds = [] } = req.body;
    
    const newRole = await Role.create({
      role_name,
      description
    });

    // Ajouter les permissions si spécifiées
    if (permissionIds.length > 0) {
      await newRole.setPermissions(permissionIds);
    }

    // Retourner le rôle avec ses permissions
    const roleWithPermissions = await Role.findByPk(newRole.role_id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      ]
    });

    res.status(201).json(roleWithPermissions);
  } catch (error) {
    console.error('Erreur createRole:', error);
    res.status(500).json({ message: "Erreur lors de la création", error: error.message });
  }
};

// Mettre à jour un rôle
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_name, description } = req.body;
    
    const [updatedRowsCount] = await Role.update(
      { role_name, description },
      { where: { role_id: id } }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    const updatedRole = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      ]
    });

    res.json(updatedRole);
  } catch (error) {
    console.error('Erreur updateRole:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// Supprimer un rôle
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Supprimer d'abord les relations dans rolepermission
    await RolePermission.destroy({
      where: { role_id: id }
    });

    // Puis supprimer le rôle
    const deletedRowsCount = await Role.destroy({
      where: { role_id: id }
    });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    res.json({ message: "Rôle supprimé avec succès" });
  } catch (error) {
    console.error('Erreur deleteRole:', error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// Récupérer les permissions d'un rôle
exports.getRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rolePermissions = await RolePermission.findAll({
      where: { role_id: id },
      include: [
        {
          model: Permission,
          as: 'permission',
          attributes: ['permission_id', 'permission_name', 'description']
        }
      ]
    });

    const permissions = rolePermissions.map(rp => rp.permission);
    res.json(permissions);
  } catch (error) {
    console.error('Erreur getRolePermissions:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Mettre à jour les permissions d'un rôle
exports.updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({ message: "permissionIds doit être un tableau" });
    }

    // Vérifier que le rôle existe
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Rôle non trouvé" });
    }

    // Supprimer toutes les permissions actuelles du rôle
    await RolePermission.destroy({
      where: { role_id: id }
    });

    // Ajouter les nouvelles permissions
    if (permissionIds.length > 0) {
      const rolePermissions = permissionIds.map(permissionId => ({
        role_id: parseInt(id),
        permission_id: parseInt(permissionId)
      }));

      await RolePermission.bulkCreate(rolePermissions);
    }

    res.json({ message: "Permissions mises à jour avec succès" });
  } catch (error) {
    console.error('Erreur updateRolePermissions:', error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// Vérifier si un rôle peut être supprimé
exports.canDeleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Compter les utilisateurs ayant ce rôle (à adapter selon votre modèle User)
    // const usersCount = await User.count({ where: { role_id: id } });
    const usersCount = 0; // Placeholder
    
    // Compter les permissions
    const permissionsCount = await RolePermission.count({ where: { role_id: id } });
    
    const canDelete = usersCount === 0; // Ne peut pas supprimer si des utilisateurs ont ce rôle
    
    res.json({
      canDelete,
      usersCount,
      permissionsCount
    });
  } catch (error) {
    console.error('Erreur canDeleteRole:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
