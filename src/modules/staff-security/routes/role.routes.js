// src/modules/staff-security/routes/role.routes.js

const express = require('express');
const router = express.Router();

const roleController = require('../controllers/role.controller');
const { validate } = require('../../../middlewares/validate');
const { roleSchema, assignPermissionsSchema, roleIdParam } = require('../validators/role.validator');

const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Role
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  roleController.getAllRoles
);

router.get(
  '/:id',
  authenticateJWT,
  validate(roleIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  roleController.getRoleById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(roleSchema),
  roleController.createRole
);

router.put(
  '/:id',
  authenticateJWT,
  validate(roleIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(roleSchema),
  roleController.updateRole
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(roleIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  roleController.deleteRole
);

// Assigner des permissions à un rôle
router.post(
  '/:id/permissions',
  authenticateJWT,
  validate(roleIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(assignPermissionsSchema),
  roleController.assignPermissionsToRole
);

module.exports = router;
