const User = require('../models/user.model');
const Staff = require('../models/staff.model');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const ActionLog = require('../models/actionLog.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// Connexion
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier peut être username ou email
    console.log('🚀 Tentative de connexion:', identifier);

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifiant et mot de passe requis" });
    }

    // Chercher l'utilisateur par username ou email
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { username: identifier },
          { email: identifier }
        ]
      },
      include: [
        {
          model: Staff,
          as: 'staff',
          attributes: ['staff_id', 'name']
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
          ]
        }
      ]
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé:', identifier);
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    if (!user.active) {
      console.log('❌ Compte désactivé:', identifier);
      return res.status(401).json({ message: "Compte désactivé" });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log('❌ Mot de passe incorrect:', identifier);
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Collecter toutes les permissions
    const permissions = [];
    if (user.roles) {
      user.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            if (!permissions.find(p => p.permission_id === permission.permission_id)) {
              permissions.push(permission);
            }
          });
        }
      });
    }

    // Générer le token JWT
    const tokenPayload = {
      userId: user.user_id,
      staffId: user.staff_id,
      username: user.username,
      roles: user.roles.map(r => r.role_name),
      permissions: permissions.map(p => p.permission_name)
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Logger la connexion
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'login',
      description: `Connexion réussie: ${user.username}`,
    });

    console.log('✅ Connexion réussie:', user.username);
    
    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        staff: user.staff,
        roles: user.roles.map(r => ({ role_id: r.role_id, role_name: r.role_name })),
        permissions: permissions.map(p => p.permission_name)
      }
    });
  } catch (error) {
    console.error('❌ Erreur login:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Déconnexion
exports.logout = async (req, res) => {
  try {
    const user = req.user; // Vient du middleware auth
    
    if (user) {
      await ActionLog.create({
        staff_id: user.staffId,
        action_type: 'logout',
        description: `Déconnexion: ${user.username}`,
      });
    }

    console.log('✅ Déconnexion:', user?.username || 'inconnu');
    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error('❌ Erreur logout:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Obtenir le profil utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        {
          model: Staff,
          as: 'staff'
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

    // Collecter permissions
    const permissions = [];
    if (user.roles) {
      user.roles.forEach(role => {
        if (role.permissions) {
          role.permissions.forEach(permission => {
            if (!permissions.find(p => p.permission_id === permission.permission_id)) {
              permissions.push(permission);
            }
          });
        }
      });
    }

    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      active: user.active,
      staff: user.staff,
      roles: user.roles,
      permissions
    });
  } catch (error) {
    console.error('❌ Erreur getProfile:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Réinitialiser mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log('🚀 Réinitialisation mot de passe pour:', email);

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email et nouveau mot de passe requis" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Hasher le nouveau mot de passe
    const password_hash = await bcrypt.hash(newPassword, 12);
    
    await user.update({ password_hash });

    // Logger l'action
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'reset_password',
      description: `Réinitialisation mot de passe: ${user.username}`,
    });

    console.log('✅ Mot de passe réinitialisé pour:', user.username);
    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error('❌ Erreur resetPassword:', error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Vérifier le token (refresh)
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: [
        { model: Staff, as: 'staff' },
        { model: Role, as: 'roles', through: { attributes: [] } }
      ]
    });

    if (!user || !user.active) {
      return res.status(401).json({ message: "Token invalide" });
    }

    res.json({
      valid: true,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        staff: user.staff,
        roles: user.roles
      }
    });
  } catch (error) {
    console.error('❌ Erreur verifyToken:', error);
    res.status(401).json({ message: "Token invalide" });
  }
};
