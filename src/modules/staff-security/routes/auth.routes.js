const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { validate } = require("../../../middlewares/validate");
const { loginSchema, resetPasswordSchema } = require("../validators/auth.validator");
const { authenticateJWT } = require("../../../middlewares/authenticate");

// Routes publiques
router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword
);

// Routes protégées
router.post(
  "/logout",
  authenticateJWT,
  authController.logout
);

router.get(
  "/profile",
  authenticateJWT,
  authController.getProfile
);

router.get(
  "/verify",
  authenticateJWT,
  authController.verifyToken
);

module.exports = router;
