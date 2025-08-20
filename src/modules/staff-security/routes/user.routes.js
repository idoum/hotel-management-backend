const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const { validate } = require("../../../middlewares/validate");
const { userSchema, userIdParam, updatePasswordSchema, updateUserRolesSchema } = require("../validators/user.validator");
const { authenticateJWT } = require("../../../middlewares/authenticate");
const { authorize } = require("../../../middlewares/authorize");

// Routes utilisateurs
router.get(
  "/",
  // authenticateJWT,
  // authorize({ permissions: ['user_read'] }),
  userController.getAllUsers
);

router.get(
  "/:id",
  // authenticateJWT,
  validate(userIdParam, "params"),
  // authorize({ permissions: ['user_read'] }),
  userController.getUserById
);

router.post(
  "/",
  // authenticateJWT,
  // authorize({ permissions: ['user_create'] }),
  validate(userSchema),
  userController.createUser
);

router.put(
  "/:id",
  // authenticateJWT,
  validate(userIdParam, "params"),
  // authorize({ permissions: ['user_update'] }),
  userController.updateUser
);

router.delete(
  "/:id",
  // authenticateJWT,
  validate(userIdParam, "params"),
  // authorize({ permissions: ['user_delete'] }),
  userController.deleteUser
);

// Gestion des rôles
router.get(
  "/:id/roles",
  // authenticateJWT,
  userController.getUserRoles
);

router.put(
  "/:id/roles",
  // authenticateJWT,
  // authorize({ permissions: ['user_update'] }),
  validate(updateUserRolesSchema),
  userController.updateUserRoles
);

// Gestion des permissions
router.get(
  "/:id/permissions",
  // authenticateJWT,
  userController.getUserPermissions
);

// Changement de mot de passe
router.put(
  "/:id/password",
  // authenticateJWT,
  validate(updatePasswordSchema),
  userController.updatePassword
);

module.exports = router;
