const express = require('express');
const router = express.Router();

const maintenanceRequestController = require('../controllers/maintenanceRequest.controller');
const { validate } = require('../../../middlewares/validate');
const { maintenanceRequestSchema, maintenanceRequestIdParam } = require('../validators/maintenanceRequest.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// GET toutes les demandes
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  maintenanceRequestController.getAllRequests
);

// GET demande par ID
router.get(
  '/:id',
  authenticateJWT,
  validate(maintenanceRequestIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  maintenanceRequestController.getRequestById
);

// POST création demande
router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  validate(maintenanceRequestSchema),
  maintenanceRequestController.createRequest
);

// PUT mise à jour demande
router.put(
  '/:id',
  authenticateJWT,
  validate(maintenanceRequestIdParam, 'params'),
  authorize({ roles: ['admin', 'manager', 'staff'] }),
  validate(maintenanceRequestSchema),
  maintenanceRequestController.updateRequest
);

// DELETE suppression demande
router.delete(
  '/:id',
  authenticateJWT,
  validate(maintenanceRequestIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  maintenanceRequestController.deleteRequest
);

module.exports = router;
