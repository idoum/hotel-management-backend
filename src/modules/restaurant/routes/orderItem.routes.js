// src/modules/restaurant/routes/orderItem.routes.js

const express = require('express');
const router = express.Router();

const orderItemController = require('../controllers/orderItem.controller');
const { validate } = require('../../../middlewares/validate');
const { orderItemSchema, orderItemIdParam } = require('../validators/orderItem.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Order Items
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  orderItemController.getAllOrderItems
);

router.get(
  '/:id',
  authenticateJWT,
  validate(orderItemIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  orderItemController.getOrderItemById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'staff'] }),
  validate(orderItemSchema),
  orderItemController.createOrderItem
);

router.put(
  '/:id',
  authenticateJWT,
  validate(orderItemIdParam, 'params'),
  authorize({ roles: ['admin', 'staff'] }),
  validate(orderItemSchema),
  orderItemController.updateOrderItem
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(orderItemIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  orderItemController.deleteOrderItem
);

module.exports = router;
