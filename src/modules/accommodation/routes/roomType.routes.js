// src/modules/accommodation/routes/roomType.routes.js

const express = require('express');
const router = express.Router();

const roomTypeController = require('../controllers/roomType.controller');
const { validate } = require('../../../middlewares/validate');
const { roomTypeSchema, roomTypeIdParam } = require('../validators/roomType.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD RoomType
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  roomTypeController.getAllRoomTypes
);

router.get(
  '/:id',
  authenticateJWT,
  validate(roomTypeIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  roomTypeController.getRoomTypeById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(roomTypeSchema),
  roomTypeController.createRoomType
);

router.put(
  '/:id',
  authenticateJWT,
  validate(roomTypeIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(roomTypeSchema),
  roomTypeController.updateRoomType
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(roomTypeIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  roomTypeController.deleteRoomType
);

module.exports = router;
