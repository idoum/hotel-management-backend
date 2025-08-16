const express = require('express');
const router = express.Router();

const poolController = require('../controllers/pool.controller');
const { validate } = require('../../../middlewares/validate');
const { poolSchema, poolIdParam } = require('../validators/pool.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// GET toutes les piscines
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  poolController.getAllPools
);

// GET piscine par ID
router.get(
  '/:id',
  authenticateJWT,
  validate(poolIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  poolController.getPoolById
);

// POST création piscine
router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager'] }),
  validate(poolSchema),
  poolController.createPool
);

// PUT mise à jour piscine
router.put(
  '/:id',
  authenticateJWT,
  validate(poolIdParam, 'params'),
  authorize({ roles: ['admin', 'manager'] }),
  validate(poolSchema),
  poolController.updatePool
);

// DELETE suppression piscine
router.delete(
  '/:id',
  authenticateJWT,
  validate(poolIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  poolController.deletePool
);

module.exports = router;
