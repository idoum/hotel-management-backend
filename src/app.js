// src/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// Middlewares globaux
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ IMPORTANT - Import des associations AVANT les routes
require('./modules/staff-security/associations');

// ========== Import des routes par module ==========

// Staff & sécurité
const authRoutes = require('./modules/staff-security/routes/auth.routes');
const userRoutes = require('./modules/staff-security/routes/user.routes');
const staffRoutes = require('./modules/staff-security/routes/staff.routes');
const roleRoutes = require('./modules/staff-security/routes/role.routes');
const permissionRoutes = require('./modules/staff-security/routes/permission.routes');
const departmentRoutes = require('./modules/staff-security/routes/department.routes');
const actionLogRoutes = require('./modules/staff-security/routes/actionLog.routes');

// Hébergement
const roomTypeRoutes = require('./modules/accommodation/routes/roomType.routes');
const roomRoutes = require('./modules/accommodation/routes/room.routes');
const guestRoutes = require('./modules/accommodation/routes/guest.routes');
const bookingRoutes = require('./modules/accommodation/routes/booking.routes');
const paymentRoutes = require('./modules/accommodation/routes/payment.routes');

// Restaurant
const restaurantRoutes = require('./modules/restaurant/routes/restaurant.routes');
const restaurantTableRoutes = require('./modules/restaurant/routes/table.routes');
const menuItemRoutes = require('./modules/restaurant/routes/menuItem.routes');
const restaurantOrderRoutes = require('./modules/restaurant/routes/restaurantOrder.routes');
const orderItemRoutes = require('./modules/restaurant/routes/orderItem.routes');

// Location de salles/événementiel
const roomRentalRoutes = require('./modules/rental/routes/roomRental.routes');
const rentalReservationRoutes = require('./modules/rental/routes/rentalReservation.routes');

// Maintenance
const maintenanceRoutes = require('./modules/maintenance/routes/maintenanceRequest.routes');

// Piscine
const poolRoutes = require('./modules/pool/routes/pool.routes');
const poolReservationRoutes = require('./modules/pool/routes/poolReservation.routes');

// ========== Montage des routes ==========

// Routes d'authentification (publiques)
app.use('/api/auth', authRoutes);

// Staff & sécurité
app.use('/api/users', userRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/action-logs', actionLogRoutes);

// Hébergement
app.use('/api/room-types', roomTypeRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// Restaurant
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurant-tables', restaurantTableRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/restaurant-orders', restaurantOrderRoutes);
app.use('/api/order-items', orderItemRoutes);

// Location/événementiel
app.use('/api/room-rentals', roomRentalRoutes);
app.use('/api/room-rental-reservations', rentalReservationRoutes);

// Maintenance
app.use('/api/maintenance', maintenanceRoutes);

// Piscine
app.use('/api/pools', poolRoutes);
app.use('/api/pool-reservations', poolReservationRoutes);

// Endpoint racine de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Hotel Management opérationnelle 🚀',
    version: '2.0.0',
    modules: [
      'staff-security', 'accommodation', 'restaurant', 
      'rental', 'maintenance', 'pool'
    ],
    features: [
      'Authentication', 'User Management', 'Role-Based Access Control',
      'Staff Management', 'Department Management', 'Audit Logging'
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected' // À améliorer avec vraie vérification
  });
});

// Connexion et synchronisation de la base
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion MySQL OK');
    return sequelize.sync({ 
      force: true, // ✅ IMPORTANT: Ne pas recréer les tables en production
      alter: process.env.NODE_ENV === 'development' // Permettre ALTER en dev seulement
    });
  })
  .then(() => console.log('✅ Modèles synchronisés'))
  .catch((err) => console.error('❌ Erreur connexion/sequelize :', err));

// Middleware route non trouvée
app.use((req, res, next) => {
  res.status(404).json({ 
    message: 'Route non trouvée',
    path: req.path,
    method: req.method
  });
});

// Middleware global de gestion d'erreur
app.use((err, req, res, next) => {
  console.error('Erreur Express :', err);
  
  // Erreurs de validation Joi
  if (err.isJoi) {
    return res.status(400).json({ 
      message: 'Données invalides', 
      details: err.details.map(d => d.message) 
    });
  }
  
  // Erreurs Sequelize
  if (err.name?.startsWith('Sequelize')) {
    return res.status(500).json({ 
      message: 'Erreur base de données', 
      error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne'
    });
  }
  
  res.status(500).json({ 
    message: 'Erreur serveur', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Erreur interne'
  });
});

module.exports = app;
