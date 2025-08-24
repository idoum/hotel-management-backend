const User = require('../models/user.model');
const Staff = require('../models/staff.model');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const Department = require('../models/department.model');
const ActionLog = require('../models/actionLog.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';


exports.getMe = async (req, res) => {
  try {
    console.log('🚀 auth.controller: Getting current user info');
    
    // L'utilisateur est déjà attaché par le middleware JWT
    const userId = req.user.userId;
    
    const user = await User.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name', 'age', 'contact_info'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['department_id', 'name'],
              required: false
            }
          ],
          required: false
        },
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: 'permissions',
              attributes: ['permission_id', 'permission_name'],
              through: { attributes: [] }
            }
          ],
          required: false
        }
      ]
    });

    if (!user) {
      console.log('❌ auth.controller: User not found for ID:', userId);
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Collecter toutes les permissions uniques
    const permissions = [];
    const permissionIds = new Set();
    
    if (user.roles) {
      user.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            if (!permissionIds.has(permission.permission_id)) {
              permissionIds.add(permission.permission_id);
              permissions.push(permission);
            }
          });
        }
      });
    }

    // Préparer la réponse utilisateur
    const userResponse = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      last_login: user.last_login,
      staff: user.staff ? {
        staff_id: user.staff.staff_id,
        name: user.staff.name,
        age: user.staff.age,
        contact_info: user.staff.contact_info,
        department: user.staff.department
      } : null,
      roles: user.roles ? user.roles.map(r => ({ 
        role_id: r.role_id, 
        role_name: r.role_name 
      })) : [],
      permissions: permissions.map(p => p.permission_name),
      isAuthenticated: true
    };

    console.log('✅ auth.controller: User info retrieved for:', user.username);
    
    res.json({
      success: true,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ auth.controller: Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des informations utilisateur',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
};

// Connexion
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log('🚀 auth.controller: Login attempt for:', identifier);

    // Validation des données d'entrée
    if (!identifier || !password) {
      console.log('❌ auth.controller: Missing credentials');
      return res.status(400).json({ 
        message: "Identifiant et mot de passe requis",
        success: false 
      });
    }

    // Chercher l'utilisateur par username ou email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: identifier },
          { email: identifier }
        ]
      },
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name', 'age', 'contact_info'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['department_id', 'name'],
              required: false
            }
          ],
          required: false
        },
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: 'permissions',
              attributes: ['permission_id', 'permission_name'],
              through: { attributes: [] }
            }
          ],
          required: false
        }
      ]
    });

    if (!user) {
      console.log('❌ auth.controller: User not found:', identifier);
      
      // Logger la tentative d'accès
      await ActionLog.create({
        staff_id: null,
        action_type: 'failed_login',
        description: `Tentative de connexion échouée - utilisateur inexistant: ${identifier}`,
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      }).catch(err => console.error('Failed to log action:', err));
      
      return res.status(401).json({ 
        message: "Identifiants invalides",
        success: false 
      });
    }

    if (!user.active) {
      console.log('❌ auth.controller: Account disabled:', identifier);
      
      await ActionLog.create({
        staff_id: user.staff_id,
        action_type: 'disabled_account_access',
        description: `Tentative d'accès à un compte désactivé: ${user.username}`,
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      }).catch(err => console.error('Failed to log action:', err));
      
      return res.status(403).json({ 
        message: "Compte désactivé. Contactez l'administrateur.",
        success: false 
      });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log('❌ auth.controller: Invalid password for:', identifier);
      
      await ActionLog.create({
        staff_id: user.staff_id,
        action_type: 'failed_login',
        description: `Tentative de connexion avec mot de passe incorrect: ${user.username}`,
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      }).catch(err => console.error('Failed to log action:', err));
      
      return res.status(401).json({ 
        message: "Identifiants invalides",
        success: false 
      });
    }

    // Collecter toutes les permissions uniques
    const permissions = [];
    const permissionIds = new Set();
    
    if (user.roles) {
      user.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            if (!permissionIds.has(permission.permission_id)) {
              permissionIds.add(permission.permission_id);
              permissions.push(permission);
            }
          });
        }
      });
    }

    // Générer le token JWT avec toutes les infos nécessaires
    const tokenPayload = {
      userId: user.user_id,
      staffId: user.staff_id,
      username: user.username,
      email: user.email,
      roles: user.roles ? user.roles.map(r => r.role_name) : [],
      permissions: permissions.map(p => p.permission_name),
      issuedAt: Date.now()
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { 
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'hotel-management-system',
      subject: user.user_id.toString()
    });

    // Préparer la réponse utilisateur
    const userResponse = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      staff: user.staff ? {
        staff_id: user.staff.staff_id,
        name: user.staff.name,
        age: user.staff.age,
        contact_info: user.staff.contact_info,
        department: user.staff.department
      } : null,
      roles: user.roles ? user.roles.map(r => ({ 
        role_id: r.role_id, 
        role_name: r.role_name 
      })) : [],
      permissions: permissions.map(p => p.permission_name),
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };

    // Logger la connexion réussie
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'login',
      description: `Connexion réussie: ${user.username}`,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    }).catch(err => console.error('Failed to log action:', err));

    console.log('✅ auth.controller: Login successful for:', user.username);
    
    res.json({
      success: true,
      token,
      user: userResponse,
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('❌ auth.controller: Login error:', error);
    
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur lors de la connexion", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
};

// Déconnexion
exports.logout = async (req, res) => {
  try {
    const user = req.user; // Vient du middleware auth
    console.log('🚀 auth.controller: Logout for:', user?.username || 'unknown');
    
    if (user) {
      await ActionLog.create({
        staff_id: user.staffId,
        action_type: 'logout',
        description: `Déconnexion: ${user.username}`,
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      }).catch(err => console.error('Failed to log action:', err));
    }

    console.log('✅ auth.controller: Logout completed');
    res.json({ 
      success: true,
      message: "Déconnexion réussie" 
    });

  } catch (error) {
    console.error('❌ auth.controller: Logout error:', error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur lors de la déconnexion", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
};

// Obtenir le profil utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    console.log('🚀 auth.controller: Getting profile for user:', req.user.userId);
    
    const user = await User.findByPk(req.user.userId, {
      include: [
        {
          model: Staff,
          as: 'staff',
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['department_id', 'name'],
              required: false
            }
          ],
          required: false
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
          ],
          required: false
        }
      ]
    });

    if (!user) {
      console.log('❌ auth.controller: User not found for profile:', req.user.userId);
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }

    if (!user.active) {
      console.log('❌ auth.controller: Inactive user profile access:', req.user.userId);
      return res.status(403).json({ 
        success: false,
        message: "Compte désactivé" 
      });
    }

    // Collecter permissions
    const permissions = [];
    const permissionIds = new Set();
    
    if (user.roles) {
      user.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            if (!permissionIds.has(permission.permission_id)) {
              permissionIds.add(permission.permission_id);
              permissions.push(permission);
            }
          });
        }
      });
    }

    const profileData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      active: user.active,
      staff: user.staff,
      roles: user.roles || [],
      permissions: permissions,
      isAuthenticated: true
    };

    console.log('✅ auth.controller: Profile retrieved for:', user.username);
    res.json({
      success: true,
      data: profileData,
      message: 'Profil récupéré'
    });

  } catch (error) {
    console.error('❌ auth.controller: Profile error:', error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur lors de la récupération du profil", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
};

// Vérifier le token (refresh/validation)
exports.verifyToken = async (req, res) => {
  try {
    console.log('🚀 auth.controller: Verifying token for user:', req.user.userId);
    
    const user = await User.findByPk(req.user.userId, {
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
          ],
          required: false
        },
        { 
          model: Role, 
          as: 'roles', 
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              as: 'permissions',
              attributes: ['permission_name'],
              through: { attributes: [] }
            }
          ],
          required: false
        }
      ]
    });

    if (!user || !user.active) {
      console.log('❌ auth.controller: Invalid token - user not found or inactive');
      return res.status(401).json({ 
        valid: false,
        success: false,
        message: "Token invalide" 
      });
    }

    // Collecter permissions pour la réponse
    const permissions = [];
    if (user.roles) {
      const permissionIds = new Set();
      user.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            if (!permissionIds.has(permission.permission_name)) {
              permissionIds.add(permission.permission_name);
              permissions.push(permission.permission_name);
            }
          });
        }
      });
    }

    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      staff: user.staff,
      roles: user.roles ? user.roles.map(r => ({ 
        role_id: r.role_id, 
        role_name: r.role_name 
      })) : [],
      permissions: permissions,
      isAuthenticated: true
    };

    console.log('✅ auth.controller: Token verified for:', user.username);
    res.json({
      valid: true,
      success: true,
      user: userData,
      message: 'Token valide'
    });

  } catch (error) {
    console.error('❌ auth.controller: Token verification error:', error);
    res.status(401).json({ 
      valid: false,
      success: false,
      message: "Token invalide",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Token invalide'
    });
  }
};

