// src/modules/staff-security/routes/user.routes.js

const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { validate } = require('../../../middlewares/validate');
const {
  userCreateSchema,
  userUpdateSchema,
  userIdParam,
  userLoginSchema,
  passwordUpdateSchema,
  passwordResetSchema
} = require('../validators/user.validator');

const { authenticateJWT } = require('../../../middlewares/authenticate');
const { authorize } = require('../../../middlewares/authorize');

// Authentification
router.post(
  '/login',
  validate(userLoginSchema),
  userController.login
);

router.post(
  '/logout',
  authenticateJWT,
  userController.logout
);

// CRUD User
router.get(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  userController.getAllUsers
);

router.get(
  '/:id',
  authenticateJWT,
  validate(userIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  userController.getUserById
);

router.post(
  '/',
  authenticateJWT,
  authorize({ roles: ['admin'] }),
  validate(userCreateSchema),
  userController.createUser
);

router.put(
  '/:id',
  authenticateJWT,
  validate(userIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  validate(userUpdateSchema),
  userController.updateUser
);

// Désactiver (soft delete)
router.delete(
  '/:id',
  authenticateJWT,
  validate(userIdParam, 'params'),
  authorize({ roles: ['admin'] }),
  userController.deactivateUser
);

// Modifier mot de passe
router.patch(
  '/update-password',
  authenticateJWT,
  validate(passwordUpdateSchema),
  userController.updatePassword
);

// Reset mot de passe via email
router.post(
  '/reset-password',
  validate(passwordResetSchema),
  userController.resetPassword
);

module.exports = router;
