const express = require('express');
const router = express.Router();

const permissionController = require('../controllers/permission.controller');
const { validate } = require('../../../middlewares/validate');
const { permissionSchema, permissionIdParam } = require('../validators/permission.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// Debug : Vérifier l'import
console.log('🔍 Permission Controller methods:', Object.keys(permissionController));

// GET toutes les permissions
router.get(
  '/',
  //authenticateJWT,
  //authorize({ roles: ['admin'] }),
  permissionController.getAllPermissions
);

// GET permission par id
router.get(
  '/:id',
  authenticateJWT,
  validate(permissionIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  permissionController.getPermissionById
);

// POST créer permission
router.post(
  '/',
  //authenticateJWT,
  //authorize({ roles: ['admin'] }),
  validate(permissionSchema),
  permissionController.createPermission
);

// PUT modifier une permission
router.put(
  '/:id',
  //authenticateJWT,
  validate(permissionIdParam, 'params'),
  //authorize({ roles: ['admin'] }),
  validate(permissionSchema),
  permissionController.updatePermission
);

// DELETE supprimer permission
router.delete(
  '/:id',
  //authenticateJWT,
  validate(permissionIdParam, 'params'),
  //authorize({ roles: ['admin'] }),
  permissionController.deletePermission
);

// Routes spéciales
router.get('/:id/can-delete', permissionController.canDeletePermission);

module.exports = router;
