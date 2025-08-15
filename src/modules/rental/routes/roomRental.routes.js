// src/modules/rental/routes/roomRental.routes.js

const express = require('express');
const router = express.Router();

const roomRentalController = require('../controllers/roomRental.controller');
const { validate } = require('../../../middlewares/validate');
const { roomRentalSchema, roomRentalIdParam } = require('../validators/roomRental.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// GET toutes les salles
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  roomRentalController.getAllRoomRentals
);

// GET salle par ID
router.get(
  '/:id',
  authenticateJWT,
  validate(roomRentalIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  roomRentalController.getRoomRentalById
);

// POST création salle
router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(roomRentalSchema),
  roomRentalController.createRoomRental
);

// PUT mise à jour salle
router.put(
  '/:id',
  authenticateJWT,
  validate(roomRentalIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(roomRentalSchema),
  roomRentalController.updateRoomRental
);

// DELETE suppression salle
router.delete(
  '/:id',
  authenticateJWT,
  validate(roomRentalIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  roomRentalController.deleteRoomRental
);

module.exports = router;
