const express = require('express');
const router = express.Router();

const roleController = require('../controllers/role.controller');
const { validate } = require('../../../middlewares/validate');
const { roleSchema, assignPermissionsSchema, roleIdParam } = require('../validators/role.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// GET tous les rôles
router.get(
  '/',
  //authenticateJWT,
  //authorize({ roles: ['admin'] }),
  roleController.getAllRoles
);

// GET rôle par id
router.get(
  '/:id',
  authenticateJWT,
  validate(roleIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  roleController.getRoleById
);

// POST créer rôle
router.post(
  '/',
  //authenticateJWT,
  //authorize({ roles: ['admin'] }),
  validate(roleSchema),
  roleController.createRole
);

// PUT modifier rôle
router.put(
  '/:id',
  //authenticateJWT,
  validate(roleIdParam, 'params'),
 // authorize({ roles: ['admin'] }),
  validate(roleSchema),
  roleController.updateRole
);

// DELETE supprimer rôle
router.delete(
  '/:id',
  authenticateJWT,
  validate(roleIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  roleController.deleteRole
);

// POST assigner des permissions à un rôle
router.post(
  '/:id/permissions',
  authenticateJWT,
  validate(roleIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(assignPermissionsSchema),
  roleController.assignPermissionsToRole
);

module.exports = router;
