// src/modules/rental/routes/rentalReservation.routes.js

const express = require('express');
const router = express.Router();

const rentalReservationController = require('../controllers/rentalReservation.controller');
const { validate } = require('../../../middlewares/validate');
const { rentalReservationSchema, reservationIdParam } = require('../validators/rentalReservation.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// GET toutes les réservations
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  rentalReservationController.getAllReservations
);

// GET réservation par ID
router.get(
  '/:id',
  authenticateJWT,
  validate(reservationIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  rentalReservationController.getReservationById
);

// POST création d'une réservation
router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'staff'] }),
  validate(rentalReservationSchema),
  rentalReservationController.createReservation
);

// PUT mise à jour d'une réservation
router.put(
  '/:id',
  authenticateJWT,
  validate(reservationIdParam, 'params'),
  authorize({ roles: ['admin', 'staff'] }),
  validate(rentalReservationSchema),
  rentalReservationController.updateReservation
);

// DELETE suppression d'une réservation
router.delete(
  '/:id',
  authenticateJWT,
  validate(reservationIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  rentalReservationController.deleteReservation
);

module.exports = router;
