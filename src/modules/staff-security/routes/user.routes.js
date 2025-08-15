const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { validate } = require('../../../middlewares/validate');
const {
  userCreateSchema, userUpdateSchema, userIdParam,
  userLoginSchema, passwordUpdateSchema, passwordResetSchema
} = require('../validators/user.validator');
const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// POST login utilisateur
router.post(
  '/login',
  validate(userLoginSchema),
  userController.login
);

// POST logout utilisateur (JWT nécessaire)
router.post(
  '/logout',
  authenticateJWT,
  userController.logout
);

// GET tous les users
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  userController.getAllUsers
);

// GET user par id
router.get(
  '/:id',
  authenticateJWT,
  validate(userIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  userController.getUserById
);

// POST créer user
router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(userCreateSchema),
  userController.createUser
);

// PUT modif user
router.put(
  '/:id',
  authenticateJWT,
  validate(userIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(userUpdateSchema),
  userController.updateUser
);

// DELETE désactiver user (soft delete)
router.delete(
  '/:id',
  authenticateJWT,
  validate(userIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  userController.deactivateUser
);

// PATCH modification du mot de passe
router.patch(
  '/update-password',
  authenticateJWT,
  validate(passwordUpdateSchema),
  userController.updatePassword
);

// POST reset mot de passe
router.post(
  '/reset-password',
  validate(passwordResetSchema),
  userController.resetPassword
);

module.exports = router;
