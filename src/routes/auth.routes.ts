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

// Start Google OAuth2 flow. We override callbackURL per-request so the same
// code works for localhost and deployed hosts (Render). Google requires the
// redirect URI to be registered in the Google Console — make sure both
// http://localhost:3000/api/auth/google/callback and
// https://bask-backend.onrender.com/api/auth/google/callback are added there.
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

// Google OAuth callback. We also pass the same callbackURL override here so
// passport verifies the returned `redirect_uri` matches what was sent.
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
