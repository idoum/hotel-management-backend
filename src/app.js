// src/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Démarrage de l'application Express
const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes staff-security
const staffRoutes = require('./modules/staff-security/routes/staff.routes');
const userRoutes = require('./modules/staff-security/routes/user.routes');
const roleRoutes = require('./modules/staff-security/routes/role.routes');
const permissionRoutes = require('./modules/staff-security/routes/permission.routes');
const departmentRoutes = require('./modules/staff-security/routes/department.routes');
const actionLogRoutes = require('./modules/staff-security/routes/actionLog.routes');

// Import routes accommodation
const roomTypeRoutes = require('./modules/accommodation/routes/roomType.routes');
const roomRoutes = require('./modules/accommodation/routes/room.routes');
const guestRoutes = require('./modules/accommodation/routes/guest.routes');
const bookingRoutes = require('./modules/accommodation/routes/booking.routes');
const paymentRoutes = require('./modules/accommodation/routes/payment.routes');

// Montage des routes (API REST structure modulaire)
app.use('/api/staff', staffRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/logs', actionLogRoutes);

app.use('/api/room-types', roomTypeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Route racine pour vérifier le serveur
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l’API Hotel Management ✅' });
});

// Synchronisation Sequelize au démarrage
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à MySQL réussie');
    return sequelize.sync(); // Synchronise les modèles sans "destroy"
  })
  .then(() => console.log('✅ Modèles synchronisés'))
  .catch((err) => console.error('❌ Erreur connexion MySQL :', err));

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware global d’erreur Express
app.use((err, req, res, next) => {
  console.error('Erreur Express:', err);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

module.exports = app;
