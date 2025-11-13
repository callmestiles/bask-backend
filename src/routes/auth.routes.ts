import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  googleAuthCallback,
  getProfile,
} from "../controllers/authController";
import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from "../middleware/validation";

const router = Router();

router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  register
);
router.post("/login", validateLogin, handleValidationErrors, login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", //change this to frontend login route
    session: false,
  }),
  googleAuthCallback
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile
);

export default router;
