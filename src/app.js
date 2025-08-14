// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Création d'instance de l'application
const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import des routes par module
const accommodationRoutes = require('./modules/accommodation/routes/accommodation.routes');
const staffSecurityRoutes = require('./modules/staff-security/routes/staff.routes');
const restaurantRoutes = require('./modules/restaurant/routes/restaurant.routes');
const poolRoutes = require('./modules/pool/routes/pool.routes');

// Montage des routes avec un préfixe API
app.use('/api/accommodation', accommodationRoutes);
app.use('/api/staff', staffSecurityRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/pool', poolRoutes);

// Route de test API
app.get('/', (req, res) => {
  res.json({ message: 'API Hotel Management opérationnelle ✅' });
});

app.use('/api/staff', staffSecurityRoutes);


// Synchronisation DB au démarrage de l'app (sans forcer)
// (on peut passer {alter: true} ou {force: true} en dev uniquement)
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à MySQL réussie');
    return sequelize.sync();
  })
  .then(() => console.log('✅ Modèles Sequelize synchronisés'))
  .catch((err) => console.error('❌ Erreur connexion MySQL :', err));

module.exports = app;
