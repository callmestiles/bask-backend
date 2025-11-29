import { Router } from "express";
import * as eventController from "../controllers/eventController";
import { authenticateToken, isAdmin } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes (or authenticated if preferred, keeping public for viewing)
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

// Protected routes
router.post(
  "/",
  authenticateToken,
  isAdmin,
  upload.array("media", 10),
  eventController.createEvent
);
router.post(
  "/:id/register",
  authenticateToken,
  eventController.registerForEvent
);
router.delete(
  "/:id/register",
  authenticateToken,
  eventController.unregisterFromEvent
);

export default router;
