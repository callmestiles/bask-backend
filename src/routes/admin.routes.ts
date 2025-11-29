import { Router } from "express";
import { getUsers, getPosts, getEvents } from "../controllers/adminController";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = Router();

router.get("/users", authenticateToken, isAdmin, getUsers);
router.get("/posts", authenticateToken, isAdmin, getPosts);
router.get("/events", authenticateToken, isAdmin, getEvents);

export default router;
