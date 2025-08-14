const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Staff = require('../models/staff.model');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const UserRole = require('../models/userRole.model');
const ActionLog = require('../models/actionLog.model');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Création Staff + user + assignation rôle
exports.createStaffUser = async (req, res) => {
  try {
    const { name, age, contact_info, salary, department_id, username, email, password, roles } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'Champs obligatoires manquants.' });
    }

    // Hasher mot de passe
    const password_hash = await bcrypt.hash(password, 10);

    // Créer Staff
    const staff = await Staff.create({ name, age, contact_info, salary, department_id });

    // Créer User lié au staff
    const user = await User.create({ staff_id: staff.staff_id, username, email, password_hash });

    // Assign roles (table UserRole)
    if (roles && Array.isArray(roles)) {
      for (let roleName of roles) {
        let role = await Role.findOne({ where: { role_name: roleName } });
        if (role) {
          await UserRole.create({ user_id: user.user_id, role_id: role.role_id });
        }
      }
    }

    // Log action
    await ActionLog.create({ staff_id: staff.staff_id, action_type: 'create', description: `Création Staff et User: ${username}` });

    res.status(201).json({ message: 'Personnel et utilisateur créés avec succès', staff, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Authentification
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !user.active) {
      return res.status(401).json({ message: 'Utilisateur non trouvé ou inactif' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Mot de passe invalide' });
    }

    // Générer token JWT
    const token = jwt.sign({ userId: user.user_id, staffId: user.staff_id }, JWT_SECRET, { expiresIn: '8h' });

    // Log action connexion
    await ActionLog.create({ staff_id: user.staff_id, action_type: 'login', description: `Connexion utilisateur ${username}` });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};

// Obtenir tous les staffs (exemple accès admin)
exports.getAllStaff = async (req, res) => {
  try {
    const staffs = await Staff.findAll();
    res.json(staffs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
};
