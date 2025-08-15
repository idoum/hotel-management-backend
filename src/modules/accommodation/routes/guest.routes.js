// src/modules/accommodation/routes/guest.routes.js

const express = require('express');
const router = express.Router();

const guestController = require('../controllers/guest.controller');
const { validate } = require('../../../middlewares/validate');
const { guestSchema, guestIdParam } = require('../validators/guest.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Guest
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  guestController.getAllGuests
);

router.get(
  '/:id',
  authenticateJWT,
  validate(guestIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  guestController.getGuestById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'staff'] }),
  validate(guestSchema),
  guestController.createGuest
);

router.put(
  '/:id',
  authenticateJWT,
  validate(guestIdParam, 'params'),
  authorize({ roles: ['admin', 'staff'] }),
  validate(guestSchema),
  guestController.updateGuest
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(guestIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  guestController.deleteGuest
);

module.exports = router;
