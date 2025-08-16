// src/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const app = express();

// Middleware globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== Import des routes module par module ==========

// Staff & sécurité
const staffRoutes = require('./modules/staff-security/routes/staff.routes');
const roleRoutes = require('./modules/staff-security/routes/role.routes');
const permissionRoutes = require('./modules/staff-security/routes/permission.routes');
const departmentRoutes = require('./modules/staff-security/routes/department.routes');
const actionLogRoutes = require('./modules/staff-security/routes/actionLog.routes');

// Hébergement - Accommodation
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

// Location de salle
const roomRentalRoutes = require('./modules/rental/routes/roomRental.routes');
const rentalReservationRoutes = require('./modules/rental/routes/rentalReservation.routes');

// Maintenance
const maintenanceRoutes = require('./modules/maintenance/routes/maintenanceRequest.routes');

// ========== Montage des routes ==========

// Staff
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

// Location de salles
app.use('/api/room-rentals', roomRentalRoutes);
app.use('/api/room-rental-reservations', rentalReservationRoutes);

// Maintenance
app.use('/api/maintenance', maintenanceRoutes);

// Endpoint racine pour test API
app.get('/', (req, res) => {
  res.json({ message: 'API Hôtel Management opérationnelle ✅' });
});

// Synchronisation de la base et test de connexion
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion MySQL OK');
    return sequelize.sync();
  })
  .then(() => console.log('✅ Modèles synchronisés'))
  .catch((err) => console.error('❌ Erreur connexion/sequelize :', err));

// Middleware pour route non trouvée
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware global de gestion d’erreur
app.use((err, req, res, next) => {
  console.error('Erreur Express :', err);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

module.exports = app;
