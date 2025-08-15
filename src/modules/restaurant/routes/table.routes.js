// src/modules/restaurant/routes/table.routes.js

const express = require('express');
const router = express.Router();

const tableController = require('../controllers/restaurantTable.controller');
const { validate } = require('../../../middlewares/validate');
const { tableSchema, tableIdParam } = require('../validators/table.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Tables
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager'] }),
  tableController.getAllTables
);

router.get(
  '/:id',
  authenticateJWT,
  validate(tableIdParam, 'params'),
  authorize({ roles: ['admin', 'manager'] }),
  tableController.getTableById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(tableSchema),
  tableController.createTable
);

router.put(
  '/:id',
  authenticateJWT,
  validate(tableIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(tableSchema),
  tableController.updateTable
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(tableIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  tableController.deleteTable
);

module.exports = router;
