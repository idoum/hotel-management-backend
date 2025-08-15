// src/modules/restaurant/routes/menuItem.routes.js

const express = require('express');
const router = express.Router();

const menuItemController = require('../controllers/menuItem.controller');
const { validate } = require('../../../middlewares/validate');
const { menuItemSchema, menuItemIdParam } = require('../validators/menuItem.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Menu Items
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager'] }),
  menuItemController.getAllMenuItems
);

router.get(
  '/:id',
  authenticateJWT,
  validate(menuItemIdParam, 'params'),
  authorize({ roles: ['admin', 'manager'] }),
  menuItemController.getMenuItemById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(menuItemSchema),
  menuItemController.createMenuItem
);

router.put(
  '/:id',
  authenticateJWT,
  validate(menuItemIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(menuItemSchema),
  menuItemController.updateMenuItem
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(menuItemIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  menuItemController.deleteMenuItem
);

module.exports = router;
