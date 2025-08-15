// src/modules/accommodation/routes/booking.routes.js

const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/booking.controller');
const { validate } = require('../../../middlewares/validate');
const { bookingSchema, bookingIdParam } = require('../validators/booking.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Booking
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  bookingController.getAllBookings
);

router.get(
  '/:id',
  authenticateJWT,
  validate(bookingIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  bookingController.getBookingById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'staff'] }),
  validate(bookingSchema),
  bookingController.createBooking
);

router.put(
  '/:id',
  authenticateJWT,
  validate(bookingIdParam, 'params'),
  authorize({ roles: ['admin', 'staff'] }),
  validate(bookingSchema),
  bookingController.updateBooking
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(bookingIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  bookingController.deleteBooking
);

module.exports = router;
