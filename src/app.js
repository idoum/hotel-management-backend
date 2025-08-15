// src/app.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Création de l'application Express
const app = express();

// Middleware globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importation routes - staff-security
const staffRoutes = require('./modules/staff-security/routes/staff.routes');
const userRoutes = require('./modules/staff-security/routes/user.routes');
const roleRoutes = require('./modules/staff-security/routes/role.routes');
const permissionRoutes = require('./modules/staff-security/routes/permission.routes');
const departmentRoutes = require('./modules/staff-security/routes/department.routes');
const actionLogRoutes = require('./modules/staff-security/routes/actionLog.routes');

// Importation routes - accommodation (hébergement)
const roomTypeRoutes = require('./modules/accommodation/routes/roomType.routes');
const roomRoutes = require('./modules/accommodation/routes/room.routes');
const guestRoutes = require('./modules/accommodation/routes/guest.routes');
const bookingRoutes = require('./modules/accommodation/routes/booking.routes');
const paymentRoutes = require('./modules/accommodation/routes/payment.routes');

// Importation routes - restaurant
const restaurantRoutes = require('./modules/restaurant/routes/restaurant.routes');
const restaurantTableRoutes = require('./modules/restaurant/routes/table.routes');
const menuItemRoutes = require('./modules/restaurant/routes/menuItem.routes');
const restaurantOrderRoutes = require('./modules/restaurant/routes/restaurantOrder.routes');
const orderItemRoutes = require('./modules/restaurant/routes/orderItem.routes');

// Importation routes - location de salles (rental)
const roomRentalRoutes = require('./modules/rental/routes/roomRental.routes');
const rentalReservationRoutes = require('./modules/rental/routes/rentalReservation.routes');

// Montage des routes
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

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurant-tables', restaurantTableRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/restaurant-orders', restaurantOrderRoutes);
app.use('/api/order-items', orderItemRoutes);

app.use('/api/room-rentals', roomRentalRoutes);
app.use('/api/room-rental-reservations', rentalReservationRoutes);

// Endpoint racine pour test API
app.get('/', (req, res) => {
  res.json({ message: 'API Hotel Management opérationnelle ✅' });
});

// Synchronisation Sequelize à la connexion
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connexion à MySQL réussie');
    return sequelize.sync(); // Synchronise tous les modèles
  })
  .then(() => console.log('✅ Modèles synchronisés'))
  .catch((err) => console.error('❌ Erreur connexion MySQL :', err));

// Middleware erreur 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur Express:', err);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

module.exports = app;
