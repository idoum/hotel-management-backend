const User = require('../models/user.model');
const Role = require('../models/role.model');
const UserRole = require('../models/userRole.model');
const Staff = require('../models/staff.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ActionLog = require('../models/actionLog.model');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// POST création utilisateur lié à un staff
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, staff_id, roles } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password_hash, email, staff_id });
    if (roles && Array.isArray(roles)) {
      for (let roleName of roles) {
        const role = await Role.findOne({ where: { role_name: roleName } });
        if (role) await UserRole.create({ user_id: user.user_id, role_id: role.role_id });
      }
    }
    await ActionLog.create({
      staff_id,
      action_type: 'create',
      description: `Utilisateur ${username} créé`
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// POST login utilisateur
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !user.active) return res.status(401).json({ message: 'Utilisateur inactif ou introuvable' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Mot de passe incorrect' });
    // Générer le token JWT avec userId et staffId
    const token = jwt.sign(
      { userId: user.user_id, staffId: user.staff_id },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'login',
      description: `Login de ${username}`
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
