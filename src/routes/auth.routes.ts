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
} from "../middleware/authValidation";

const router = Router();

router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  register
);

router.post("/login", validateLogin, handleValidationErrors, login);

router.get("/google", (req, res, next) => {
  const callbackURL =
    process.env.GOOGLE_CALLBACK_URL ||
    `${req.protocol}://${req.get("host")}/api/auth/google/callback`;

  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    callbackURL,
  } as any)(req, res, next as any);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    const callbackURL =
      process.env.GOOGLE_CALLBACK_URL ||
      `${req.protocol}://${req.get("host")}/api/auth/google/callback`;

    return passport.authenticate("google", {
      failureRedirect: "/login", // change this to frontend login route if needed
      session: false,
      callbackURL,
    } as any)(req, res, next as any);
  },
  googleAuthCallback
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile
);

export default router;
