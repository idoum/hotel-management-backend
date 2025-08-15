// src/modules/restaurant/routes/restaurantOrder.routes.js

const express = require('express');
const router = express.Router();

const restaurantOrderController = require('../controllers/restaurantOrder.controller');
const { validate } = require('../../../middlewares/validate');
const { restaurantOrderSchema, restaurantOrderIdParam } = require('../validators/order.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Restaurant Orders
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  restaurantOrderController.getAllOrders
);

router.get(
  '/:id',
  authenticateJWT,
  validate(restaurantOrderIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  restaurantOrderController.getOrderById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'staff'] }),
  validate(restaurantOrderSchema),
  restaurantOrderController.createOrder
);

router.put(
  '/:id',
  authenticateJWT,
  validate(restaurantOrderIdParam, 'params'),
  authorize({ roles: ['admin', 'staff'] }),
  validate(restaurantOrderSchema),
  restaurantOrderController.updateOrder
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(restaurantOrderIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  restaurantOrderController.deleteOrder
);

module.exports = router;
