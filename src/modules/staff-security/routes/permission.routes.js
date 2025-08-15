// src/modules/staff-security/routes/permission.routes.js

const express = require('express');
const router = express.Router();

const permissionController = require('../controllers/permission.controller');
const { validate } = require('../../../middlewares/validate');
const { permissionSchema, permissionIdParam } = require('../validators/permission.validator');

const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// CRUD Permission
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  permissionController.getAllPermissions
);

router.get(
  '/:id',
  authenticateJWT,
  validate(permissionIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  permissionController.getPermissionById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(permissionSchema),
  permissionController.createPermission
);

router.put(
  '/:id',
  authenticateJWT,
  validate(permissionIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(permissionSchema),
  permissionController.updatePermission
);

router.delete(
  '/:id',
  authenticateJWT,
  validate(permissionIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  permissionController.deletePermission
);

module.exports = router;
