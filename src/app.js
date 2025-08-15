// src/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Création de l'application Express
const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importation des routes du module staff-security
const staffRoutes = require('./modules/staff-security/routes/staff.routes');
const userRoutes = require('./modules/staff-security/routes/user.routes');
const roleRoutes = require('./modules/staff-security/routes/role.routes');
const permissionRoutes = require('./modules/staff-security/routes/permission.routes');
const departmentRoutes = require('./modules/staff-security/routes/department.routes');
const actionLogRoutes = require('./modules/staff-security/routes/actionLog.routes');

// Montage des routes sur un préfixe API modulaire
app.use('/api/staff', staffRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/logs', actionLogRoutes);

// Route racine pour vérification rapide
app.get('/', (req, res) => {
  res.json({ message: 'API Hotel Management opérationnelle ✅' });
});

// Synchronisation base Sequelize au démarrage (non destructive)
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à MySQL réussie');
    return sequelize.sync(); // { alter: true } ou { force: true } en dev si besoin
  })
  .then(() => console.log('✅ Modèles synchronisés'))
  .catch((err) => console.error('❌ Erreur connexion MySQL :', err));

// Gestion erreurs 404 pour les routes inconnues
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware global gestion des erreurs (Express)
app.use((err, req, res, next) => {
  console.error('Erreur Express:', err);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

module.exports = app;
