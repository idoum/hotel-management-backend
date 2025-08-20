const User = require('../models/user.model');
const Staff = require('../models/staff.model');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const UserRole = require('../models/userRole.model');
const RolePermission = require('../models/rolePermission.model');
const Department = require('../models/department.model');
const ActionLog = require('../models/actionLog.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const sequelize = require('../../../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Récupérer tous les utilisateurs avec filtres
exports.getAllUsers = async (req, res) => {
  try {
    console.log('🚀 getAllUsers avec filtres:', req.query);
    
    const whereConditions = {};
    
    // Filtres
    if (req.query.search) {
      whereConditions[Op.or] = [
        { username: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } }
      ];
    }
    
    if (req.query.active !== undefined) {
      whereConditions.active = req.query.active === 'true';
    }
    
    const users = await User.findAll({
      where: whereConditions,
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name', 'age', 'contact_info', 'salary'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['department_id', 'name'],
              required: false
            }
          ]
        },
        {
          model: Role,
          as: 'roles',
          attributes: ['role_id', 'role_name', 'description'],
          through: { attributes: [] }
        }
      ],
      order: [['username', 'ASC']]
    });

    // Enrichir avec métadonnées
    const enrichedUsers = users.map(user => ({
      user_id: user.user_id,
      staff_id: user.staff_id,
      username: user.username,
      email: user.email,
      active: user.active,
      staff: user.staff ? {
        staff_id: user.staff.staff_id,
        name: user.staff.name,
        age: user.staff.age,
        contact_info: user.staff.contact_info,
        salary: user.staff.salary,
        department: user.staff.department
      } : null,
      roles: user.roles || [],
      rolesCount: user.roles ? user.roles.length : 0,
      canDelete: user.roles ? user.roles.length === 0 : true, // Ne peut pas supprimer si a des rôles
      lastLogin: null // À implémenter si vous trackez les connexions
    }));

    console.log('✅ Users récupérés:', enrichedUsers.length);
    res.json(enrichedUsers);
  } catch (error) {
    console.error('❌ Erreur getAllUsers:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀 getUserById: ${id}`);

    const user = await User.findByPk(id, {
      include: [
        {
          model: Staff,
          as: 'staff',
          include: [
            {
              model: Department,
              as: 'department',
              required: false
            }
          ]
        },
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: 'permissions',
              attributes: ['permission_id', 'permission_name', 'description'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Calculer toutes les permissions via les rôles
    const allPermissions = [];
    const permissionIds = new Set();
    
    if (user.roles) {
      user.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            if (!permissionIds.has(permission.permission_id)) {
              permissionIds.add(permission.permission_id);
              allPermissions.push(permission);
            }
          });
        }
      });
    }

    const enrichedUser = {
      user_id: user.user_id,
      staff_id: user.staff_id,
      username: user.username,
      email: user.email,
      active: user.active,
      staff: user.staff,
      roles: user.roles || [],
      permissions: allPermissions,
      rolesCount: user.roles ? user.roles.length : 0,
      permissionsCount: allPermissions.length,
      canDelete: user.roles ? user.roles.length === 0 : true
    };

    console.log('✅ User trouvé:', enrichedUser);
    res.json(enrichedUser);
  } catch (error) {
    console.error(`❌ Erreur getUserById ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Créer un utilisateur
exports.createUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { username, password, email, staff_id, role_ids } = req.body;
    console.log('🚀 createUser:', { username, email, staff_id, role_ids });

    // Validations
    if (!username || !password || !email || !staff_id) {
      await transaction.rollback();
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    // Vérifier que le staff existe et n'a pas déjà d'utilisateur
    const staff = await Staff.findByPk(staff_id);
    if (!staff) {
      await transaction.rollback();
      return res.status(400).json({ message: "Employé non trouvé" });
    }

    const existingUser = await User.findOne({ where: { staff_id } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ message: "Cet employé a déjà un compte utilisateur" });
    }

    // Vérifier unicité username et email
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      await transaction.rollback();
      return res.status(400).json({ message: "Ce nom d'utilisateur existe déjà" });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      await transaction.rollback();
      return res.status(400).json({ message: "Cette adresse email existe déjà" });
    }

    // Hasher le mot de passe
    const password_hash = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const newUser = await User.create({
      staff_id,
      username,
      password_hash,
      email,
      active: true
    }, { transaction });

    // Assigner les rôles si fournis
    if (role_ids && Array.isArray(role_ids) && role_ids.length > 0) {
      const userRoles = role_ids.map(role_id => ({
        user_id: newUser.user_id,
        role_id: parseInt(role_id)
      }));

      await UserRole.bulkCreate(userRoles, { transaction });
    }

    // Logger l'action
    await ActionLog.create({
      staff_id,
      action_type: 'create_user',
      description: `Création compte utilisateur: ${username}`,
    }, { transaction });

    await transaction.commit();

    // Récupérer l'utilisateur avec ses relations
    const userWithRelations = await User.findByPk(newUser.user_id, {
      include: [
        { model: Staff, as: 'staff' },
        { model: Role, as: 'roles', through: { attributes: [] } }
      ]
    });

    console.log('✅ User créé:', newUser.user_id);
    res.status(201).json(userWithRelations);
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Erreur createUser:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: "Violation de contrainte d'unicité" });
    }
    
    res.status(500).json({ message: "Erreur lors de la création", error: error.message });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, active } = req.body;
    console.log(`🚀 updateUser ${id}:`, req.body);

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier unicité si changement
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ 
        where: { 
          username,
          user_id: { [Op.ne]: id }
        } 
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Ce nom d'utilisateur existe déjà" });
      }
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ 
        where: { 
          email,
          user_id: { [Op.ne]: id }
        } 
      });
      if (existingEmail) {
        return res.status(400).json({ message: "Cette adresse email existe déjà" });
      }
    }

    // Mise à jour
    await user.update({
      username: username || user.username,
      email: email || user.email,
      active: active !== undefined ? active : user.active
    });

    // Logger l'action
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'update_user',
      description: `Modification utilisateur: ${user.username}`,
    });

    const updatedUser = await User.findByPk(id, {
      include: [
        { model: Staff, as: 'staff' },
        { model: Role, as: 'roles', through: { attributes: [] } }
      ]
    });

    console.log('✅ User mis à jour:', id);
    res.json(updatedUser);
  } catch (error) {
    console.error(`❌ Erreur updateUser ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    console.log(`🚀 deleteUser: ${id}`);

    const user = await User.findByPk(id);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer les relations UserRole d'abord
    await UserRole.destroy({
      where: { user_id: id },
      transaction
    });

    // Logger l'action avant suppression
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'delete_user',
      description: `Suppression utilisateur: ${user.username}`,
    }, { transaction });

    // Supprimer l'utilisateur
    await User.destroy({
      where: { user_id: id },
      transaction
    });

    await transaction.commit();

    console.log('✅ User supprimé:', id);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    await transaction.rollback();
    console.error(`❌ Erreur deleteUser ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};

// Récupérer les rôles d'un utilisateur
exports.getUserRoles = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀 getUserRoles: ${id}`);

    const userRoles = await UserRole.findAll({
      where: { user_id: id },
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['role_id', 'role_name', 'description']
        }
      ]
    });

    const roles = userRoles.map(ur => ur.role);
    console.log(`✅ Rôles utilisateur ${id}:`, roles.length);
    res.json(roles);
  } catch (error) {
    console.error(`❌ Erreur getUserRoles ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Mettre à jour les rôles d'un utilisateur
exports.updateUserRoles = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { role_ids } = req.body;
    console.log(`🚀 updateUserRoles ${id}:`, role_ids);

    if (!Array.isArray(role_ids)) {
      await transaction.rollback();
      return res.status(400).json({ message: "role_ids doit être un tableau" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer tous les rôles actuels
    await UserRole.destroy({
      where: { user_id: id },
      transaction
    });

    // Ajouter les nouveaux rôles
    if (role_ids.length > 0) {
      const userRoles = role_ids.map(role_id => ({
        user_id: parseInt(id),
        role_id: parseInt(role_id)
      }));

      await UserRole.bulkCreate(userRoles, { transaction });
    }

    // Logger l'action
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'update_user_roles',
      description: `Mise à jour rôles utilisateur: ${user.username}`,
    }, { transaction });

    await transaction.commit();

    console.log(`✅ Rôles mis à jour pour utilisateur ${id}`);
    res.json({ message: "Rôles mis à jour avec succès" });
  } catch (error) {
    await transaction.rollback();
    console.error(`❌ Erreur updateUserRoles ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// Changer le mot de passe
exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    console.log(`🚀 updatePassword pour user ${id}`);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Mot de passe actuel et nouveau requis" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe actuel
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    // Hasher le nouveau mot de passe
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Mettre à jour
    await user.update({ password_hash: newPasswordHash });

    // Logger l'action
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'update_password',
      description: `Changement mot de passe: ${user.username}`,
    });

    console.log(`✅ Mot de passe mis à jour pour user ${id}`);
    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error(`❌ Erreur updatePassword ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Obtenir toutes les permissions d'un utilisateur
exports.getUserPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🚀 getUserPermissions: ${id}`);

    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: 'permissions',
              attributes: ['permission_id', 'permission_name', 'description'],
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Collecter toutes les permissions uniques
    const allPermissions = [];
    const permissionIds = new Set();
    
    if (user.roles) {
      user.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            if (!permissionIds.has(permission.permission_id)) {
              permissionIds.add(permission.permission_id);
              allPermissions.push({
                ...permission.toJSON(),
                via_role: role.role_name
              });
            }
          });
        }
      });
    }

    console.log(`✅ Permissions utilisateur ${id}:`, allPermissions.length);
    res.json(allPermissions);
  } catch (error) {
    console.error(`❌ Erreur getUserPermissions ${req.params.id}:`, error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
