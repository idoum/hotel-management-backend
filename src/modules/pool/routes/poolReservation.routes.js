const express = require('express');
const router = express.Router();

const poolController = require('../controllers/pool.controller');
const { validate } = require('../../../middlewares/validate');
const { poolReservationSchema, poolReservationIdParam } = require('../validators/poolReservation.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// GET toutes les réservations piscines
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  poolController.getAllReservations
);

// GET réservation par ID
router.get(
  '/:id',
  authenticateJWT,
  validate(poolReservationIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  poolController.getReservationById
);

// POST création réservation piscine
router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  validate(poolReservationSchema),
  poolController.createReservation
);

// PUT mise à jour réservation piscine
router.put(
  '/:id',
  authenticateJWT,
  validate(poolReservationIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  validate(poolReservationSchema),
  poolController.updateReservation
);

// DELETE suppression réservation piscine
router.delete(
  '/:id',
  authenticateJWT,
  validate(poolReservationIdParam, 'params'),
  authorize({ roles: ['admin', 'manager'] }),
  poolController.deleteReservation
);

module.exports = router;