// Réinitialiser mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log('🚀 auth.controller: Password reset for:', email);

    if (!email || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Email et nouveau mot de passe requis" 
      });
    }

    // Validation du mot de passe
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: "Le mot de passe doit contenir au moins 8 caractères" 
      });
    }

    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Staff, as: 'staff', required: false }]
    });
    
    if (!user) {
      console.log('❌ auth.controller: Password reset - user not found:', email);
      
      // Ne pas révéler si l'email existe ou non (sécurité)
      return res.json({ 
        success: true,
        message: "Si cette adresse email existe, un nouveau mot de passe a été défini" 
      });
    }

    // Hasher le nouveau mot de passe
    const password_hash = await bcrypt.hash(newPassword, 12);
    
    await user.update({ password_hash });

    // Logger l'action
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'reset_password',
      description: `Réinitialisation mot de passe: ${user.username}`,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    }).catch(err => console.error('Failed to log action:', err));

    console.log('✅ auth.controller: Password reset successful for:', user.username);
    res.json({ 
      success: true,
      message: "Mot de passe réinitialisé avec succès" 
    });

  } catch (error) {
    console.error('❌ auth.controller: Password reset error:', error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur lors de la réinitialisation", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
};

// Changer le mot de passe (utilisateur connecté)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    console.log('🚀 auth.controller: Password change for user:', req.user.username);

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Mot de passe actuel et nouveau requis" 
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: "Le nouveau mot de passe doit contenir au moins 8 caractères" 
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Utilisateur non trouvé" 
      });
    }

    // Vérifier le mot de passe actuel
    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) {
      console.log('❌ auth.controller: Invalid current password');
      return res.status(400).json({ 
        success: false,
        message: "Mot de passe actuel incorrect" 
      });
    }

    // Hasher le nouveau mot de passe
    const password_hash = await bcrypt.hash(newPassword, 12);
    await user.update({ password_hash });

    // Logger l'action
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'change_password',
      description: `Changement de mot de passe: ${user.username}`,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    }).catch(err => console.error('Failed to log action:', err));

    console.log('✅ auth.controller: Password changed for:', user.username);
    res.json({ 
      success: true,
      message: "Mot de passe modifié avec succès" 
    });

  } catch (error) {
    console.error('❌ auth.controller: Password change error:', error);
    res.status(500).json({ 
      success: false,
      message: "Erreur serveur lors du changement de mot de passe", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
    });
  }
};
