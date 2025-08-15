// src/modules/restaurant/routes/restaurant.routes.js

const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurant.controller');
const { validate } = require('../../../middlewares/validate');
const { restaurantSchema, restaurantIdParam } = require('../validators/restaurant.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Restaurant
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  restaurantController.getAllRestaurants
);

router.get(
  '/:id',
  authenticateJWT,
  validate(restaurantIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  restaurantController.getRestaurantById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(restaurantSchema),
  restaurantController.createRestaurant
);

router.put(
  '/:id',
  authenticateJWT,
  validate(restaurantIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(restaurantSchema),
  restaurantController.updateRestaurant
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(restaurantIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  restaurantController.deleteRestaurant
);

module.exports = router;
