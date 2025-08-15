const User = require('../models/user.model');
const Staff = require('../models/staff.model');
const Role = require('../models/role.model');
const UserRole = require('../models/userRole.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ActionLog = require('../models/actionLog.model');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Récupérer tous les users (+ staff, roles)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Staff },
        { model: Role }
      ]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Récupérer un user par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Staff },
        { model: Role }
      ]
    });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Créer un utilisateur, assigner les rôles
exports.createUser = async (req, res) => {
  try {
    const { username, password, email, staff_id, roles } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password_hash, email, staff_id });
    if (roles && Array.isArray(roles)) {
      for (let roleName of roles) {
        let role = await Role.findOne({ where: { role_name: roleName } });
        if (role) await UserRole.create({ user_id: user.user_id, role_id: role.role_id });
      }
    }
    await ActionLog.create({
      staff_id,
      action_type: 'create',
      description: `Utilisateur ${username} créé`,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Modifier un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    await user.update(req.body);
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'update',
      description: `Modification utilisateur: ${user.username}`
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Désactiver (soft delete) un utilisateur
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    user.active = false;
    await user.save();
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'update',
      description: `Désactivation utilisateur: ${user.username}`,
    });
    res.json({ message: "Utilisateur désactivé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Connexion utilisateur (login)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !user.active) return res.status(401).json({ message: "Utilisateur non trouvé ou désactivé" });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });
    const token = jwt.sign({ userId: user.user_id, staffId: user.staff_id }, JWT_SECRET, { expiresIn: '8h' });
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'login',
      description: `Connexion: ${username}`,
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Déconnexion utilisateur
exports.logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    await ActionLog.create({
      staff_id: user ? user.staff_id : null,
      action_type: 'logout',
      description: `Déconnexion utilisateur: ${user ? user.username : 'inconnu'}`,
    });
    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Modifier mot de passe
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    const { oldPassword, newPassword } = req.body;
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const valid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Ancien mot de passe incorrect" });
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'update',
      description: `Modification mot de passe: ${user.username}`,
    });
    res.json({ message: "Mot de passe modifié" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Reset password via email
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    user.password_hash = await bcrypt.hash(newPassword, 10);
    await user.save();
    await ActionLog.create({
      staff_id: user.staff_id,
      action_type: 'update',
      description: `Reset mot de passe via email: ${user.username}`,
    });
    res.json({ message: "Mot de passe réinitialisé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
