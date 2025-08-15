// src/modules/accommodation/routes/room.routes.js

const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room.controller');
const { validate } = require('../../../middlewares/validate');
const { roomSchema, roomIdParam } = require('../validators/room.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Room
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager'] }),
  roomController.getAllRooms
);

router.get(
  '/:id',
  authenticateJWT,
  validate(roomIdParam, 'params'),
  authorize({ roles: ['admin', 'manager'] }),
  roomController.getRoomById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(roomSchema),
  roomController.createRoom
);

router.put(
  '/:id',
  authenticateJWT,
  validate(roomIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(roomSchema),
  roomController.updateRoom
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(roomIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  roomController.deleteRoom
);

module.exports = router;
